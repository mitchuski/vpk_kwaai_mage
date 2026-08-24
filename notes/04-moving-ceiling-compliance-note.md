# A VPK compliance tier is a claim with a shelf life, and the tier table has no time axis

Status: draft v1, 2026-08-20. A convergence note between the Privacy Is Value
model (agentprivacy research corpus, V6 draft, 2026-06-10) and the Kwaai VPK
protocol. Claim tiers: MODEL (a stated result of the V6 draft, carrying its own
confidence figure - not a theorem this note proves), REPORTED (from the VPK
whitepaper), OPEN. This note argues for adding one parameter to an existing
programme, not for changing its design.

## 1. The observation

VPK reasons carefully about what an adversary can do, and not at all about that
adversary getting better. Its compliance tiers are stated as properties -
Tier 1, Tier 2, Tier 3 - and a property has no expiry.

The Privacy Is Value model has spent two years on exactly the missing axis. Its
V6 result restates a static bound as a function of time and gives the mechanism
by which the bound moves.

The two fit together with one parameter. **VPK is an architecture without a
clock; the value model is a clock without an architecture.**

## 2. The result being imported

V6 restates the reconstruction ceiling [MODEL]:

> R(t) = ( C_S(t) + C_M(t) ) / H(X),  with  t* = sup { t : R(t) < 1 }

where `C_S` and `C_M` are the effective capacities of two observation channels
*evaluated against the strongest adversary class available at time t*, and
`H(X)` is the source entropy of the private state.

The mechanism is stated precisely, and it is the part that matters here:

> **The mechanism is the decoder, not the data.** Observations already emitted
> do not change after emission. What changes is what can be extracted from
> them.

`H(X)` is fixed by the subject. Effective channel capacity is not. So `R(t)` is
non-decreasing under capability growth, and a separation architecture adequate
at `t0` can be inadequate later **with no new disclosure by the subject**. The
guarantee becomes a shelf life `t*`.

The draft registers this as a conjecture with an explicit confidence (~65%) and
a named estimator, and is candid that the *functional form* of the drift is
unparameterised [MODEL]. It grounds the static case externally rather than
internally - Wyner's wire-tap channel, the Fano converse, Leung-Yan-Cheong and
Hellman, the Bayes-capacity bound of quantitative information flow - so the
claim is "an instance of a family the field accepts, under named preconditions"
rather than an internal invention.

That posture is why this is worth bringing to a working group: the conjectural
part is labelled, and the classical part is cited.

## 3. Why it applies to VPK directly

Read the VPK deployment shape against the mechanism.

A data owner embeds a corpus inside their trusted zone, encrypts the vectors,
and uploads them to a storage host, which keeps them - by design, indefinitely,
because that is what a storage host is for [REPORTED].

That is the moving-ceiling structure exactly: **a fixed archive sitting still
while the decoder improves.** The ciphertexts do not get harder. Embedding
inversion is an active research area. Whatever the effective attack cost is
today, the archive will still be there when it is lower.

The whitepaper is itself candid that this is the soft spot. Its Tier 2
reference implementations "have strong empirical performance but informal
security arguments - their security properties are asserted rather than
formally reduced to established hardness assumptions" [REPORTED]. Aim 1 of the
research programme exists to fix that, and asks in its own words: what is the
minimum attack complexity for Tier 2? Under what adversary model? What corpus
and query-volume bounds apply?

**The missing bound is temporal**, and the value model supplies a defensible
reason why: the drift is coupled to frontier capability growth, not to anything
the data owner does or fails to do.

## 4. The contribution: one parameter

A VPK compliance tier should not be stated as *secure*. It should be stated as

> secure against adversary class A, for horizon t*

with both named. The tier table gains a column; the protocol changes not at
all; and the `EncryptionLayer` trait that already makes the encryption layer
pluggable is unaffected.

Three things follow immediately and cheaply:

- A corpus uploaded under Tier 2 has a **re-encryption obligation**, not merely
  a storage cost. Someone has to own it.
- The compliance criteria list gains a natural entry: a candidate construction
  should state the adversary class its claim is evaluated against, so that the
  claim can later be re-evaluated rather than silently expiring.
- The distinction between "we have not broken it" and "it is secure for a
  stated horizon" becomes expressible, which is precisely the distinction Aim 1
  is trying to draw.

## 5. Evidence that the mechanism is not hypothetical

The V6 draft records two instances from 2026, both within days of a frontier
model release [MODEL, both externally documented]:

- A soundness flaw in a widely deployed zero-knowledge circuit, present and
  findable for roughly four years, found the day after a capable model shipped
  - with the model's help - and exploited to completeness in a test
  environment. The circuit's entropy never changed; the decoder improved
  overnight.
- A withheld optimisation whose *existence* was published as an attestation,
  independently rediscovered roughly two months later. The attestation itself
  discounted the search.

Both read the same way in `R(t)` terms: the interval between *findable* and
*found* collapsed, with no change to the artefact.

Either instance would make the point to a working group in one slide, and
neither requires accepting the model's formal apparatus.

## 6. A second consequence: public leaderboards are existence channels

The same corpus carries a conjecture that an attestation of feasibility leaks
an upper bound on difficulty to every reader [MODEL], with the rediscovery
above as its worked instance.

Kwaai plans an open competition on the AES model, with a public leaderboard
showing security score, recall and latency for every candidate [REPORTED]. That
is the right way to run it, and it is also, structurally, a continuously
updated existence channel: a board showing a candidate holding at some attack
budget publishes an upper bound on the difficulty of breaking it.

This is not an argument against the competition. It is an argument for saying
so in the rules, which costs a sentence and is the kind of thing an advisory
board would rather be told in advance.

## 7. Open

- **The drift is unparameterised.** [OPEN] The model gives a mechanism and two
  instances, not a rate. Nobody can currently compute `t*` for a given tier.
  Presenting this as "privacy has a half-life, here is the number" would
  misrepresent it; the defensible claim is the mechanism plus the instances.
- **Does the ceiling formalism transfer to vector stores?** [OPEN] `R(t)` is
  posed over behavioural observation channels. An encrypted vector index is a
  different object, and the mapping is an argument by analogy until someone
  does the work.
- **Who owns the re-encryption obligation?** [OPEN] In a decentralised network
  with no central operator, an expiring guarantee has no natural owner. This is
  a governance question, and it is the one a data owner will actually ask.

## 8. Consequence for anyone building on top

If you are hosting a knowledge base under a VPK-style guarantee, the guarantee
is dated even though nothing in the interface says so. Record the adversary
class you accepted, the date, and who is responsible for revisiting it. That
record costs nothing today and is the only thing that will make the question
answerable later.
