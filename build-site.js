// vpk_kwaai/build-site.js -- the research lane, as a federated wiki site.
//
// Builds ~/.wiki/kwaai.localhost: this lane's argument in the medium it governs.
// Every page is forkable, and in this federation a fork is the nearest thing we
// have to a countersignature -- which is exactly the primitive the lane proposes.
//
// Seated on the PROTECTION strand of the star chart (lattice vertex 32).
//
// Regenerate at any time -- this script is the source, the pages are the output:
//   node build-site.js
//
// The prose here is the SHAREABLE face of the lane. Nothing from LOCAL-POINTERS.md
// belongs in it, and no claim may appear here that FINDINGS.md does not carry with
// its command.

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const SITE = path.join(os.homedir(), '.wiki', 'kwaai.localhost');
const PAGES = path.join(SITE, 'pages');
const now = Date.parse('2026-08-20T19:00:00Z');
const id = () => crypto.randomBytes(8).toString('hex');
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function page(title, blocks) {
  const story = blocks.map(text => ({ type: 'paragraph', id: id(), text }));
  return {
    title,
    story,
    journal: [{ type: 'create', item: { title, story: [] }, date: now },
      ...story.map(s => ({ type: 'add', id: s.id, item: s, date: now }))],
  };
}

const P = {};

P['Welcome Visitors'] = page('Welcome Visitors', [
  '# The Kwaai Lane',
  'A contribution of the **agentprivacy universe** to [KwaaiNet](https://github.com/Kwaai-AI-Lab/KwaaiNet) and the Kwaai Foundation’s **Virtual Private Knowledge** protocol.',
  'VPK closes the *storage* side of retrieval: the host holds ciphertext, returns ranked indices, and never reads a document. The *inference* side of the same node is open — and that is what this lane is about.',
  '## Start here',
  '[[The Inference Seam]] — the finding the whole lane turns on.',
  '[[Semantic Minimization]] — what to do about it, and what it is not.',
  '[[The Address]] — who this is from, and what is being offered.',
  '[[What This Does Not Prove]] — read this before quoting any of it.',
  '## The findings',
  '[[Two Trust Ladders]] · [[What The Store Holds]] · [[The Pi Is Bob]] · [[How To Check This]]',
  '## The shape of the answer',
  '[[The Disclosure Ladder]] · [[The Receipt]] · [[Binding To The Star Chart]]',
  'Every page here is forkable. If you disagree, fork it — that fork is a record with provenance, and it is how this federation says "I have seen this and I say otherwise".',
]);

P['The Inference Seam'] = page('The Inference Seam', [
  '# The Inference Seam',
  'KwaaiNet’s distributed inference tokenizes a prompt locally and sends **raw token IDs** to the first peer in the chain. The wire type is named for it: `PayloadType::TokenIds`, documented in the source as *"first node only"*.',
  'It is structural rather than an oversight. The embedding table is downloaded by the first block server only, so the coordinator has no embedder and position 1 must receive tokens to do the lookup at all. Peers 2..N see hidden states, which are a far harder inversion target.',
  '**The privacy boundary of an inference chain is therefore one peer, and that peer sees the whole prompt.**',
  'This matters most in combination with retrieval. On a Linux ARM64 release build there is no local inference path compiled in, so a RAG chat retrieves private chunks locally and then sends them — in the prompt — to the mesh.',
  'The VPK whitepaper states the condition on its own guarantee honestly: sMCP holds *"for deployments where Alice’s AI model runs locally or in a trusted enclave."* On a heterogeneous mesh that condition does not hold. What is left over is the plaintext context window on a stranger’s machine.',
  'Verified by reading the source, not by watching a wire. See [[What This Does Not Prove]].',
]);

P['Two Trust Ladders'] = page('Two Trust Ladders', [
  '# Two Trust Ladders',
  'There are two trust scores in KwaaiNet, sharing one vocabulary of tiers.',
  'One is **credential-derived**: verifiable credentials, weighted and time-decayed. It is the ladder the whitepaper and the README are built on, the one that carries the fiduciary pledge and the verified-node credential.',
  'The other is **behaviour-derived**: availability, throughput and latency, combined into a single number, with a peer counted Unknown until it has been sampled enough times.',
  '**Chain selection uses the second one.** Peer entries are enriched from the reputation store. So the number that orders the peers who will serve your prompt is a performance metric wearing trust vocabulary, and the credential trust graph never touches peer selection at all.',
  'Even that is only a tie-break. Candidates are filtered on block coverage and on peers that already failed this session; trust enters as a secondary sort. There is no minimum-tier filter anywhere in the workspace.',
  'The consequence, taken with [[The Inference Seam]]: a peer that holds no credentials at all, but has good uptime, can sort first and receive your prompt.',
  'None of this is presented as a flaw. It reads like a phase. But it is worth knowing which ladder is load-bearing before building a gate on top of one.',
]);

P['What The Store Holds'] = page('What The Store Holds', [
  '# What The Store Holds',
  'The storage crate’s own documentation says a node "can act as an Eve (storage host), holding **encrypted** vectors". Searching that crate — and the RAG and CLI storage paths — for any encryption, cipher, or homomorphic primitive returns that comment and nothing else.',
  'Kwaai say so themselves. The whitepaper: PHE integration *"replacing the current transport-only encryption"* is the next engineering phase.',
  'So connecting a knowledge base to a remote storage peer today ships embeddings that are protected in transit and by nothing at rest. Embedding inversion is a live literature; those vectors are the corpus.',
  'This is the smallest and friendliest thing in the lane: a documentation comment that ran ahead of the roadmap. It is the first pull request worth offering.',
]);

P['The Pi Is Bob'] = page('The Pi Is Bob', [
  '# The Pi Is Bob',
  'The lane started as a hardware question — can a Raspberry Pi run a KwaaiNet node — and the answer turned into a role assignment.',
  '**Yes for the data owner.** Keys, the embedding model, the mapping table, the plaintext store, the ledger. All of it is I/O-bound and none of it needs a GPU. A small always-on machine is the right home for a trusted zone, which is the whole argument of this lane in physical form.',
  '**No for inference.** Every token streams the served block weights out of memory, and a Pi 4’s bandwidth makes that seconds per token. The project’s own deployment notes put a Pi 4 at one or two model blocks, CPU only.',
  '## The trap, if you try it anyway',
  'The published ARM64 **gnu** build is compiled with half-precision arithmetic enabled, and it emits ARMv8.2 instructions inside the f16 matrix kernels. A Pi 4 is a Cortex-A72, which is ARMv8.0 and does not implement them — expect an illegal instruction the moment an f16 matmul runs. A Pi 5 is a Cortex-A76 and is fine.',
  'The **musl** build carries none of those instructions. On a Pi 4, install that one — by hand, because the official installer picks gnu whenever glibc is present. The gnu build also needs a glibc no older than 2.34.',
  'Predicted from the instruction set, not yet observed as a crash. See [[What This Does Not Prove]].',
]);

P['Semantic Minimization'] = page('Semantic Minimization', [
  '# Semantic Minimization',
  'Close the seam by sending less, rather than by encrypting more.',
  'Homomorphic inference is not deployable and this lane does not pretend otherwise. But nothing forces a data owner to send the documents. They can send a **compressed re-expression** — a *telling* — whose invariant core is content-addressed, whose fidelity is chosen by the receiving peer’s standing in the trust graph, and whose release is signed by both parties.',
  'The document never leaves. A telling of it does, at a fidelity the counterparty earned.',
  '## Three layers, none of them load-bearing for the others',
  '**Mathematics** prevents harm by design — that is VPK’s substrate and it stays the substrate.',
  '**Minimization** bounds what harm is possible, and proves afterwards exactly what was released.',
  '**Contracts** reach intent, purpose limitation and downstream use, which neither of the others can.',
  'The whitepaper describes an unresolved argument between the contract camp and the mathematics camp. This is a third position that resolves nothing and helps anyway: **bound the disclosure, then prove the bound.** Weaker than a cryptographic guarantee, stronger than a promise, and it applies where cryptography cannot yet go.',
  'See [[The Disclosure Ladder]] for the mechanism and [[What This Does Not Prove]] for the limits.',
]);

P['The Disclosure Ladder'] = page('The Disclosure Ladder', [
  '# The Disclosure Ladder',
  'Five tiers. Which one a peer receives is set by its position in the trust graph, not by its request.',
  '**D0 RAW** — the chunk as written. Crosses to nobody.',
  '**D1 ACTIONS** — what to do, entities reduced to roles.',
  '**D2 PRINCIPLES** — the governing rule, without the procedural specifics.',
  '**D3 MATHS** — structure only: relations, types, quantities, no domain nouns.',
  '**D4 ADDRESS** — an address and a score. No content at all.',
  'D4 is the inference-side analogue of VPK’s SearchByIndex: nothing but an address crosses the wire. A peer holding D4 cannot generate an answer, which is the correct outcome — an unknown peer is not entitled to serve a private query, and the gate says so by having nothing to give it.',
  'The ladder degrades gracefully instead of failing binary. That is the whole product.',
  '## It is running',
  'Not on an inference mesh — on our own wiki corpus, over a private network, where tellings are precomputed and served in place of pages, and a request for a tier the ladder has not reached is **refused rather than filled with the page**. Falling back would misreport the tier, which is the exact failure the mechanism exists to prevent.',
  'The first measurement went against us: a D1 telling came out **1.44 times longer than its source**. A compression that grows is not a compression, and the ladder now carries a guard that discards them. That number is reported here because measuring before proposing was the point.',
]);

P['The Receipt'] = page('The Receipt', [
  '# The Receipt',
  'An audit log written by the party doing the disclosing is evidence of intent, not of event.',
  'The whitepaper leans on the audit trail for its oversight argument — that a reviewer could verify the whole history of who accessed what, under what credentials, without seeing the documents. That is the right ambition, and a self-authored log is a weak substrate for it.',
  'A **DisclosureReceipt** is the alternative: one record per release, carrying the address of what was released, the tier, the counterparty, the basis on which it was admitted, and a validity window — signed by **both** parties, or it does not exist.',
  '## Four rules, learned the hard way',
  'Both signatures **verified**, in the function that records them — not merely stored.',
  '**Reciprocity enforced**: a release without the receiver’s countersignature is not a release.',
  'One epoch advance, in **both** namespaces.',
  '**Delegation depth strictly decreasing** on re-disclosure — the onward-use limit that the whitepaper says mathematics cannot reach. It reaches part of it.',
  'These are not hypothetical corrections. An adjacent content-addressed registry has the bilateral *shape* — two assertions, one epoch — but verifies neither input signature, enforces no reciprocity, and has no callers. Bilateral minting is shipped on neither side. That makes it a shared surface rather than a borrow.',
  'In this federation there is already a working countersignature: **a fork**. Forking a page is an act with provenance, performed by the receiving side, that cannot be forged by the sender.',
]);

P['Binding To The Star Chart'] = page('Binding To The Star Chart', [
  '# Binding To The Star Chart',
  'The rendering question turned out to need no new geometry.',
  'Our lattice canon already fixes a cross-system seam: an integration may bind to a sealed object’s identity hash, its axis bitmask, and its proof root — and to nothing of its interior. That rule was written months earlier for a different reason, and it is the same discipline VPK applies to SearchByIndex.',
  'A disclosure receipt projects through exactly that seam. It exposes an address, a bitmask of which sovereignty axes the released telling engaged, and a proof root. The instrument that draws it is entitled to see no more than the untrusted peer is.',
  '## The corpus is already drawn',
  'The chart renders each wiki page as a star and each link as an edge. So the cores are already there; what is new is a second kind of edge — a **release**: this core went to that peer, at that tier, both signed.',
  'A receipt without its countersignature does not draw. Failing closed is the feature, and the picture should show it the same way the gate does.',
  '## One thesis, offered to be attacked',
  'Read a release as the set of axes its telling still engages, and descending the ladder clears bits. D0 lights all six; D4 lights only protection. The reflection operator on that lattice has exactly two fixed points — and they are precisely the two non-disclosing states: release nothing, or release only an address.',
  'The arithmetic holds. The per-rung axis assignment does not, yet: one step of the ladder clears two bits where every other clears one. It is a thesis, not a finding.',
]);

P['How To Check This'] = page('How To Check This', [
  '# How To Check This',
  'Everything asserted here about KwaaiNet is a command someone else can run. That is deliberate: this is a stranger making claims about someone else’s codebase.',
  'The claims were verified against `main` at commit `50558c6` (workspace version 0.5.5) and the v0.5.4 release binaries. **Those are two different pins**, and the lane says which is which wherever it matters.',
  '## How claims are labelled',
  '**Verified** — read in the source or observed in a binary, with the command recorded.',
  '**Reported** — stated by Kwaai’s own documents, taken at face value, not re-derived.',
  '**Open** — needs a live two-node mesh, which has not been run.',
  '**Thesis** — our construction, offered to be attacked.',
  'The full command list lives with the lane as `evidence/VERIFY.md`. Line numbers move; re-run it against whatever `main` is on the day rather than trusting the numbers written here.',
  'If any of it is wrong, the useful reply is the command that shows it.',
]);

P['What This Does Not Prove'] = page('What This Does Not Prove', [
  '# What This Does Not Prove',
  'The two load-bearing claims of this lane are both still open. Read this before quoting any of it.',
  '**The wire has not been watched.** The inference findings are read from source. Confirming them on two live nodes has not been done, and until it is, a maintainer is entitled to doubt them.',
  '**The quality question has no number.** Whether an answer generated from a telling two rungs down is still *useful* is what decides whether any of this has users. The first measurement we do have was unflattering, and it was about length, not usefulness.',
  '**The illegal-instruction prediction is from the instruction set**, not from a crash anyone has seen on a Raspberry Pi 4.',
  '**Minimization is not a guarantee.** A telling leaks whatever the telling says. The property being claimed is that the leak is bounded in advance and provable afterwards — which is strictly weaker than encryption, and is not a substitute for it.',
  '**The private-network case is the easy case.** Where the ladder does run, the counterparty is authenticated before the first byte, the corpus is ours, the volume is tiny, and no adversary is reconstructing anything. It is a testbed for the mechanism, not evidence about an inference mesh.',
  'Correlation is the unsolved one: a peer granted several tellings over time may reconstruct what no single telling gave it. The receipt makes that visible after the fact. It does not prevent it.',
]);

P['The Address'] = page('The Address', [
  '# The Address',
  'This lane is offered as a contribution of the agentprivacy universe to KwaaiNet and to the Virtual Private Knowledge protocol. It is not a fork, not a competing design, and not a request for anything.',
  'We arrived because a small machine could not run an inference node, stayed because the whitepaper asked its open questions more honestly than most, and found one seam that its own text names and its code leaves open.',
  '## Three things said plainly, because they cost nothing and buy trust',
  '**We may be wrong about your code.** Every claim is a command someone can re-run, and where we have not observed something we label it rather than dress it up.',
  '**We are not selling minimization as a guarantee.** VPK’s mathematics remains the substrate. This is a layer beside it, not above it.',
  '**We are eating our own cooking.** The ladder runs on our own knowledge base before it is proposed for anyone else’s, and the first corpus released through it is this research itself.',
  '## What a fork means here',
  'A wiki page is forkable, and in this federation a fork is not a copy — it is an act with provenance, performed by the receiver, which is the closest thing we have to a countersignature. If you fork a page of this research, that fork **is** the receipt. The mechanism this lane proposes, demonstrated on the artefact that proposes it.',
  'The Foundation is a nonprofit building public infrastructure. So is this. Take what is useful, refute what is not, and tell us which.',
]);

// ---- emit -------------------------------------------------------------------
fs.mkdirSync(PAGES, { recursive: true });
let n = 0;
for (const [title, doc] of Object.entries(P)) {
  fs.writeFileSync(path.join(PAGES, slug(title)), JSON.stringify(doc, null, 1));
  n++;
}
fs.mkdirSync(path.join(SITE, 'status'), { recursive: true });
const owner = path.join(SITE, 'status', 'owner.json');
if (!fs.existsSync(owner)) fs.writeFileSync(owner, JSON.stringify({ name: 'Mitch' }, null, 1));

console.log(`✓ kwaai.localhost — ${n} pages → ${PAGES}`);
console.log('  the research lane in the medium it governs; every page forkable');
console.log('  seated on the protection strand (lattice vertex 32)');
