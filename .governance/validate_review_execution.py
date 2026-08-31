#!/usr/bin/env python3
import json
import os
import re
import subprocess
import sys
from pathlib import Path

POLICY_ID = "ESA-REVIEW-EXECUTION-PROVENANCE-001"
AUTHORITY_REF = "governance-cleared"
EVIDENCE_DIR = Path(".governance/review-execution-evidence")
IMPLEMENTATION_EXEMPT_PATHS = {
    Path(".governance/validate_review_execution.py"),
    Path(".github/workflows/review-execution-provenance-gate.yml"),
}

CONTROLLED_PATTERNS = [
    re.compile(r"\bINDEPENDENT\s+QA\s*=\s*PASS\b", re.I),
    re.compile(r"\bANNA\s+FINAL\s+RULING\b", re.I),
    re.compile(r"\bANNA\b.{0,80}\b(ACCEPTED|APPROVED|PASS|CLEARED|FINAL)\b", re.I),
    re.compile(r"\bDOWNSTREAM\s+ACTIVATION\s*=\s*AUTHORIZED\b", re.I),
    re.compile(r"\b(CERTIFIED|SIGNED\s+OFF)\b", re.I),
    re.compile(r"(?<![-_])\b(REVIEWED|APPROVED|ACCEPTED|CLEARED)\b(?![-_])", re.I),
    re.compile(r"\bSTATUS\s*:\s*[^\n]*(PASS|APPROVED|ACCEPTED|CLEARED|CERTIFIED|FINAL)\b", re.I),
]

INTERNAL_LABELS = (
    "INTERNAL_ANALYSIS_ONLY",
    "INTERNAL QA ANALYSIS",
    "INTERNAL RED-TEAM ANALYSIS",
)

FORENSIC_REQUIRED_MARKERS = (
    "**Status:** INTERNAL FORENSIC AUDIT / NOT AN INDEPENDENT REVIEW",
    "**Authoring class:** `SAME_ORIGIN_INTERNAL_ANALYSIS`",
    "`FORENSIC AUDIT ≠ INDEPENDENT QA`",
    "`FORENSIC AUDIT ≠ ANNA REVIEW`",
    "`FORENSIC AUDIT DOES NOT CLOSE ANY REOPENED GATE`",
)

BANNED_MECHANISM_TERMS = (
    "assistant-authored",
    "assistant authored",
    "simulation",
    "simulated",
    "role-play",
    "roleplay",
    "synthetic persona",
    "inferred review",
    "same originating assistant",
)

REQUIRED = [
    "evidence_id",
    "canonical_policy_id",
    "reviewer_role_id",
    "reviewer_identity_class",
    "execution_mechanism",
    "execution_run_id",
    "return_id",
    "review_object_id",
    "review_object_version",
    "review_object_hash",
    "independence_class",
    "started_at",
    "returned_at",
    "disposition",
    "return_artifact_path",
    "return_artifact_hash",
    "source_control_commit",
]

ALLOWED_INDEPENDENCE = {
    "DISTINCT_INTERNAL_REVIEWER_EXECUTION",
    "MATERIALLY_INDEPENDENT_EXTERNAL_REVIEW",
    "INDEPENDENT_HUMAN_REVIEW",
}

GOVERNED_HINTS = (
    "review",
    "assurance",
    "qa",
    "redteam",
    "red-team",
    "governance",
    "certif",
    "panel",
    "anna",
    "specialist",
)

TEXT_SUFFIXES = {".md", ".txt", ".json", ".yaml", ".yml"}


def _git_output(args):
    return subprocess.check_output(["git", *args], text=True, stderr=subprocess.STDOUT)


def changed_files():
    supplied = [Path(x) for x in sys.argv[1:] if x.strip()]
    if supplied:
        return supplied

    event = os.environ.get("GITHUB_EVENT_NAME", "")
    base = os.environ.get("GITHUB_BASE_REF", "")

    if event == "pull_request" and base:
        subprocess.run(["git", "fetch", "origin", base, "--depth=1"], check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        out = _git_output(["diff", "--name-only", f"origin/{base}...HEAD"])
        return [Path(x) for x in out.splitlines() if x.strip()]

    if event == "push":
        subprocess.run(["git", "fetch", "origin", AUTHORITY_REF], check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        verify = subprocess.run(["git", "rev-parse", "--verify", f"refs/remotes/origin/{AUTHORITY_REF}"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if verify.returncode != 0:
            raise RuntimeError(f"required authority ref origin/{AUTHORITY_REF} is unavailable; refusing fail-open validation")
        out = _git_output(["diff", "--name-only", f"origin/{AUTHORITY_REF}...HEAD"])
        return [Path(x) for x in out.splitlines() if x.strip()]

    out = _git_output(["diff", "--name-only", "HEAD^", "HEAD"])
    return [Path(x) for x in out.splitlines() if x.strip()]


def is_governed(path: Path, text: str):
    p = str(path).lower()
    if any(h in p for h in GOVERNED_HINTS):
        return True
    return any(rx.search(text) for rx in CONTROLLED_PATTERNS)


def is_reopen_only_forensic_record(path: Path, text: str):
    name = path.name.upper()
    if "FORENSIC-AUDIT" not in name:
        return False
    return all(marker in text for marker in FORENSIC_REQUIRED_MARKERS)


def find_evidence_ids(text: str):
    ids = []
    for m in re.finditer(r"REVIEW_EXECUTION_EVIDENCE_ID\s*[:=]\s*`?([A-Za-z0-9._:-]+)`?", text):
        ids.append(m.group(1))
    return list(dict.fromkeys(ids))


def load_evidence(eid: str):
    path = EVIDENCE_DIR / f"{eid}.json"
    if not path.exists():
        raise ValueError(f"missing evidence record {path}")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        raise ValueError(f"invalid JSON in {path}: {e}")
    return path, data


def validate_evidence(path: Path, data: dict, claim_text: str):
    errors = []
    missing = [k for k in REQUIRED if not data.get(k)]
    if missing:
        errors.append(f"{path}: missing required fields: {', '.join(missing)}")
    if data.get("canonical_policy_id") != POLICY_ID:
        errors.append(f"{path}: canonical_policy_id must be {POLICY_ID}")
    if data.get("independence_class") not in ALLOWED_INDEPENDENCE:
        errors.append(f"{path}: invalid/non-independent independence_class")
    mechanism = str(data.get("execution_mechanism", "")).lower()
    if any(term in mechanism for term in BANNED_MECHANISM_TERMS):
        errors.append(f"{path}: execution_mechanism describes non-execution/simulation")
    if re.search(r"\bANNA\b", claim_text, re.I):
        if data.get("reviewer_role_id") != "ANNA_EDITOR_IN_CHIEF_EDITORIAL_DIRECTOR":
            errors.append(f"{path}: Anna claim requires reviewer_role_id ANNA_EDITOR_IN_CHIEF_EDITORIAL_DIRECTOR")
        if data.get("reviewer_identity_class") != "ANNA_EDITOR_IN_CHIEF_EDITORIAL_DIRECTOR":
            errors.append(f"{path}: Anna claim requires Anna reviewer_identity_class")
    if re.search(r"\bINDEPENDENT\s+QA\b", claim_text, re.I):
        if data.get("reviewer_identity_class") not in {"AUTHORIZED_INTERNAL_QA_REVIEWER", "AUTHORIZED_EXTERNAL_SPECIALIST", "AUTHORIZED_HUMAN_REVIEWER", "OTHER_AUTHORIZED_REVIEWER"}:
            errors.append(f"{path}: Independent QA claim lacks authorized QA reviewer class")
    return errors


def all_text_files():
    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in {".git", "node_modules"}]
        for filename in files:
            path = Path(root) / filename
            try:
                rel = path.relative_to(Path("."))
            except ValueError:
                rel = path
            if rel.suffix.lower() in TEXT_SUFFIXES:
                yield rel


def main():
    try:
        files = changed_files()
    except Exception as e:
        print("P0 REVIEW EXECUTION / PROVENANCE GATE: FAIL")
        print(f"- unable to determine complete changed-file set: {e}")
        sys.exit(1)

    failures = []
    checked = 0
    forensic_records = 0
    evidence_changed = any(EVIDENCE_DIR in path.parents or path == EVIDENCE_DIR for path in files)
    candidate_files = list(dict.fromkeys(list(all_text_files()) if evidence_changed else files))

    for path in candidate_files:
        if path in IMPLEMENTATION_EXEMPT_PATHS or EVIDENCE_DIR in path.parents:
            continue
        if not path.exists():
            continue
        if path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        try:
            text = path.read_text(encoding="utf-8", errors="strict")
        except Exception as e:
            failures.append(f"{path}: unable to read governed text safely: {e}")
            continue
        if not is_governed(path, text):
            continue
        matched = [rx.pattern for rx in CONTROLLED_PATTERNS if rx.search(text)]
        if not matched:
            continue
        checked += 1
        if is_reopen_only_forensic_record(path, text):
            forensic_records += 1
            continue
        if any(label in text for label in INTERNAL_LABELS) and not re.search(r"\b(ANNA\s+FINAL\s+RULING|INDEPENDENT\s+QA\s*=\s*PASS|DOWNSTREAM\s+ACTIVATION\s*=\s*AUTHORIZED|CERTIFIED|SIGNED\s+OFF)\b", text, re.I):
            continue
        eids = find_evidence_ids(text)
        if not eids:
            failures.append(f"{path}: controlled reviewer/gate claim without REVIEW_EXECUTION_EVIDENCE_ID")
            continue
        valid_one = False
        evidence_errors = []
        for eid in eids:
            try:
                ep, data = load_evidence(eid)
                errs = validate_evidence(ep, data, text)
                if not errs:
                    valid_one = True
                else:
                    evidence_errors.extend(errs)
            except ValueError as e:
                evidence_errors.append(str(e))
        if not valid_one:
            failures.append(f"{path}: no valid execution evidence record backs the controlled claim")
            failures.extend(evidence_errors)

    if failures:
        print("P0 REVIEW EXECUTION / PROVENANCE GATE: FAIL")
        for f in failures:
            print(f"- {f}")
        sys.exit(1)
    print(f"REVIEW EXECUTION / PROVENANCE GATE: PASS ({checked} controlled files checked; {forensic_records} reopen-only forensic records)")


if __name__ == "__main__":
    main()
