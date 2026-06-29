#!/usr/bin/env bash
# Export hero PNGs from Figma Dev Mode (localhost asset server).
# Open MAMARIE-DEV in Figma Desktop with Dev Mode, select frame 51:329, then run:
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

download "hero-pink-arch.png" "4225c7a49399c60f19ad26b95535a4e01bee7aee"
download "hero-main-composite.png" "c5a1c24e799590c21c73a176ee5420a9b7c4336d"
download "hero-left-wing.png" "6a7dab3ac5305995c3111bda81c0ed2f6ff4197e"
download "decoration-strawberry.png" "87142ae76696ba0208734972db39a7f19077e422"
download "decoration-carrot.png" "9fb5cb9413d6bebbf44621805e17720fcb087df9"
download "decoration-camera-mid.png" "86037946116d5d410418eb4e501c7270b9e2c3f5"
download "decoration-camera-small.png" "a416adb4158e1b5417403b0c29563c2a8cea0fa2"

echo "Done."
