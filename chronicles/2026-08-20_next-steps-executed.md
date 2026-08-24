# 2026-08-20 -- next steps executed

**Verdict first.** The canon fixes landed cleanly, one finding dissolved on contact with the
code, and the research lane now exists as a wiki space seated on the protection strand. The
self-referential loop is one step in: `kwaai.localhost` is built and registered, and the ladder
is running over its own argument. Nothing granted, nothing published, the wire still unwatched.

## S1 and S2 -- landed, and better than the plan said

I had expected to have to settle for a non-breaking workaround, on the assumption that the star
chart's `bit` field was consumed by the shared engine and could not be renamed without rippling
into `~/transmediale`. It is not. The consumer line -- `const stride = 1 << (s.bit % 3)` -- is
**injected by `tools/star-chart.mjs` itself**. The whole thing is owned by one file, so the clean
fix was available.

Done in the generator and mirrored into the already-built site:

- `bit` renamed to **`seat`**, values unchanged, so the torus seating is byte-identical.
- **`latticeAxisVertex`** added from canon: protection 32, delegation 16, memory 8, connection 4,
  compute 2, value 1. Checked against `AXIOMS.md` A1, not typed from memory.
- The injected line now carries a comment saying `seat` is placement only and naming where the
  real lattice value lives.
- The `axisCanon` meta line claimed the stratum-1 roots while shipping only colours. It now ships
  both, so the claim is true.

The landmine A1 was written to prevent -- someone computing `1 << axisIndex` and getting
protection wrong -- is closed.

## S4 -- dissolved

The kappa collision I flagged does not exist in the implementation. `~/vpk/pathways/compress.js`
already uses `kappa()` for the content address and calls the compression ratio `ratio`. The
collision lived only in the planning document and the chronicle written from it.

Recorded rather than quietly deleted: a finding that dies on contact with the code is a useful
thing to have said out loud, because it is evidence the reading was shallow at that point. The
lesson is the same one this lane keeps relearning -- **ground in the shipped code, not in the
plan that preceded it.**

## Move 1 -- `kwaai.localhost` exists

Twelve pages, built by `vpk_kwaai/build-site.js`, every internal link resolving:

> Welcome Visitors · The Inference Seam · Two Trust Ladders · What The Store Holds · The Pi Is
> Bob · Semantic Minimization · The Disclosure Ladder · The Receipt · Binding To The Star Chart ·
> How To Check This · What This Does Not Prove · The Address

The prose is the **shareable face** of the lane, written under one rule stated in the builder
itself: no claim may appear there that `FINDINGS.md` does not carry with its command. The two
pages that matter most for honesty are *How To Check This* and *What This Does Not Prove*, and
they are linked from the front page rather than buried.

Registered in `~/vpk/pathways/sites.json` as **uncharted** -- grantable locally, not requestable
by public id, because the public star chart does not seat it yet. Charting it is a separate act
that touches the guide snapshot, and it is a door.

## Move 2 -- running

`node pathways/ladder.js --sites=kwaai` with `gemma3:4b`, generating D1/D2/D3 tellings for all
twelve pages. Ollama is up and the default model is present.

This is the self-referential test: the lane's own argument, compressed by the mechanism the lane
proposes. The question with a knowable right answer is whether a reader at D2 still reaches the
same conclusion about the inference seam and the two trust ladders. We know what the conclusion
should be, so for once the quality question can be marked rather than argued.

The guard is already known to bite -- an earlier D1 came out 1.44x longer than its source. If
these pages ladder cleanly it is weak evidence; if they do not, it is strong evidence, and either
way it is a number rather than a claim.

## Not done

- **G0.** The KwaaiNet wire is still unwatched. Independent of everything above and still first
  in line before anything is said upstream.
- **Move 3.** Granting a real peer a real slice needs a peer and a keeper's approval at a CLI.
  Deliberately not automatable.
- **Charting.** Seating `kwaai` in the public star chart's site table.
- **Publication.** Two repositories, a licence ruling, and a decision that is not mine.
