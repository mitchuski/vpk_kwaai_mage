# OBSERVATION -- G0

**Gate G0 closed 2026-08-20.** The prompt was captured off a live KwaaiNet wire and
detokenized. F1 moves from VERIFIED (read in source) to **OBSERVED**, with the scope limit in
section 4 stated precisely.

---

## 1. What was run

A stand-in block server, on the machine, in place of a real one.

The coordinator's local bypass client (`shard_cmd.rs:3289`, `local_inference_call`) writes
`u32-LE length || rmp_serde::to_vec_named(InferenceRequest)` to a TCP port it reads from
`~/.kwaainet/run/shard_local.port`. So: write that file, listen on the port, accept, decode.

    kwaainet.exe shard run "<prompt>" --local --model-path ./model --max-tokens 1

`--model-path` pointed at a directory containing **only** `tokenizer.json` (Qwen2.5-0.5B, chosen
because it is ungated). No weights were downloaded and none were needed -- the coordinator
tokenizes, finds the port file live, and dispatches before any model load.

Binary: `kwaainet-x86_64-pc-windows-msvc` from the `v0.5.4` release. Decoder: hand-rolled msgpack
subset, no third-party package.

## 2. What arrived

    [G0] received 203 bytes on the wire

    === InferenceRequest, as decoded from the wire ===
      session_id    7969888046795372133
      seq_pos       0
      payload_type  'token_ids'
      shape         [29]
      data          116 bytes

      token ids (29): [128245, 151644, 872, 198, 36592, 220, 19, 19, 16, 22, 12510,
                       6785, 369, 18803, 5049, 16, 26, 653, 537, 35233, 311, 279, 72531, 624] ...

    === DETOKENIZED FROM THE CAPTURED PAYLOAD ===
    <s><|im_start|>user
    Patient 4417 tested positive for BRCA1; do not disclose to the insurer.
    <|im_end|>
    <|im_start|>assistant
    === END ===

`116 = 29 x 4`, consistent with the documented `u32-LE` encoding. Total wire cost of a
29-token prompt: **203 bytes**.

## 3. What this settles

- **`payload_type` is `token_ids` on a live wire.** Not inferred from an enum definition --
  read off the socket.
- **Recovery needs nothing but the tokenizer.** No key, no model weights, no inference, no
  attack. A vocabulary file and four lines of `struct.unpack`. The party at the other end of
  that socket holds the prompt in the same sense the author does.
- **The instruction not to disclose travelled inside the thing being disclosed.** The prompt
  said "do not disclose to the insurer" and that sentence is now in a log on a machine the
  author does not control. That is the shape of the problem in one line, and it is why the gate
  has to sit *before* tokenization rather than anywhere after it.

## 4. What this does NOT settle -- read before quoting

**The transport observed is the local bypass, not libp2p.** The captured stream was TCP on
`127.0.0.1`. A production chain uses the `/kwaai/inference/1.0.0` libp2p protocol to a remote
peer.

What carries across, and why the finding still stands: **both paths construct the same struct
with the same call.** The bypass path at `shard_cmd.rs:3097-3104` builds

    let (shape, data) = token_ids_to_bytes(&current_ids);
    let request = InferenceRequest { session_id, seq_pos, payload_type: PayloadType::TokenIds, shape, data };

and the distributed path at `shard_api.rs:260` calls the same `token_ids_to_bytes(&current_ids)`
into the same struct. The **payload** claim is therefore observed. The claim that *a remote peer
receives this over libp2p* remains inferred from shared code, and should keep saying so.

**Still not done:**

- A real two-node mesh with a remote peer at position 1. That needs `kwaainet start --daemon`,
  which joins a public DHT and announces a node -- an outward-facing act, and a door.
- The `--local` path was used. The distributed dispatcher (`shard_cmd.rs:2866`) was not
  exercised.
- The chat template in the capture is Qwen's, because a Qwen tokenizer was supplied. With
  Llama-3.1 it would be `<|start_header_id|>`. Irrelevant to the finding.
- Nothing about hidden-state inversion at positions 2..N.

## 5. Reproduce

    curl -LO https://github.com/Kwaai-AI-Lab/KwaaiNet/releases/latest/download/kwaainet-x86_64-pc-windows-msvc.zip
    curl -o model/tokenizer.json https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct/resolve/main/tokenizer.json
    python listener.py 48999 model/tokenizer.json &
    echo -n 48999 > ~/.kwaainet/run/shard_local.port
    ./kwaainet.exe shard run "<prompt>" --local --model-path ./model --max-tokens 1

The listener is kept at `evidence/g0-listener.py`. It fails on the first connection unless it
tolerates a zero-byte accept: `shard_cmd.rs:754` opens and immediately closes a TCP connection as
a liveness check on the port file before dispatching.

## 6. Consequence for the upstream conversation

`ISSUE_DRAFT.md` question 3 can now be asked from observation rather than from reading. The
wording should stay a question -- this is very likely a known and accepted trade-off for the
current phase -- but it no longer needs the hedge "I have not run this".

The one sentence worth putting in front of a working group:

> A 29-token prompt costs 203 bytes on the wire, and recovering it from that payload requires a
> tokenizer and no key.
