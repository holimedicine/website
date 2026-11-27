#!/bin/bash

# Scaffold a knowledge-base article or a recipe.
# Usage:
#   ./scripts/scaffold.sh article "<title>" <section-slug> [topic-slug]
#   ./scripts/scaffold.sh recipe "<title>"

set -euo pipefail

TYPE=${1:-}
TITLE=${2:-}
SECTION=${3:-}
TOPIC=${4:-}

if [[ -z "$TYPE" || -z "$TITLE" ]]; then
  echo 'Usage: ./scripts/scaffold.sh article "<title>" <section-slug> [topic-slug]' >&2
  echo '       ./scripts/scaffold.sh recipe "<title>"' >&2
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

if [[ "$TYPE" == "article" ]]; then
  if [[ -z "$SECTION" ]]; then
    echo "Missing section for the article. Available sections:" >&2
    ls src/content/sekcje-bazy-wiedzy/*.json 2>/dev/null | sed 's#.*/##; s#\.json$##' >&2
    exit 1
  fi

  SECTION_FILE="src/content/sekcje-bazy-wiedzy/$SECTION.json"
  if [[ ! -f "$SECTION_FILE" ]]; then
    echo "Unknown section '$SECTION'. Available sections:" >&2
    ls src/content/sekcje-bazy-wiedzy/*.json 2>/dev/null | sed 's#.*/##; s#\.json$##' >&2
    exit 1
  fi

  if [[ -n "$TOPIC" ]]; then
    TOPIC_FILE="src/content/tematy-bazy-wiedzy/$TOPIC.json"
    if [[ ! -f "$TOPIC_FILE" ]]; then
      echo "Unknown topic '$TOPIC'. Available topics:" >&2
      ls src/content/tematy-bazy-wiedzy/*.json 2>/dev/null | sed 's#.*/##; s#\.json$##' >&2
      exit 1
    fi

    if ! node -e '
      const fs = require("fs");
      const data = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
      process.exit(data.section === process.argv[2] ? 0 : 1);
    ' "$TOPIC_FILE" "$SECTION"; then
      echo "Topic '$TOPIC' does not belong to section '$SECTION'." >&2
      exit 1
    fi
  fi
fi

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
  {
    echo '---'
    echo "title: \"$ESCAPED_TITLE\""
    echo 'author: "Donat Cupiał"'
    echo "section: \"$SECTION\""
    if [[ -n "$TOPIC" ]]; then
      echo "topic: \"$TOPIC\""
    fi
    echo 'order: 0'
    echo 'status: draft'
    echo '---'
  } > "$FILEPATH"
else
  cat > "$FILEPATH" <<EOF
---
title: "$ESCAPED_TITLE"
---
EOF
fi

echo "Created $FILEPATH"

if [[ "$TYPE" == "article" ]]; then
  echo "Next: write the body, then change 'status: draft' to 'status: published' when it is ready."
else
  echo "Next: add '$SLUG' to the recipes list in src/content/kategorie-przepisow/*.json (the list order sets the page order)."
fi
