#!/usr/bin/env python3
"""Update ingredient image URLs from /small/ to /large/ in ingredients.json."""

import json
import sys
from pathlib import Path


INPUT_FILE = Path(__file__).with_name("ingredients.json")
BACKUP_FILE = Path(__file__).with_name("ingredients.backup.json")


def small_to_large(url: str) -> str:
    return url.replace("/small/", "/large/")


def main() -> int:
    if not INPUT_FILE.exists():
        print(f"Error: file not found: {INPUT_FILE}", file=sys.stderr)
        return 1

    try:
        data = json.loads(INPUT_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(f"Error: invalid JSON in {INPUT_FILE} ({exc})", file=sys.stderr)
        return 1

    if not isinstance(data, list):
        print("Error: ingredients.json must contain a JSON array", file=sys.stderr)
        return 1

    updated_count = 0

    for item in data:
        if not isinstance(item, dict):
            continue

        for key in ("SmallImageFile", "smallImageFile"):
            value = item.get(key)
            if isinstance(value, str) and "/small/" in value:
                item[key] = small_to_large(value)
                updated_count += 1

    BACKUP_FILE.write_text(INPUT_FILE.read_text(encoding="utf-8"), encoding="utf-8")
    INPUT_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")

    print(
        f"Updated {updated_count} image URL fields in {INPUT_FILE}. "
        f"Backup written to {BACKUP_FILE}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
