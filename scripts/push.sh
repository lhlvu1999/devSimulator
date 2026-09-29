#!/usr/bin/env bash
# Pushes this repo as the personal GitHub account, then hands gh back to the work account.
set -euo pipefail

PERSONAL="lhlvu1999"
WORK="ble_axoncorp"

restore() {
  gh auth switch -h github.com -u "$WORK" >/dev/null 2>&1 || true
  echo "gh is back on $WORK."
}
trap restore EXIT

gh auth switch -h github.com -u "$PERSONAL" >/dev/null
echo "Pushing as $PERSONAL..."
git push "$@"
