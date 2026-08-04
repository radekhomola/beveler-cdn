#!/usr/bin/env bash
# One-shot: create public GitHub repo + push + tag v1.0.0
set -euo pipefail
cd "$(dirname "$0")"

if ! command -v gh >/dev/null 2>&1; then
  echo "Instaluju GitHub CLI (brew)…"
  brew install gh
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Přihlas se do GitHubu:"
  gh auth login
fi

git branch -M main 2>/dev/null || true
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "git@github.com:radekhomola/beveler-cdn.git"
fi

if gh repo view radekhomola/beveler-cdn >/dev/null 2>&1; then
  echo "Repo už existuje — pushuju…"
else
  echo "Vytvářím public repo radekhomola/beveler-cdn…"
  gh repo create beveler-cdn --public --source=. --remote=origin --description "Beveler.eu public CDN assets (jsDelivr)"
fi

git push -u origin main
git push origin v1.0.0 2>/dev/null || { git tag v1.0.0 2>/dev/null || true; git push origin v1.0.0; }

echo
echo "Hotovo. Webflow URL:"
echo "  https://cdn.jsdelivr.net/gh/radekhomola/beveler-cdn@v1.0.0/cdn/site.min.css"
echo "  https://cdn.jsdelivr.net/gh/radekhomola/beveler-cdn@v1.0.0/cdn/site.min.js"
echo
echo "Repo: https://github.com/radekhomola/beveler-cdn"
