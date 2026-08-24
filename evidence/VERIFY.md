# VERIFY -- how every source claim in this lane was established

Re-runnable. If the vendored clone moves off `50558c6`, re-run everything and re-date
`FINDINGS.md`.

**Pinned artefacts**

| What | Where | Pin |
|---|---|---|
| KwaaiNet source | `~/KwaaiNet-main` (vendored, never edited) | `main` @ `50558c695987470910366ba4004e403963e4ae7f`, 2026-08-20, workspace version `0.5.5` |
| Release binaries | downloaded from GitHub releases | tag `v0.5.4` -- **not** the same as the source above |
| VPK whitepaper | kwaai.ai/workgroups/VPKwhitepaper -- a local text extract is kept beside this file but is **git-ignored**: it is Kwaai's copyrighted text, quoted here, not redistributed | retrieved 2026-08-20 |
| Star chart canon | `~/game42/AXIOMS.md`, `~/game42/game-of-42.json`, `~/game42/src/citykey.js` | read 2026-08-20 |
| Star chart data | `~/agentprivacy.guide/site/star-chart/data/labs.json`, `index.html` | built 2026-08-18 |

    cd ~/KwaaiNet-main && git rev-parse HEAD    # must print 50558c6...

---

## F1 -- token IDs on the wire

    sed -n '48,56p'  core/crates/kwaai-cli/src/block_rpc.rs     # PayloadType::TokenIds "first node only"
    sed -n '215,262p' core/crates/kwaai-cli/src/shard_api.rs    # tokenizer.encode -> token_ids_to_bytes
    grep -n 'embed_tokens\|lm_head' core/crates/kwaai-cli/src/hf.rs | head

Expect: `is_first` gets `model.embed_tokens.*` (`hf.rs:334`, `:557`), `is_last` gets
`model.norm.*` + `lm_head.*`. The coordinator gets neither, so it cannot embed.

## F2 -- no local inference path in the ARM64 release

    grep -n -A15 'fn spawn_inference' core/crates/kwaai-cli/src/shard_api.rs
    sed -n '120,130p' core/crates/kwaai-cli/Cargo.toml          # default = ["storage","rag"]

Against the binary (any of these returning non-zero would falsify it):

    for s in llama_backend_init ggml_backend llama-cpp-2 llama_model_load; do
      printf '%-22s ' "$s"; grep -aoc "$s" kwaainet-aarch64-unknown-linux-gnu/kwaainet; done
    # observed: 0 0 0 0

## F3 -- two ladders, and selection uses the behavioural one

    sed -n '85,91p'   core/crates/kwaai-trust/src/trust_score.rs   # credential tiers .70/.40/.10
    sed -n '275,286p' core/crates/kwaai-cli/src/reputation.rs      # 0.5*avail+0.3*tput+0.2*lat, n<5 -> Unknown
    sed -n '1153,1168p' core/crates/kwaai-cli/src/shard_cmd.rs     # ReputationStore -> entry.trust_score
    sed -n '2884,2900p' core/crates/kwaai-cli/src/shard_cmd.rs     # filter(coverage), filter(!failed), sort_by(...)

Negative claim -- no gate anywhere:

    grep -rniE 'min_trust|minimum_trust|required_tier|min_tier|trust_threshold' \
      --include=*.rs core/crates/
    # observed: nothing outside the two scoring functions

## F4 -- no crypto in the storage path

    grep -rniE 'encrypt|aes|cipher|phe|homomorph' --include=*.rs core/crates/kwaai-storage/src
    # observed: exactly one hit, the doc comment at lib.rs:3
    grep -rniE 'encrypt|aes|cipher|phe' --include=*.rs \
      core/crates/kwaai-cli/src/storage.rs core/crates/kwaai-rag/src/
    # observed: nothing

Corroborated by the whitepaper: "replacing the current transport-only encryption".

## F6 -- kwaai-compression is tensors

    ls core/crates/kwaai-compression/src/     # error.rs lib.rs quantization.rs sparse.rs
    sed -n '1,20p' core/crates/kwaai-compression/src/lib.rs

## F8 -- the Pi 4 fp16 trap

Release assets and their contents:

    curl -sL https://api.github.com/repos/Kwaai-AI-Lab/KwaaiNet/releases/latest | grep '"name"'
    tar -tvf kwaainet-aarch64-unknown-linux-gnu.tar.xz   # kwaainet + README + p2pd

Source of the flag:

    cat core/.cargo/config.toml
    # [target.aarch64-unknown-linux-gnu] rustflags = ["-C","target-feature=+fp16,+fullfp16"]

The instructions actually emitted (needs an LLVM objdump; any aarch64-capable one works):

    llvm-objdump -d --no-show-raw-insn kwaainet-aarch64-unknown-linux-gnu/kwaainet \
      | grep -cE '\b(fadd|fsub|fmul|fdiv|fmla|fmls)[ \t]+(v[0-9]+\.[48]h|h[0-9]+)'
    # gnu build: hundreds. musl build: 0.

Which functions (this is what makes it a real risk rather than dead code):

    llvm-objdump -d --no-show-raw-insn <gnu-binary> \
      | awk '/^[0-9a-f]+ </{sym=$0} /fmla[ \t]+v[0-9]+\.8h/{print sym}' | sed 's/.*<//;s/>.*//' | sort -u
    # observed: gemm_f16::microkernel::neonfp16::*, half::binary16::arch::aarch64::multiply_f16_fp16

glibc floor:

    grep -ao 'GLIBC_2\.[0-9]*' kwaainet | sort -uV | tail -1    # GLIBC_2.34

Cortex-A72 (Pi 4) is ARMv8.0-A and lacks FEAT_FP16; Cortex-A76 (Pi 5) is ARMv8.2-A and has it.
**Not yet observed on hardware** -- the SIGILL prediction is from the ISA, not from a crash we
have seen. Confirm at G0.

## S1/S2 -- star chart bit ordering

    python -c "import json;d=json.load(open('data/labs.json'));print([(x['id'],x['bit']) for x in d['strands']])"
    # observed: protection 0, delegation 1, compute 2, memory 3, connection 4, value 5
    sed -n '10,32p' ~/game42/AXIOMS.md
    # canon A1: protection 5 (vertex 32), delegation 4 (16), memory 3 (8),
    #           connection 2 (4), compute 1 (2), value 0 (1)
    grep -n '\.bit' ~/agentprivacy.guide/site/star-chart/index.html
    # single use, line 383: const stride = 1 << (s.bit % 3), onU = s.bit < 3   -> seating only

Colours cross-checked and all six match between `labs.json` and `game-of-42.json`.

## Ladder arithmetic (STAR-CHART section 3)

    python -c "
    v=[63,62,58,56,32]
    print('filtration:', all(v[i+1] & v[i] == v[i+1] for i in range(len(v)-1)))
    print('neg fixed:', [x for x in range(64) if (64-x)%64==x])"
    # expect: filtration True ; neg fixed [0, 32]

## Not verified

- No live two-node mesh (gate G0). F1 and F2 are read-from-source.
- No hardware run on a Pi 4. F8's SIGILL is predicted, not observed.
- The whitepaper's benchmark numbers, PHE tier claims, and cited papers are **REPORTED**. None
  were re-derived.
