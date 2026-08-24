# vpk_kwaai_mage

Research, measurements and a design proposal for the **inference-side** disclosure problem in
[KwaaiNet](https://github.com/Kwaai-AI-Lab/KwaaiNet) and the Kwaai Foundation's
**Virtual Private Knowledge (VPK)** protocol. Offered as an **early contribution to the VPK
working group's pathway**: the seam is named with observed evidence, a candidate mechanism for
it is proposed, and — unusually for a proposal — the mechanism arrives already measured, with
its own negative results and the guard those results forced.

Opened 2026-08-20 as a private research lane; published 2026-08-24. Nothing has been posted
upstream yet — this repository *is* the first outward act, so that anything said to the
maintainers or the working group can point at checkable documents rather than claims in a
message. The disclosure ladder it proposes is **already running** on our own corpus in a
sibling lane (`PATHWAY.md` section 10.1), which is where its measurements — two rounds of
them, both partly unflattering — come from.

`ADDRESS.md` says who this is from and why, and names where it can be reached.

## Why this is useful to the VPK pathway

The VPK whitepaper closes the storage side and states its own open condition on the inference
side: the sMCP guarantee holds "where Alice's AI model runs locally or in a trusted enclave."
This repository is aimed at exactly that sentence, and contributes five things to the working
group's stated aims:

1. **The open seam, evidenced rather than asserted.** The distributed inference path ships the
   prompt to the first peer as raw token IDs. That was verified in source, then **observed on a
   live wire and detokenized with nothing but a vocab file** (`OBSERVATION.md`), with the scope
   limit stated. Aim 1 (a compliance spec) needs its residuals named; this names the largest one.
2. **A third enforcement position that composes with PHE instead of competing.** Bound the
   disclosure, then prove the bound: trust-tiered semantic compression, content-addressed,
   bilaterally receipted (`PATHWAY.md`). Multiplicative gating (`CONVERGENCE.md`) argues PHE is
   one factor of three — so this strengthens the mathematics camp's story where PHE cannot yet
   reach, rather than replacing it.
3. **The failure mode any minimization approach must budget for, with numbers.** Two measured
   runs (`MEASUREMENTS.md`) show a compressed telling can fluently assert the *opposite* of the
   fact it protects — a failure mode ciphertext does not have — that model scale does **not**
   fix it on confusable-pair content, and that a cheap entailment guard catches it while
   introducing its own errors. Anyone building on semantic minimization, VPKbench included,
   needs these numbers before production, and they are cheaper to inherit than to rediscover.
4. **A shelf-life parameter for compliance tiers.** The Privacy-Is-Value convergence
   (`CONVERGENCE.md`) gives Aim 1 a clock: a tier claim decays as decoders improve, so a
   compliance tier should carry an expiry, one parameter, no protocol change.
5. **Small, immediately actionable findings for maintainers and node hosts** — a storage
   doc-comment fix that is a natural first PR, the two-trust-ladders clarification, and the
   Pi-class build guidance (`FINDINGS.md`, `notes/`).

The method is the meta-contribution: every claim is tiered (VERIFIED / REPORTED / OPEN /
THESIS), negative results are published with the same care as the design, and the corpus this
was all measured on is the lane's own argument — so a reader can check whether a two-tiers-down
telling of these findings still says something true, because we already did, and it didn't
always.

## Start here

| If you are | Read |
|---|---|
| a KwaaiNet maintainer or contributor | `FINDINGS.md`, then `ISSUE_DRAFT.md`. Everything is checkable against `main` at `50558c6`; the commands are in `evidence/VERIFY.md`. |
| from the VPK working group | this page, then `PATHWAY.md` sections 2, 7 and 8. Section 8 is what the proposal is *not*. |
| running a node on small hardware | `FINDINGS.md` F8. If you are on a Raspberry Pi 4, install the **musl** build, not the default. |
| following our own work | `CONNECTIONS.md` and `STAR-CHART.md`. `GLOSSARY.md` translates between the two vocabularies. |

## The problem

VPK closes the **storage** side of retrieval. The storage host holds ciphertext, returns
`(scrambled_index, score)` pairs, and never reads a document. That guarantee is real, and the
whitepaper argues it carefully.

The **inference** side of the same node is open. KwaaiNet's distributed path tokenizes the
prompt locally and sends **raw token IDs** to the first peer in the chain -- `PayloadType::TokenIds`,
documented in the source as "first node only", because the embedding table lives on the first
block server and the coordinator has no embedder. Every plaintext chunk that local RAG just
retrieved is handed to that peer in a form that detokenizes back to English immediately.

The whitepaper states the condition honestly: sMCP's guarantee holds "for deployments where
Alice's AI model runs locally or in a trusted enclave." On a heterogeneous inference mesh that
condition does not hold. **The residual is the plaintext context window on someone else's
machine.**

## The proposal, in one paragraph

Close it by *semantic minimization* rather than by homomorphic inference. Homomorphic inference
is not deployable and this proposal does not pretend otherwise. But nothing forces a data owner
to send the documents. They can send a **compressed re-expression** whose invariant core is
content-addressed, whose fidelity tier is chosen by the receiving peer's position in the trust
graph, and whose release is signed by both parties. The document never leaves. A telling of it
does, at a fidelity the counterparty earned. `PATHWAY.md` is the full design.

Three enforcement layers, none of them a single point of failure for the others:

| Layer | Mechanism | What it reaches |
|---|---|---|
| Mathematics | PHE, key isolation -- VPK's substrate | prevents harm by design |
| **Minimization** | **tiered tellings, content-addressed, trust-gated -- this lane** | **bounds what harm is possible, and proves afterwards exactly what was released** |
| Contracts | IEEE P7012 / MyTerms, audit logs | reaches intent, purpose limitation, downstream use |

The whitepaper frames an unresolved debate between the contract camp and the mathematics camp.
This lane submits a third position that is neither: **bound the disclosure, then prove the
bound.** Weaker than a cryptographic guarantee, stronger than a promise, and it applies where
PHE cannot go. Which of the three carries the weight for a given corpus is the operator's call.

## Layout

| File | What it is |
|---|---|
| `FINDINGS.md` | Verified facts about the shipping code, each with evidence and method. **Read first.** |
| `ADDRESS.md` | The offer: a contribution of the agentprivacy universe to KwaaiNet, and the addresses it lives at. |
| `ISSUE_DRAFT.md` | What would actually be posted upstream: three questions and one small fix. |
| `PATHWAY.md` | The design and the plan: the ladder, the gate, the receipt, gates G0-G6, where each piece routes, and the open questions. |
| `STAR-CHART.md` | How this binds to our existing constellation instruments without inventing new geometry. |
| `notes/` | **The findings as a note series, 01-06** -- house format, per-claim tiers, each standing alone and syncable into a research corpus. Start here if you want the research rather than the plan. |
| `OBSERVATION.md` | G0: the prompt, captured off the wire and detokenized. What it settles and what it does not. |
| `MEASUREMENTS.md` | Two real runs of the ladder on this lane's own pages (4b, then 27b + a second-model entailment audit). Three negative results and the guard they forced. |
| `CONVERGENCE.md` | Where the Privacy Is Value model and VPK meet: R(t) gives the tiers a shelf life; multiplicative gating says PHE is one factor of three. Ends with eight practices a node host can use. |
| `RUNTIME-AUDIT.md` | The runtime read end to end with the same scepticism this lane applies to KwaaiNet: what held, what was fixed, and the gap we share with upstream. |
| `CONNECTIONS.md` | Where our prior work already fits the VPK problem. Written in our own vocabulary. |
| `GLOSSARY.md` | Both vocabularies, side by side. |
| `evidence/VERIFY.md` | The commands behind every source claim. Re-runnable, and it ends by naming what is *not* verified. |
| `LOCAL-POINTERS.md` | Local only — deliberately not in this repository. |
| `chronicles/` | Working chronicles, verdict-first: the lane opening, the pathway-grants argument, the next-steps run, and run 2. |
| `LICENSE.md` | CC BY 4.0 for the documents, MIT for the code, and what neither covers. |

## How claims are labelled

The author is part of the Kwaai community — supporting the research, contributing on UX — and
this lane is that involvement converging with our own instruments. But familiarity is not
evidence, and a lot of this is still one participant telling maintainers things about code they
know better. So every claim carries its tier:

- **VERIFIED** -- read in the source or observed in a binary, with the command recorded.
- **REPORTED** -- stated by Kwaai's documents; taken at face value, not re-derived.
- **OPEN** -- needs a live two-node mesh, which has not been run.
- **THESIS** -- our construction, offered to be attacked. `STAR-CHART.md` section 3 is one.

Verified against KwaaiNet `main` at commit **`50558c6`** (2026-08-20, workspace version 0.5.5)
and the **v0.5.4** release binaries. Those are two different pins and the documents say which is
which. A vendored, never-edited clone sits alongside this lane so the pin cannot drift silently.

## What has not been done

Stated plainly, because the two load-bearing claims are both still open:

- **G0 is closed, on one transport.** The prompt was captured off a live wire and detokenized
  (`OBSERVATION.md`). It was the local bypass, not libp2p to a remote peer -- the payload claim
  is observed, the remote-transport claim is still inferred from shared code.
- **The integrity measurement exists; the usefulness measurement is partial.** Two runs marked
  whether a lower-tier reader reaches the source's conclusion (`MEASUREMENTS.md` section 7.3):
  two of three load-bearing pages now pass at every tier, and one — the confusable-pair page —
  still fails at D1/D2. Whether a *downstream answer* generated from a telling stays useful is
  still unmeasured.
- **The verifier is a single cheap judge.** Its recall is demonstrated, its precision is poor,
  and its rationales are sometimes wrong. Nothing here should gate a live grant path until the
  judging is adjudicated (majority vote or diverse lenses).
- **The Pi 4 SIGILL is predicted from the instruction set**, not from a crash anyone has seen.
- **Nothing is built against KwaaiNet.** The ladder runs on our own wiki corpus, not on an
  inference mesh, and the tailnet case is the easy case. The runtime that enforces the ladder
  (`~/vpk`, a sibling lane) is not yet published; the reproduce commands in `MEASUREMENTS.md`
  reference it for the record.

## Parallel work

A second thread runs the same argument one layer out, on ground we control: **pathway grants**
-- walks across the wiki federation compiled into scoped, network-private grants over a local
corpus. Its reasoning is in `chronicles/2026-08-20_pathway-grants-as-minimization.md`; the build
plan is not published.

It matters here for one reason: it is the **testbed**. The ladder and the receipt get built and
measured there -- where the counterparty is authenticated before the first byte, the corpus is
ours, and a fork already functions as a countersignature -- before either is proposed upstream.
It closes nothing about the KwaaiNet wire, and the easy case must be labelled as such wherever
it travels.

## Method

Claims here are meant to be attacked before they are shared. Prior lanes ran refuter fleets
against their own theses and folded the corrections back in rather than defending them; the same
discipline applies to `STAR-CHART.md` section 3 and to the disclosure ladder before either goes
upstream. `GLOSSARY.md` explains the vocabulary.

## Licence and provenance

Documents are **CC BY 4.0**; code is **MIT** — see `LICENSE.md`. Quoted material from the VPK
whitepaper and from KwaaiNet source belongs to their authors and is quoted here for review and
commentary; the whitepaper extract itself is deliberately not in this repository. The KwaaiNet
excerpts are from the public repository at the commit named above.

## Doors

Publishing this repository is the first outward act, taken deliberately. Issue, PR, contacting
Kwaai, and applying to the VPK working group remain manual acts, not automated ones, and none
of them have been taken yet. If you are from Kwaai or the working group and reading this before
we reach you: `ISSUE_DRAFT.md` is what we intend to post, and a fork or an issue here is a
welcome first reply.
