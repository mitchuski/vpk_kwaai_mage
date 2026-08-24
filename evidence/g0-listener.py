# G0 -- stand in as the block server and record what the coordinator sends.
#
# The coordinator's local bypass client (shard_cmd.rs:3289 local_inference_call)
# writes:  u32-LE length  ||  rmp_serde::to_vec_named(InferenceRequest)
# We accept, decode, and detokenize. No msgpack package here, so the decoder is
# hand-rolled -- it only needs the subset rmp_serde emits for this struct.

import socket, struct, json, sys, os

PORT = int(sys.argv[1])
TOK = sys.argv[2]

# ---- minimal msgpack decoder (subset) ---------------------------------------
class D:
    def __init__(self, b): self.b, self.i = b, 0
    def u8(self):
        v = self.b[self.i]; self.i += 1; return v
    def take(self, n):
        v = self.b[self.i:self.i+n]; self.i += n; return v
    def val(self):
        c = self.u8()
        if c <= 0x7f: return c                                  # positive fixint
        if c >= 0xe0: return c - 256                            # negative fixint
        if 0x80 <= c <= 0x8f: return self.map(c & 0x0f)         # fixmap
        if 0x90 <= c <= 0x9f: return self.arr(c & 0x0f)         # fixarray
        if 0xa0 <= c <= 0xbf: return self.take(c & 0x1f).decode()  # fixstr
        if c == 0xc0: return None
        if c == 0xc2: return False
        if c == 0xc3: return True
        if c == 0xc4: return self.take(self.u8())                        # bin8
        if c == 0xc5: return self.take(struct.unpack(">H", self.take(2))[0])  # bin16
        if c == 0xc6: return self.take(struct.unpack(">I", self.take(4))[0])  # bin32
        if c == 0xcc: return self.u8()
        if c == 0xcd: return struct.unpack(">H", self.take(2))[0]
        if c == 0xce: return struct.unpack(">I", self.take(4))[0]
        if c == 0xcf: return struct.unpack(">Q", self.take(8))[0]
        if c == 0xd9: return self.take(self.u8()).decode()                # str8
        if c == 0xda: return self.take(struct.unpack(">H", self.take(2))[0]).decode()
        if c == 0xdb: return self.take(struct.unpack(">I", self.take(4))[0]).decode()
        if c == 0xdc: return self.arr(struct.unpack(">H", self.take(2))[0])
        if c == 0xdd: return self.arr(struct.unpack(">I", self.take(4))[0])
        if c == 0xde: return self.map(struct.unpack(">H", self.take(2))[0])
        if c == 0xdf: return self.map(struct.unpack(">I", self.take(4))[0])
        raise ValueError("unhandled msgpack byte 0x%02x at %d" % (c, self.i - 1))
    def arr(self, n): return [self.val() for _ in range(n)]
    def map(self, n): return {self.val(): self.val() for _ in range(n)}

# ---- vocab, for detokenizing --------------------------------------------------
tk = json.load(open(TOK, encoding="utf-8"))
vocab = tk["model"]["vocab"]
id2tok = {v: k for k, v in vocab.items()}
for a in tk.get("added_tokens", []):
    id2tok[a["id"]] = a["content"]

# byte-level BPE: the GPT-2 byte<->unicode map, inverted
def bytes_to_unicode():
    bs = list(range(ord("!"), ord("~")+1)) + list(range(ord("\xa1"), ord("\xac")+1)) \
       + list(range(ord("\xae"), ord("\xff")+1))
    cs = bs[:]; n = 0
    for b in range(256):
        if b not in bs:
            bs.append(b); cs.append(256+n); n += 1
    return dict(zip(bs, [chr(c) for c in cs]))
U2B = {v: k for k, v in bytes_to_unicode().items()}

def detok(ids):
    out = bytearray()
    for i in ids:
        t = id2tok.get(i)
        if t is None:
            out += b"<unk:%d>" % i; continue
        if t.startswith("<|") and t.endswith("|>"):
            out += t.encode(); continue
        out += bytes(U2B.get(ch, ord(ch) if ord(ch) < 256 else 63) for ch in t)
    return out.decode("utf-8", "replace")

# ---- listen -------------------------------------------------------------------
s = socket.socket(); s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(("127.0.0.1", PORT)); s.listen(1)
print("[G0] standing in as a block server on 127.0.0.1:%d" % PORT, flush=True)

def recvn(c, n):
    b = b""
    while len(b) < n:
        ch = c.recv(n - len(b))
        if not ch: return b
        b += ch
    return b

while True:
    conn, _ = s.accept()
    raw = recvn(conn, 4)
    if len(raw) < 4:
        print("[G0] liveness probe (connect/close), ignoring", flush=True)
        conn.close(); continue
    n = struct.unpack("<I", raw)[0]
    buf = recvn(conn, n)
    print("[G0] received %d bytes on the wire" % (4 + len(buf)), flush=True)
    req = D(buf).val()

    print(chr(10) + "=== InferenceRequest, as decoded from the wire ===", flush=True)
    for k in ("session_id", "seq_pos", "payload_type", "shape"):
        print("  %-13s %r" % (k, req.get(k)), flush=True)
    data = req["data"]
    if isinstance(data, list):
        data = bytes(data)
    print("  %-13s %d bytes" % ("data", len(data)), flush=True)

    ids = list(struct.unpack("<%dI" % (len(data)//4), data))
    print(chr(10) + "  token ids (%d): %s%s" % (len(ids), ids[:24], " ..." if len(ids) > 24 else ""), flush=True)
    print(chr(10) + "=== DETOKENIZED FROM THE CAPTURED PAYLOAD ===", flush=True)
    print(detok(ids), flush=True)
    print("=== END ===", flush=True)
    conn.close()
    break

s.close()
