#!/usr/bin/env python3
"""Read product JSON and print selected fields."""

import argparse
import json
import sys
from pathlib import Path


def extract_products(payload):
    """Yield each product object from payload["Bundles"][*]["Products"]."""
    bundles = payload.get("Bundles", [])
    if not isinstance(bundles, list):
        return

    for bundle in bundles:
        if not isinstance(bundle, dict):
            continue
        products = bundle.get("Products", [])
        if not isinstance(products, list):
            continue
        for product in products:
            if isinstance(product, dict):
                yield product


def pick_sale_price(product):
    """Pick the most likely sale price field if available."""
    for key in ("SalePrice", "InstoreSalePrice", "WasPrice", "InstoreWasPrice"):
        if key in product:
            return product.get(key)
    return None


def transform_product(product):
    small_image = product.get("SmallImageFile")
    if small_image is None:
        small_image = product.get("smallImageFile")

    return {
        "Product Name": product.get("Name"),
        "Produce Price": product.get("Price"),
        "Produce Sale Price": pick_sale_price(product),
        "CupMeasure": product.get("CupMeasure"),
        "CupString": product.get("CupString"),
        "SmallImageFile": small_image,
        "smallImageFile": small_image,
    }


def stable_record_key(record):
    """Build a deterministic key for deduplicating product records."""
    return json.dumps(record, sort_keys=True, separators=(",", ":"))


def main():
    parser = argparse.ArgumentParser(
        description="Filter product data from a Woolworths-style JSON file"
    )
    parser.add_argument("input_file", help="Path to input JSON file")
    args = parser.parse_args()

    input_path = Path(args.input_file)
    if not input_path.exists():
        print(f"Error: file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    try:
        payload = json.loads(input_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(f"Error: invalid JSON ({exc})", file=sys.stderr)
        sys.exit(1)

    filtered = [transform_product(p) for p in extract_products(payload)]

    output_path = Path(__file__).with_name("ingredients.json")
    existing_items = []

    if output_path.exists():
        raw_existing = output_path.read_text(encoding="utf-8")
        if not raw_existing.strip():
            existing_payload = []
        else:
            try:
                existing_payload = json.loads(raw_existing)
            except json.JSONDecodeError:
                backup_path = output_path.with_suffix(".invalid.json")
                backup_path.write_text(raw_existing, encoding="utf-8")
                print(
                    f"Warning: invalid JSON in {output_path}; "
                    f"backed up to {backup_path} and starting fresh",
                    file=sys.stderr,
                )
                existing_payload = []

        if isinstance(existing_payload, list):
            existing_items = existing_payload
        else:
            print("Error: output file must contain a JSON array", file=sys.stderr)
            sys.exit(1)

    unique_existing = []
    seen = set()
    for item in existing_items:
        if not isinstance(item, dict):
            continue
        key = stable_record_key(item)
        if key in seen:
            continue
        seen.add(key)
        unique_existing.append(item)

    new_unique = []
    skipped_duplicates = 0
    for item in filtered:
        key = stable_record_key(item)
        if key in seen:
            skipped_duplicates += 1
            continue
        seen.add(key)
        new_unique.append(item)

    combined = unique_existing + new_unique

    try:
        output_path.write_text(json.dumps(combined, indent=2), encoding="utf-8")
    except OSError as exc:
        print(f"Error: could not write output file ({exc})", file=sys.stderr)
        sys.exit(1)

    print(
        f"Appended {len(new_unique)} new items to {output_path} "
        f"(skipped duplicates: {skipped_duplicates}, total: {len(combined)})"
    )


if __name__ == "__main__":
    main()
