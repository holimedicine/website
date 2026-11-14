#!/bin/bash

# Scaffold an edukacja article or przepisy recipe.
# Usage: ./scripts/scaffold.sh <article|recipe> "<title>"

TYPE=$1
TITLE=$2

if [[ -z "$TYPE" || -z "$TITLE" ]]; then
  echo "Usage: ./scripts/scaffold.sh <article|recipe> \"<title>\"" >&2
  exit 1
fi

case "$TYPE" in
  article)
    DIR="src/content/edukacja"
    ;;
  recipe)
    DIR="src/content/przepisy"
    ;;
  *)
    echo "Invalid type '$TYPE'. Use 'article' or 'recipe'." >&2
    exit 1
    ;;
esac

SLUG=$(node -e '
  const s = process.argv[1];
  console.log(
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ł/g, "l")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
' "$TITLE")

if [[ -z "$SLUG" ]]; then
  echo "Could not derive a slug from title '$TITLE'." >&2
  exit 1
fi

FILEPATH="$DIR/$SLUG.mdx"

if [[ -e "$FILEPATH" ]]; then
  echo "Refusing to overwrite existing file: $FILEPATH" >&2
  exit 1
fi

ESCAPED_TITLE=$(printf '%s' "$TITLE" | sed 's/\\/\\\\/g; s/"/\\"/g')

mkdir -p "$DIR"

if [[ "$TYPE" == "article" ]]; then
  cat > "$FILEPATH" <<EOF
---
title: "$ESCAPED_TITLE"
order: 0
---
EOF
else
  cat > "$FILEPATH" <<EOF
---
title: "$ESCAPED_TITLE"
---
EOF
fi

echo "Created $FILEPATH"

if [[ "$TYPE" == "recipe" ]]; then
  echo "Next: add '$SLUG' to the recipes list in src/content/kategorie-przepisow/*.json (the list order sets the page order)."
fi
