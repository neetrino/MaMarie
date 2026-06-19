#!/usr/bin/env bash
# Export hero PNGs from Figma Dev Mode (localhost asset server).
# Open MAMARIE.fig in Figma Desktop with Dev Mode, select frame 9:590, then run:
#   bash scripts/download-hero-assets.sh

set -euo pipefail

BASE="${FIGMA_ASSET_BASE:-http://localhost:3845/assets}"
DEST="$(cd "$(dirname "$0")/.." && pwd)/public/assets/hero"

mkdir -p "$DEST"

download() {
  local filename="$1"
  local hash="$2"
  echo "→ $filename"
  curl -fsSL "${BASE}/${hash}.png" -o "${DEST}/${filename}"
}

download "kids-photo.png" "0ea98d945bfb0e9757480f2af705db54da4cb6b5"
download "hero-layer-left.png" "279fdc56283443a8a28d9915c0e540a16e989920"
download "hero-layer-center.png" "0c9be628b0a4aa425a565eb9371cf540fc6862e1"
download "hero-layer-right.png" "1231d9bee514f06de2f44e761e3e3d0250bfd703"
download "decoration-camera-large.png" "43ef112343b5e98c159330c6efc009dad74e8aa1"
download "decoration-camera-small.png" "a416adb4158e1b5417403b0c29563c2a8cea0fa2"
download "decoration-camera-mid.png" "86037946116d5d410418eb4e501c7270b9e2c3f5"

echo "Done. Arc text: export node 77:2826 as PNG → public/assets/hero/shape-text-arc.png"
