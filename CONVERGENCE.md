# CONVERGENCE -- agentprivacy-docs and KwaaiNet

A study of where the **Privacy Is Value** model and the **VPK / KwaaiNet** stack are working on
the same problem from opposite ends, what each has that the other lacks, and what a person
hosting a node could actually use tomorrow.

Sources: `~/agentprivacy-docs/research/` (V6 draft, the limitative-theorems note, the moving
ceiling instrument note, the conjecture register) and `~/KwaaiNet-main` at `50558c6` plus the
VPK whitepaper. Read 2026-08-20.

---

## Verdict

They are the same argument at different layers, and each is weakest exactly where the other is
strong.

**VPK is an architecture without a clock.** It reasons carefully about what an adversary can do,
and not at all about that adversary getting better. Its compliance tiers are stated as
properties, not as shelf lives.

**Privacy Is Value is a clock without an architecture.** It has the time-dependent ceiling, the
preconditions, the external grounding in the wiretap literature -- and until this lane, nowhere
to enforce any of it.

The join is direct: **VPK gives the model a substrate; the model gives VPK a time axis.**

---

## 1. The strongest convergence: R(t) says VPK tiers have a shelf life

The V6 result restates the reconstruction ceiling as a function of time:

> R(t) = ( C_S(t) + C_M(t) ) / H(X), and the guarantee becomes t* = sup { t : R(t) < 1 }

with the mechanism named precisely: **the decoder improves, the archive does not.** Observations
already emitted do not change; what changes is what can be extracted from them. H(X) is fixed by
the person. So R(t) is non-decreasing under capability growth, and a separation architecture
adequate at t0 can be inadequate later with no new disclosure by the subject.

Now read VPK against it. A data owner encrypts a corpus and uploads it. The storage host keeps
ciphertext, indefinitely, by design. The whitepaper is candid that its **Tier 2 constructions
have strong empirical performance but informal security arguments** -- asserted rather than
reduced to established hardness assumptions -- and its own Aim 1 exists to fix that.

That is the moving-ceiling structure exactly: **a fixed archive sitting still while the decoder
improves.** Embedding inversion is an active literature; the vectors do not get harder.

**The contribution to Aim 1 is one parameter.** A VPK compliance tier should not be stated as
"secure" but as *secure against adversary class A for horizon t\**. The whitepaper already asks
"under what adversary model does it hold? what query volume and corpus size bounds apply?" --
the moving ceiling says the missing bound is **temporal**, and gives a defensible reason: the
drift is coupled to frontier capability, not to anything the data owner does.

The V6 draft has two 2026 instances where "findable" collapsed into "found" within days of a
model release. Either would make the point to a working group in one slide.

## 2. Multiplicative gating explains why VPK alone is not enough -- and why the ladder composes

The model's canonical form is a **product**:

> Phi = Phi_agent(Sigma) . Phi_data(Delta) . Phi_inference(Gamma)

Three factors, multiplied, so any one of them near zero collapses the whole thing regardless of
the other two.

Map the stacks onto the factors and the gap is visible:

| Factor | What it gates | VPK today | This lane |
|---|---|---|---|
| **Phi_data** | what the data itself reveals | **PHE. This is VPK's whole contribution, and it is strong.** | untouched -- we defer to it |
| **Phi_inference** | what a decoder can do with what it got | nothing on the inference side; the prompt goes out in clear (F1) | **the disclosure ladder** |
| **Phi_agent** | who is permitted to act at all | credentials exist but do not gate peer selection (F3) | the tier gate, the ceremony rung |

VPK is an excellent `Phi_data` term next to two unset factors. The product says that is not a
partial win, it is a collapse -- which is a sharper statement of this lane's thesis than the
lane made on its own, and it comes from the model rather than from us.

It also settles a question the lane kept dancing around: the ladder does not compete with PHE.
Different factor. **Multiplication, not substitution.**

## 3. The collusion precondition is already formalised -- and KwaaiNet is a multi-agent system

V6 states Precondition 1 explicitly: capacities may be summed only if channels are conditionally
independent, `I(Y_S; Y_M | X) = 0`, and it cites where that fails -- the colluding-wiretapper
extensions of Csiszar and Korner, and the empirical multi-agent measurement in AgentLeak:
multi-agent configurations **reduce per-channel leakage (27.2% vs 43.2%) while raising total
system exposure to 68.9%.**

VPK leans on the same independence assumption for its multi-shard frequency-analysis resistance
-- no single host sees enough of the corpus. But a KwaaiNet **inference chain is precisely a
multi-agent configuration**: several peers, each seeing a slice, with the residue living in the
channels between them.

So the AgentLeak shape is the one to look for: sharding an inference chain **lowers what each
peer sees and may raise total exposure**, and the whitepaper's shard argument does not cover the
inter-peer residue because it was written about storage, where the shards do not talk to each
other. In an inference chain they are literally a pipeline.

This is a research question the two bodies of work can only ask together, and it is the natural
second note to the VPK working group after the shelf-life one.

## 4. The existence-leak has a direct consequence for VPKbench

C81, the existence-leak conjecture: publishing that a result exists discounts the search space
for every reader; an attestation of feasibility leaks an upper bound on difficulty. The V6 draft
has a worked 2026 instance -- an independent rediscovery roughly two months after an attestation
that the result existed.

Kwaai is planning an **open competition with a public leaderboard** showing security score,
recall and latency for every candidate PHE construction. That is a deliberately-built existence
channel. When the board shows a Tier 2 candidate holding at some attack budget, it publishes an
upper bound on the difficulty of breaking it, to everyone, continuously.

Not an argument against the competition -- the AES process is the right model and openness is
the point. It is an argument for **stating the leak in the rules**, which costs nothing and is
the kind of thing a security advisory board appreciates being told before rather than after.

## 5. What "privacy is value" gives a node host that VPK does not

The model's distinctive move, in its own words: where the classical limitative results found *a
limit to mourn*, it **banks the same gap as the asset**. The residual that cannot be
reconstructed is not a loss; it is the thing of value.

For someone running a node, that inverts the accounting in a way that changes behaviour:

- A node that serves inference and holds nothing accrues value it can point at, rather than
  merely avoiding a liability.
- The `DisclosureReceipt` ledger of this lane becomes an **asset register**: a signed, auditable
  record of exactly how much was *not* disclosed. That is the gap, made countable.
- It gives the storage host a reason beyond altruism. The whitepaper already argues this in
  liability terms -- a host holding only ciphertext turns a honeypot into a salt mine -- and the
  value model says the same thing constructively rather than defensively.

This is the piece most likely to matter to Kwaai politically. Their hardest adoption problem is
persuading providers to hold less. "You reduce liability" is a defensive pitch. "The residual is
an asset you can account for" is an offensive one.

---

## What a node host can use tomorrow

Techniques from the harness that transfer directly, none requiring any of the theory:

**1. Honesty labels on every claim.** The docs corpus marks each statement Operational /
Architectural / Conjectural / Anticipated. This lane uses VERIFIED / REPORTED / OPEN / THESIS.
A node operator publishing anything about their setup should do the same -- it costs one word
and it is the difference between a report and a brochure.

**2. Say what an instrument is for.** From the moving-ceiling note: *"the instrument is a reading
surface, not evidence."* A node dashboard showing trust tiers and peers is a reading surface. It
does not establish that the peers are trustworthy. Label it.

**3. Register conjectures with a confidence and an estimator.** The register carries a number and
a name for who estimated it. "~65%, estimated by X on date Y" survives contact with disagreement;
an unattributed assertion does not.

**4. Attack your own claims before publishing.** The refuter-fleet discipline -- run adversaries
against your own findings, record SURVIVES / NARROWED / COVERED, fold the corrections in rather
than defending. A prior run took ten theses to zero survivors. Better to find that yourself.

**5. Measure before you pitch, and publish the bad number.** This lane's own first two
measurements were a compression that came out **1.44x longer than its source**, and a
principles-tier telling that **inverted a load-bearing finding** (`MEASUREMENTS.md`). Both are
reported. A proposal arriving with its own negative result is worth more than one arriving with
a design.

**6. Fail closed, and be able to show it.** When the ladder has no telling at the requested tier,
the answer is a refusal, never the underlying page. Observed working on a real page, not merely
designed. Any node policy should have the same property and an audit line proving it fired.

**7. Pin what you verify against.** Claims about a moving codebase need a commit, and the source
pin is not the release pin. This lane got that wrong once and now carries both.

**8. The receipt beats the log.** A record you wrote about yourself is evidence of intent. A
record your counterparty signed is evidence of event. If you host a node and ever need to show
what left it, build for the second.

---

## What does not transfer, and the risks

**The model is not a security proof and must not be sold as one.** R(t) is a conjecture with a
stated confidence and an unparameterised drift function. Taking it to a working group as
"privacy has a half-life, here is the number" would be a misrepresentation. The defensible claim
is the *mechanism* -- decoder improves, archive does not -- plus two public instances.

**The vocabulary does not travel.** The docs corpus is written in a register that will not
survive contact with a standards body. Anything routed upstream needs translating into the
whitepaper's own terms first; `GLOSSARY.md` is the start of that and is not sufficient.

**Multiplicative gating is architectural, not measured.** It is a good model of why a data-only
gate is insufficient. It is not evidence that the three factors actually multiply, and no one has
measured a `Phi_inference` term.

**We are one lane, not a peer institution.** Kwaai has published papers, a benchmark, an advisory
board, and a working-group charter. The right posture is to offer a note and a measurement, not a
framework.

## Where each piece routes

| Finding | Destination | Form |
|---|---|---|
| R(t) gives compliance tiers a shelf life | VPK WG, Aim 1 | a note: the missing parameter, with the two 2026 instances |
| Multiplicative gating: PHE is one factor of three | VPK WG | one figure; it argues for the ladder without asking for adoption |
| Inference chains are multi-agent; the AgentLeak shape | VPK WG / a paper | a research question, jointly framed, not a claim |
| Existence-leak in a public leaderboard | Kwaai, quietly | a sentence in the competition rules |
| Residual-as-asset | Kwaai's adoption argument | the constructive version of their own liability pitch |
| The eight practices | node operators | documentation, not specification |
