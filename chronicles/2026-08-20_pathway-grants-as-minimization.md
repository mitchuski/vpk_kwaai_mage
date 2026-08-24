# 2026-08-20 -- pathway grants: the minimization argument, one layer out

**Verdict first.** The disclosure ladder this lane proposes to KwaaiNet already has a working
substrate on our own machines, and we did not notice because it was drawn as a picture. A
**constellation** in the star chart -- an ordered walk across page-stars in the local fedwiki
farm -- is a bounded-disclosure primitive: it names exactly which pages cross a wire, in what
order, to whom. Wire it to the tailnet bridge and D0-D4 stops being a proposal and becomes
something we run against a real corpus, on a network where we own both ends. That is the
missing testbed for OQ-3, and it is also the first place `DisclosureReceipt` can actually be
built -- because reciprocity, which is shipped on neither side over at Kwaai, is already the
federation's working primitive: **a fork is a countersignature.**

## What happened

Mitch asked for something that sounded like a UI feature: let people import constellation
pathways into the star chart as primitives for asking an agent to serve a slice of the local
wiki farm over tailscale. A virtual private knowledge base, composed visually, delegated to an
agent, served tailnet-only.

Reading it against `PATHWAY.md` the same afternoon, it is not a UI feature. It is the same
argument as this lane, moved up one layer:

| KwaaiNet inference seam | Tailnet knowledge seam |
|---|---|
| retrieved chunks -> peer 1 as raw token IDs (F1) | whole farm -> peer as an open port |
| trust score is a sort key, not a gate (F3) | `ALIASES` allowlist, hardcoded, all-or-nothing per site |
| fix: substitute a telling before tokenize | fix: serve only the pathway's pages, filter the sitemap |
| receipt: `kappa(telling)`, both signatures | receipt: audit log + seal, countersigned by fork |
| tier chosen by weakest peer in the chain | tier chosen by the peer's position in the grant |

The shape is identical. What differs is that on the tailnet the counterparty is authenticated by
WireGuard before a byte moves, the corpus is ours, and the disclosure decision is **made in
advance and drawn**, not made at inference time by a sort key.

## What was decided

- **The ladder is the grant's scope, not a separate mechanism.** A pathway grant carries a tier.
  D0 = the pathway's pages as written. D1-D3 = the `understanding-compression` tellings of the
  same walk. **D4 = the constellation with no page bodies at all** -- the shape of the walk, the
  digest, the strand seating, and nothing else. The star chart has been rendering D4 since it was
  built; nobody called it that. A peer at Unknown gets the shape and cannot generate from it,
  which is the correct outcome and the same reasoning as `SearchByIndex`.

- **Scope enforcement, not scope suggestion.** Ruling taken: pathway pages only. The proxy filters
  `system/sitemap.json` to the pathway, 404s any slug outside it, and refuses `site-index.json`
  and `export.json` outright rather than filtering them -- both are whole-site leaks wearing a
  search hat. Failing closed is the feature, same as the chain-selection patch.

- **Bilateral receipting gets built here first.** Run 02's refuters found `assert_double_entry`
  verifies nothing and has zero callers; Kwaai's audit log is self-authored. Neither of us built
  it. But the embassy already refuses direct writes at 403 *by design*, and socialises by fork --
  meaning the receiving side has a working, non-repudiable act of acknowledgement that is not a
  fetch. Grant -> walk -> the peer forks the runtime page -> that fork is the countersignature the
  receipt requires. Reciprocity enforced, on a substrate we control, before proposing it upstream.

- **The ceremony rung is already running.** The Gatehouse two-token rite (sigil + canon proverb)
  admits a peer to D0 within a known set. `PATHWAY.md` section 3 lists it as an optional top rung;
  here it is a deployed door. Understanding as key, not credential as key.

- **The floor ships before the model.** Suggested pathways come from semantic search over the
  local farm -- David's `wiki-plugin-similarity` format (BGE-small, 384-d, `semantic-vectors.json`)
  is the interop target, but it is not installed on the box and no embedding model is pulled. So
  the first build is lexical + link-graph, deterministic and offline, writing David's file shape.
  Embeddings are an upgrade, not a dependency. Same discipline as not pitching this as homomorphic.

- **Compression is the point, not the finish.** A walked, sealed pathway is the unit the harness
  compresses: propose a telling, have a second agent show it expands back to the same invariant
  core over the pathway's own pages, record the ratio = words(telling)/words(corpus). The next
  transfer to the next private knowledge network ships the telling with the pathway held in
  reserve. **That is OQ-3 with a corpus attached** -- does a two-rung-down answer stay useful --
  asked where we can measure it instead of speculating.

## What this does not prove

The tailnet case is the easy case and must be labelled as such when any of it travels upstream.
The peer is cryptographically identified before the first byte, the corpus is ours, the volume is
tiny, and there is no adversarial inference node reconstructing anything. Nothing here closes F1.
It is a **testbed for the ladder and the receipt**, not evidence about KwaaiNet's wire.

OQ-4 gets worse here, not better: a peer granted several pathways over time accumulates tellings
that may reconstruct D0, and unlike VPK we have no mathematical layer underneath to fall back on.
The audit log makes the correlation *visible* after the fact; it does not prevent it.

OQ-5 lands squarely: a pathway request can be composed and submitted by an agent. The grant is
deliberately a keeper act at a CLI, never a web button. Who signs for an agent stays unanswered;
we have only pushed the signature to a human on our side of it.

## What is not done

Plan written (unpublished), P0 closed, build authorised as a full
vertical slice: schema, semantic index, grant compiler, proxy enforcement, chart UI, runtime and
compression. None of it built at the time of writing. No pathway has been granted, no runtime
sealed, no kappa measured. G0 over in the Kwaai lane remains unrun and is not helped by this.

Nothing pushed. Nothing posted. Doors are Mitch's.
