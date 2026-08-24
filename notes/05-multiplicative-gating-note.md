# PHE is one factor of three, and an inference chain is a multi-agent system

Status: draft v1, 2026-08-20. A convergence note between the Privacy Is Value
model and the Kwaai VPK protocol, and a companion to note 04. Claim tiers:
MODEL (a stated result of the value model, carrying its own confidence -
architectural rather than measured), VERIFIED (read in KwaaiNet source at
`50558c6`), REPORTED (from the VPK whitepaper or a cited paper), OPEN. This
note makes an argument about composition, and then raises a research question
that neither body of work can ask alone.

## 1. The observation

Two things, related by the same algebra:

1. The value model gates privacy as a **product** of three factors. VPK sets
   one of them well and leaves the other two unset. Under a product, that is
   not a partial win.
2. VPK's multi-shard argument assumes the shards do not combine. A KwaaiNet
   inference chain is a pipeline of peers, which is the case where that
   assumption is least safe - and the empirical literature says something
   counterintuitive about it.

## 2. Multiplicative gating

The model's canonical form [MODEL]:

> Phi = Phi_agent(Sigma) . Phi_data(Delta) . Phi_inference(Gamma)

Three factors, multiplied. The consequence is the point: **any one factor near
zero collapses the product**, whatever the other two are. Strengthening a
factor that is already strong buys little; setting an unset factor buys
everything.

Mapping the stacks onto the factors:

| Factor | What it gates | VPK today | This lane |
|---|---|---|---|
| `Phi_data` | what the data itself reveals to a holder | **PHE. This is VPK's contribution and it is strong** [REPORTED] | untouched; we defer |
| `Phi_inference` | what a decoder can do with what it received | nothing on the inference side - the prompt crosses as token IDs (note 01) [VERIFIED] | the disclosure ladder (note 03) |
| `Phi_agent` | who is permitted to act at all | credentials exist but do not gate peer selection (note 02) [VERIFIED] | the tier gate, the ceremony rung |

VPK is an excellent `Phi_data` term standing next to two unset factors.

Two things follow, and the second is more useful than the first.

**First**, it sharpens this lane's own thesis. We had been arguing that the
inference side is "also" a problem. The product says something stronger: an
architecture that sets `Phi_data` alone has not partially solved the problem,
because a product with an unset factor is not a partial product.

**Second, and this is the one to put in front of the working group**, it
settles the relationship between the two proposals. The disclosure ladder is
**not a competitor to PHE**. Different factor. The composition is
multiplication, not substitution, and a working group evaluating both does not
have to choose.

Stated honestly: the multiplicative form is **architectural, not measured**
[MODEL]. It is a good account of why a data-only gate is insufficient. It is
not evidence that the three factors literally multiply, and nobody has measured
a `Phi_inference` term. Do not present it as a law.

## 3. The collusion precondition, already formalised

The V6 draft states its Precondition 1 explicitly [MODEL]: channel capacities
may be summed only if the channels are conditionally independent given the
subject - `I(Y_S; Y_M | X) = 0` - and no third channel carries the inter-agent
residue.

It then names exactly where that fails: the colluding-wiretapper extensions in
the classical literature (Csiszar and Korner, 1978), and, empirically, the
multi-agent measurement in AgentLeak [REPORTED, arXiv:2602.11510]:

> multi-agent configurations reduce per-channel output leakage (27.2% versus
> 43.2% single-agent) while unmonitored inter-agent channels raise total system
> exposure to 68.9%.

Read that shape carefully, because it is counterintuitive and it is the whole
point of this section: **splitting a system across agents lowered what each
channel leaked and raised what the system leaked.** The residue moved into the
channels between the agents, where nobody was looking.

## 4. Why that lands on KwaaiNet specifically

VPK's multi-shard defence is stated in the whitepaper as structural resistance
to frequency analysis: each storage shard correlates only against its own slice
of the corpus, so no single host observes enough to reconstruct anything
[REPORTED]. That argument is sound **for storage**, where shards are passive
and do not talk to each other.

A KwaaiNet inference chain is not that. It is several peers in sequence, each
receiving the output of the last:

- position 1 receives token IDs and emits hidden states (note 01) [VERIFIED];
- positions 2..N receive hidden states and emit hidden states;
- the coordinator pins a stable path for the session [REPORTED].

The peers are **literally a pipeline**, and the session-pinned path means the
same set of peers sees the same session repeatedly. That is the configuration
AgentLeak measured, not the configuration the shard argument was written about.

So the question that neither body of work can ask alone:

> **Does sharding an inference chain lower per-peer exposure while raising
> total system exposure, as it does in the measured multi-agent case?**

If it does, then "distribute it across more peers" is not automatically a
privacy improvement, and the number of hops becomes a parameter with a cost as
well as a benefit. If it does not, the difference is worth understanding,
because the structural similarity is close.

This is a research question, jointly framed, and it should be taken to the VPK
working group as a question rather than a claim [OPEN].

## 5. What would answer it

Sketch, offered so the question is actionable rather than rhetorical:

- Instrument a chain so every hop's input and output are recoverable by the
  experimenter (not by the peers).
- Measure per-hop recoverable content and whole-chain recoverable content
  against a fixed prompt set, at chain lengths 1, 2, 4, 8.
- Report both curves. The AgentLeak shape predicts the per-hop curve falls
  while the whole-chain curve rises.

The instrumentation is the same stand-in-peer harness that closed gate G0 in
this lane, extended to more positions. That is a day of work, not a programme,
and it would produce a number where there is currently an analogy.

## 6. Open

- **`Phi_inference` has never been measured** [OPEN]. This lane's disclosure
  ladder is the first attempt at an instrument for it, and note 03 records that
  its first measurement produced a failure mode nobody had predicted.
- **Hidden-state recoverability is unquantified** [OPEN]. The chain argument
  above assumes positions 2..N leak *something*. How much is unknown and is
  the load-bearing empirical gap.
- **Session pinning may make it worse or better** [OPEN]. Repeatedly showing
  the same peers the same session is exactly the correlation surface the
  storage-side shard argument works to avoid.

## 7. Consequence for anyone building on top

Do not treat chain length as a privacy dial without measuring it. The intuition
that more hops means less exposure per hop is correct and may be beside the
point: the exposure that matters is the system's, and in the one comparable
measured case the two moved in opposite directions.
