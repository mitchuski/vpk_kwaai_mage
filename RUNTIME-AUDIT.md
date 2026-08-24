# RUNTIME-AUDIT

2026-08-24. The runtime that exercises this lane's design (`~/vpk`, a sibling
lane, not yet published) was read end to end with the question: *is the gap
between what the documents claim and what the code does small enough to build
on?* This document records the answer, because a lane that audits KwaaiNet's
code and not its own is doing advocacy, not research.

Reviewed: the tailnet proxy (the enforcement point — every grant request passes
through it), the grant compiler (request / review / approve / revoke), the
ladder (generation + the entailment guard), and the trust-task and compression
layers' contracts.

## What held up

- **Fail-closed is real, not aspirational.** Path handling is default-deny — a
  URL is served only if the classifier names it, so anything the farm grows
  later arrives as a 404, not an accidental door. Whole-site endpoints are
  refused outright rather than filtered. A tier grant whose telling does not
  exist refuses rather than serving the page, because serving D0 under a D2
  label is the exact failure the design exists to prevent.
- **The check order is right**: grant exists → unexpired → tailnet source →
  named peer's address → site granted → read-only → scope → tier. The grant
  lane is matched before the namespace passthrough, closing the
  host-shadowing hole. Revocation reaches the peer's next request.
- **The trust boundary is drawn where the documents say it is.** Requests may
  arrive from anyone, including an agent; a grant exists only after a keeper
  act at the CLI. Approval resolves the peer against the live tailnet and
  fails closed on a name nobody answers to. Read-only is hardcoded at request
  time. Existence metadata respects the tier: sitemap titles and synopses are
  re-derived from tellings, and a page with no telling drops out of the map.

## What the audit found, and what was done

**1. The serving path did not consume entailment verdicts.** (Fixed.) The
2026-08-24 guard writes `entailment: {ok: false}` onto tellings a second model
judged to contradict their source — and the serving path ignored it, so a
known-false telling would still be served under the source's address. Now a
CONTRADICTS-marked telling is refused like a missing one, with one narrow
override: a human can write an `adjudication: {serve: true, why, by}` onto the
record after checking the flag by hand, because the verifier's precision is
known to be poor. The verdict (and any adjudication) is surfaced in the served
JSON, so the peer can see what stands behind the telling.

The availability cost of failing closed with a low-precision judge, measured
on this corpus at the time of writing: **16 of 36 tellings served, 20
refused** (2 real inversions, 2 hand-overruled false positives, 16 flags not
yet adjudicated). That number is the argument for adjudicated multi-judge
verification, stated as a number.

**2. The audit log is self-authored — our own F7, pointed at ourselves.**
(Open, by design, and now said out loud.) This lane criticizes KwaaiNet's
audit log for lacking a counterparty signature; the runtime's `.grants/`
audit log has the same shape. The trust-task seal is keeper-side ed25519;
fork-as-countersign is the working mitigation. The bilateral
`DisclosureReceipt` — both signatures verified in-function, reciprocity
enforced — remains designed, not built. Until it is built, the receipt claims
in `PATHWAY.md` are design, and `ADDRESS.md`'s provenance section says so.

**3. Grant tokens were 32 bits.** (Fixed.) Fine as defense-in-depth behind
tailnet membership and peer-address binding; thin as the only secret on a
`peer=any` grant. Tokens are now 64-bit (16 hex characters); the proxy
accepts both widths so standing grants survive.

## What this says about the direction

The runtime is the inference-side analogue of commitments VPK has already
made on the storage side — serve an address and an earned fidelity, never the
corpus — and its one structural absence is shared with KwaaiNet itself: tiers
are keeper-assigned, not derived from a credential trust graph, which is
finding F3 from the other side of the table. The
credential-ladder-to-tier binding is a shared frontier: whoever builds it
builds it for both.
