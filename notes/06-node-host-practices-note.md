# Eight practices for running a node, taken from a harness rather than a standard

Status: draft v1, 2026-08-20. Written for someone hosting a KwaaiNet node or
any similar local knowledge node. Nothing here requires the model in notes 04
and 05 or the mechanism in note 03. Claim tiers: PRACTICE (a working habit from
the agentprivacy harness, offered because it transferred), MEASURED (produced
by a run in this lane), VERIFIED (read in cited source). This is documentation,
not specification, and it should never be presented as the latter.

## 1. Why a note like this exists

Everything else in this series is about mechanism. This one is about the habits
that produced the mechanism, because in practice they are the more portable
half, and because a node operator can adopt any of them tomorrow at no cost.

Each is stated with the failure it prevents. Several prevented a failure in
this lane, and those are named.

## 2. Label every claim with how you know it

[PRACTICE] Four labels, one word each, applied per claim rather than per
document. This series uses VERIFIED (read in the cited source at the cited
commit), REPORTED (from someone's documentation, not independently executed),
OPEN (a question this does not settle), and MEASURED. The research corpus this
came from uses Operational / Architectural / Conjectural / Anticipated.

**What it prevents:** the slow conversion of a reading into a fact. If you
publish anything about your node - uptime claims, trust configuration, what you
do and do not retain - the difference between a report and a brochure is one
word per sentence.

## 3. Say what an instrument is for

[PRACTICE] From the moving-ceiling work: *"the instrument is a reading surface,
not evidence."*

A node dashboard showing peer trust tiers is a reading surface. It renders the
shape of a claim so you can feel it. It does not establish that those peers are
trustworthy, and the tier label may not mean what the vocabulary suggests -
note 02 documents two ladders in one codebase using the same four words for
different quantities.

**What it prevents:** a visualisation being cited as a measurement.

## 4. Register conjectures with a confidence and an estimator

[PRACTICE] Not "we think the drift is significant" but "~65%, estimated by X on
date Y, mechanism evidenced at n=2, functional form unparameterised."

**What it prevents:** unattributed assertions, which cannot be updated because
nobody knows whose they were or what they were based on. A number and a name
survive disagreement.

## 5. Attack your own claims before publishing

[PRACTICE] Run adversaries against your own findings and record the verdicts -
SURVIVES / NARROWED / COVERED. Fold the corrections in at the prominence of the
original claim rather than in a footnote. A prior run in this body of work took
ten theses to zero survivors, and publishing after that was a very different
act from publishing before it.

**What it prevented here:** nothing, and that is the point - note 03's failure
was found by *measurement* instead, one step later than it should have been.

## 6. Publish the number that went against you

[MEASURED] Two of this lane's first three results were negative:

- a compression that came out **1.44x longer than its source**;
- a principles-tier telling that **inverted a load-bearing finding**, fluently
  and with no signal (note 03).

Both are in the series. A proposal arriving with its own counter-example is
worth more than one arriving with a design, and the second result identified a
failure mode - a generated stand-in can assert the negation of its source,
which a ciphertext cannot - that would otherwise have been discovered by
someone else, in production.

**What it prevents:** discovering your failure mode on a corpus that matters.

## 7. Fail closed, and keep the line that proves it fired

[MEASURED, VERIFIED] When the disclosure ladder has no telling at the requested
tier, the serving path returns a **refusal**, never the underlying page -
because falling back would misreport the tier and serve D0 under a D2 grant.
Observed on a real page whose D3 the guard rejected entirely.

For a node operator the general form: when a policy cannot be evaluated,
**refuse**, and write an audit line saying the refusal happened. A policy that
silently degrades to permissive is worse than no policy, because it reports
success.

## 8. Pin what you verify against - and know that source and release are two pins

[VERIFIED] This lane's first draft said "verified against v0.5.4". The source
read was `main` at `50558c6`, workspace version **0.5.5**; only the *binaries*
were v0.5.4. Two different pins stated as one.

**What it prevents:** claims that cannot be re-checked, and line numbers that
silently stop meaning anything. If you report an issue upstream, name the
commit, and re-run before you post - line numbers move.

## 9. The receipt beats the log

[PRACTICE] A record you wrote about your own behaviour is evidence of intent. A
record your counterparty signed is evidence of event.

This matters more than it sounds for a node operator, because the question you
will eventually be asked is not "what do you log" but "what left your machine,
and can you show it". Those are different artefacts. If you build for the
second, build it bilateral from the start - retrofitting a countersignature
onto a self-authored log is not possible after the fact.

**What it prevents:** an audit trail that satisfies you and nobody else.

## 10. Keep the state that must not travel in a different directory from the
code that should

[PRACTICE] Keys, live grants, audit logs, and indexes live outside the tree
that becomes a repository - with a single module owning the knowledge of where
anything lives, so the split cannot drift.

**What it prevents:** the ordinary accident. Not an attack; a `git add -A` on a
tired evening.

## 11. What does not transfer

Stated so this note is not read as a standard:

- **These are habits, not controls.** None is auditable, none is testable, and
  a node that follows all eight can still be misconfigured.
- **The vocabulary does not travel.** The corpus these came from is written in
  a register that will not survive contact with a standards body. Translate
  before routing anything upstream.
- **We are one operator with one lane**, not a peer institution. The right
  posture for any of this is an offer, not a specification.

## 12. The one to adopt first

If only one: **section 7**. Fail closed and keep the line that proves it fired.
It is the only practice here that changes what your node actually does, it is
usually a few lines, and it converts a policy you believe in into a policy you
can demonstrate.
