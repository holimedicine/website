#!/bin/bash
# Double-click to pull the latest content and start the local site.

cd "$(dirname "$0")" || exit 1
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

echo "-> Getting the latest content from GitHub..."
if ! git pull --ff-only; then
  echo "   Could not update; using the current local copy."
fi

if [ ! -d node_modules ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
  echo "-> Installing dependencies..."
  npm install
fi

if [ ! -f .env ]; then
  echo "-> Warning: .env is missing; the Keystatic editor will not work."
  echo "   Copy .env.example to .env and fill in the GitHub App values."
fi

echo
echo "-> Local site:     http://localhost:4321/"
echo "-> Content editor: http://localhost:4321/keystatic/"
echo "   Press Ctrl+C to stop."
echo

npm run dev

echo
read -n 1 -s -r -p "Server stopped. Press any key to close this window..."
