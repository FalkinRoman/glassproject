#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOCS="$ROOT/docs"

rm -rf "$DOCS"
mkdir -p "$DOCS"

cp -R "$ROOT/public/css" "$ROOT/public/js" "$ROOT/public/images" "$DOCS/"
cp "$ROOT/public/favicon.svg" "$DOCS/"

sed -E \
  -e "s/\{\{ asset\('([^']+)'\) \}\}/\1/g" \
  -e '/@verbatim/d' \
  -e '/@endverbatim/d' \
  "$ROOT/resources/views/welcome.blade.php" > "$DOCS/index.html"

touch "$DOCS/.nojekyll"

echo "Built GitHub Pages site in docs/"
