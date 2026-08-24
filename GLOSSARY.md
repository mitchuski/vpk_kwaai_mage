# GLOSSARY

This lane sits between two vocabularies. If you arrived from Kwaai, the left column is what you
already know and the right column is ours. If you arrived from our side, it reads the other way.

Nothing here is required to evaluate the findings in `FINDINGS.md` -- those are plain claims
about KwaaiNet's source. It is required to read `CONNECTIONS.md`, which is deliberately written
in our own vocabulary.

## From the VPK whitepaper

| Term | Meaning |
|---|---|
| **Bob** | the data owner. Holds plaintext, keys, the embedding model, and the index mapping table. |
| **Alice** | the entitled querier. Presents credentials, sends a plaintext question, gets a plaintext answer. |
| **SaM** | "Service and Malice" -- the storage host. Stores ciphertext, searches it, never reads it. Called **Eve** in the KwaaiNet code; see F5. |
| **PHE** | partially homomorphic encryption. VPK's pluggable encryption layer, in three compliance tiers. |
| **SearchByIndex** | SaM returns only `(scrambled_index, score)` pairs. No content on the return wire. |
| **sMCP** | secure Model Context Protocol -- VPK's proposed extension of MCP, chartered under LF ToIP. |
| **VPKbench** | Kwaai's shared evaluation harness for candidate PHE constructions. |

## From this lane

| Term | Meaning |
|---|---|
| **the ladder / D0-D4** | five disclosure tiers. D0 is the raw chunk and never leaves; D4 is an address and a score with no content. Which tier a peer receives is set by its position in the trust graph. |
| **telling** | one re-expression of a document at a given tier. Many tellings, one invariant core. |
| **core** | the invariant meaning that every telling of a document compresses back to. |
| **fold** | the proof that a telling compresses back to its core. A *zero-knowledge* fold proves it without revealing the telling. |
| **DisclosureReceipt** | the record of one release. Signed by **both** parties or it does not exist. |
| **the Bob box** | the small always-on machine holding the trusted zone. In our case a Raspberry Pi. |

## From our own work (used in `CONNECTIONS.md` and the chronicles)

| Term | Meaning |
|---|---|
| **agentprivacy** | the umbrella for this body of work: a federation of wiki sites, a skill library, and a set of trust-graph specifications. |
| **the harness** | a dual-agent loop where one agent proposes a result and a second must validate it before it counts. |
| **fleet / refuter fleet** | many agents run in parallel against one claim, each trying to *refute* it. Verdicts: SURVIVES / NARROWED / COVERED. A claim that survives has been attacked, not merely asserted. |
| **VALIDATED / MIRAGE** | the harness verdicts for a proposed result: real, or plausible-looking and false. |
| **census fold** | compressing a specification while proving the compression preserves its meaning. Our prior runs: three specs compressed, 12 VALIDATED / 0 MIRAGE. |
| **VRC edge** | an edge in our trust graph. The rule that matters here: **only the counterparty's signature mints it.** |
| **kappa** | an identity hash: SHA-256 over a canonical form of an object. Content-addressing for meaning. From the UOR Foundation's kappa-registry, and locked in our own canon as `AXIOMS.md` A3. |
| **the star chart** | a constellation view of the wiki federation. Six strands (the six sovereignty axes), sites seated on strands, pages as stars, links as edges. |
| **the six strands** | protection, delegation, memory, connection, compute, value -- the six basis axes of a 64-vertex lattice used across our instruments. |
| **Gatehouse** | a two-token entry rite (a sigil plus a canon proverb) that decrypts documents client-side. Understanding as key rather than credential as key. |
| **KY-A** | our agent-admission specification: how an agent earns the right to act. |
| **embassy** | an always-on host that publishes but refuses direct writes; visitors socialise by forking. The pattern the Bob box follows. |
| **soulbae / soulbis** | the two agents of the dual-agent harness -- one proposes, one validates. Written `soulbae ⊥ soulbis`, the tack meaning they are deliberately independent. |
| **skye / city / star / lattice / sigil** | pages in our own instruments that render sealed objects. `/star` shows them as constellations; `/city` accounts for them. |
| **Promise Graph** | the star chart's edge layer: every page carries its outbound links, so the federation draws as a graph of promises between pages. |
| **City Key** | the small object a sealed result projects into so other instruments can read it: an identity hash, a bitmask of which axes it engaged, and a proof root. Nothing of the interior. |
| **spellbook** | one of the wiki sites in the federation. Appears here only as a corpus name. |
| **the Programme** | the research-writing path, kept separate from the federation, which carries work rather than research. |
| **fedwiki** | Smallest Federated Wiki. Every page is forkable; a fork carries provenance. Our corpus lives here. |

## Names

**Mitch** -- the author of this lane. Where the documents say "doors are Mitch's", they mean
those actions are deliberately not automated: forking, opening an issue, contacting a
maintainer, pushing anything.
