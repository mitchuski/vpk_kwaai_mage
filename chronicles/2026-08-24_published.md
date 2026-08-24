# Published

2026-08-24, later the same day as run 2. The lane became a public repository:
**github.com/mitchuski/vpk_kwaai_mage**, initial commit `4b8abca`.

This supersedes the 2026-08-20 ruling that the lane would carry no git. The
ruling was about premature version control on unfinished research; what changed
is that the research reached a state worth pointing other people at — findings
observed rather than argued, a mechanism measured twice, and its failure modes
documented with the guard they forced. Publishing *is* the first outward act,
taken so that anything later said to Kwaai's maintainers or the VPK working
group can cite checkable documents instead of claims in a message.

Decisions taken at publish time, both the operator's:

- **Licence:** CC BY 4.0 for the documents, MIT for the code (`LICENSE.md`).
  Chosen so the working group can quote and reuse with attribution and nothing
  more.
- **Visibility:** public from the first commit.

What the repository deliberately does not contain: the VPK whitepaper extract
(Kwaai's copyright — quoted, not redistributed), `LOCAL-POINTERS.md` (names
private paths), and the `~/vpk` runtime (a sibling lane with its own
publication bar, still unpublished and labelled as such in the README).

Pre-publish pass: the 2026-08-20 share scans were re-run over everything added
since; one leak found and scrubbed (an absolute local path in a run-2 evidence
log).

Doors that remain, all manual: posting `ISSUE_DRAFT.md` upstream, contacting
Kwaai, applying to the working group, the two-node mesh test.
