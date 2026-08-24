# notes

The research findings of this lane, written as a note series in the house
format: a `Status:` block naming the pins, per-claim tiers, and ASCII
throughout. They are meant to be synced into a research corpus or forked as
wiki pages, and each stands alone.

Every source claim is checkable against `Kwaai-AI-Lab/KwaaiNet` at `main`
commit `50558c6` (workspace 0.5.5) and the `v0.5.4` release binaries. Commands
are in `../evidence/VERIFY.md`.

| # | Note | What it establishes | Strongest tier |
|---|---|---|---|
| 01 | [The inference wire](01-inference-wire-note.md) | The first peer in a chain receives the prompt as token IDs, and that is structural -- the coordinator has no embedder. Recovering it needs a tokenizer and no key. | **OBSERVED** (gate G0) |
| 02 | [Two trust ladders](02-trust-ladders-note.md) | There are two trust scores; peer selection uses the behavioural one; the credential trust graph never touches selection; neither gates. | VERIFIED |
| 03 | [The disclosure ladder, measured](03-disclosure-ladder-measured-note.md) | The ladder is a partial order, not a chain -- and a telling inverted its source. A generated stand-in can assert the negation of what it stands for; a ciphertext cannot. | **MEASURED** (negative) |
| 04 | [The moving ceiling](04-moving-ceiling-compliance-note.md) | A compliance tier is a claim with a shelf life. The decoder improves while the archive sits still. One parameter, no protocol change. | MODEL + REPORTED |
| 05 | [Multiplicative gating](05-multiplicative-gating-note.md) | PHE is one factor of three, so the ladder composes rather than competes -- and an inference chain is the multi-agent case where per-channel leakage falls as system exposure rises. | MODEL + VERIFIED |
| 06 | [Eight practices](06-node-host-practices-note.md) | What a node operator can adopt tomorrow, none of it requiring any of the above. | PRACTICE |

## Reading orders

**A KwaaiNet maintainer:** 01, 02. Both are about your code, both are
re-runnable, and 02 section 6 is the friendly first pull request.

**The VPK working group:** 04 first -- it is one parameter added to an existing
programme -- then 05, then 03 as evidence the method is measured rather than
argued.

**Someone hosting a node:** 06, then 01.

**Someone deciding whether to trust any of this:** 03. It is the note where the
lane's own mechanism failed, reported at the prominence of the design.

## What is not settled

- The wire was observed on the **local bypass transport**, not libp2p to a
  remote peer. The payload claim is observed; the remote-transport claim is
  inferred from shared code. See `../OBSERVATION.md` section 4.
- The quality question in note 03 was graded by hand on two of twelve pages.
- Note 04's drift is unparameterised, and note 05's multiplicative form is
  architectural rather than measured. Both say so in their own text.

## Posture

None of this has been posted. `../ISSUE_DRAFT.md` is what would go upstream:
the documentation fix first, the questions as questions, and the design
mentioned only in the last three paragraphs.
