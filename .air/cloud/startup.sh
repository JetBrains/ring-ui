#!/usr/bin/env bash
# Air cloud environment startup for ring-ui.
# Installs the Node version pinned in .nvmrc (via nvm, userspace), installs npm
# dependencies and starts the Storybook dev server on port 9999 in the background.
set -euo pipefail

if [ "${AIR_STARTUP_MODE:-}" = warmup ]; then WARMUP=1; else WARMUP=; fi

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_DIR"

STORYBOOK_PORT=9999
STORYBOOK_LOG=/tmp/storybook.log
export NVM_DIR="$HOME/.nvm"
NODE_VERSION="$(tr -d '[:space:]' < .nvmrc)"

log() { echo "[startup $(date +%H:%M:%S)] $*"; }

# --- Node via nvm -----------------------------------------------------------
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  log "Installing nvm"
  mkdir -p "$NVM_DIR"
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | PROFILE=/dev/null bash
fi
set +u
# shellcheck disable=SC1091
. "$NVM_DIR/nvm.sh" --no-use || true  # returns 3 when no default alias exists yet
log "Installing Node $NODE_VERSION"
nvm install "$NODE_VERSION"
nvm alias default "$NODE_VERSION" >/dev/null
nvm use "$NODE_VERSION" >/dev/null
set -u
log "node $(node -v), npm $(npm -v)"

# --- Login-shell hook so agent shells get the same Node ---------------------
ENV_FILE="$HOME/.ring-ui-env.sh"
cat > "$ENV_FILE" <<ENVEOF
export NVM_DIR="\$HOME/.nvm"
[ -s "\$NVM_DIR/nvm.sh" ] && . "\$NVM_DIR/nvm.sh"
ENVEOF
MARKER="# ring-ui air env"
PROFILE_FILE=""
for f in "$HOME/.bash_profile" "$HOME/.bash_login" "$HOME/.profile"; do
  if [ -f "$f" ]; then PROFILE_FILE="$f"; break; fi
done
[ -n "$PROFILE_FILE" ] || { PROFILE_FILE="$HOME/.profile"; touch "$PROFILE_FILE"; }
for f in "$PROFILE_FILE" "$HOME/.bashrc"; do
  grep -qF "$MARKER" "$f" 2>/dev/null || printf '\n%s\n[ -f "%s" ] && . "%s"\n' "$MARKER" "$ENV_FILE" "$ENV_FILE" >> "$f"
done

# --- Dependencies -----------------------------------------------------------
LOCK_STAMP="node_modules/.air-lock.sha"
LOCK_SHA="$(sha256sum package-lock.json | cut -d' ' -f1)"
if [ -d node_modules ] && [ "$(cat "$LOCK_STAMP" 2>/dev/null)" = "$LOCK_SHA" ]; then
  log "node_modules up to date with package-lock.json, skipping npm ci"
else
  # Some install scripts (port-claim via binary-install) download with axios, whose
  # built-in proxy support breaks HTTPS through the egress HTTP proxy ("wrong version
  # number"). Disable axios' own proxying and let Node's env-proxy support handle it.
  AXIOS_PRELOAD="$HOME/.cache/air/axios-env-proxy.cjs"
  mkdir -p "$(dirname "$AXIOS_PRELOAD")"
  cat > "$AXIOS_PRELOAD" <<'JSEOF'
const Module = require('module');
const load = Module._load;
Module._load = function (request, ...rest) {
  const m = load.call(this, request, ...rest);
  if (request === 'axios' && m && m.defaults) m.defaults.proxy = false;
  return m;
};
JSEOF
  log "Running npm ci"
  NODE_USE_ENV_PROXY=1 NODE_OPTIONS="--require $AXIOS_PRELOAD ${NODE_OPTIONS:-}" \
    npm ci --no-audit --no-fund --foreground-scripts
  echo "$LOCK_SHA" > "$LOCK_STAMP"
  log "npm ci done"
fi

# --- Storybook dev server (background) --------------------------------------
if curl -fsS -o /dev/null "http://localhost:$STORYBOOK_PORT/index.json" 2>/dev/null; then
  log "Storybook already running on port $STORYBOOK_PORT"
else
  log "Starting Storybook on 0.0.0.0:$STORYBOOK_PORT (log: $STORYBOOK_LOG)"
  nohup npx storybook dev -p "$STORYBOOK_PORT" --host 0.0.0.0 --ci --no-open \
    > "$STORYBOOK_LOG" 2>&1 < /dev/null &
fi

healthcheck() {
  log "healthcheck: waiting for Storybook on port $STORYBOOK_PORT"
  local i=0
  until curl -fsS -H "Host: example.air.local" "http://localhost:$STORYBOOK_PORT/index.json" 2>/dev/null \
      | grep -q '"entries"'; do
    if ! pgrep -f "storybook dev -p $STORYBOOK_PORT" >/dev/null; then
      log "healthcheck: Storybook process exited; last log lines:"
      tail -n 50 "$STORYBOOK_LOG" || true
      return 1
    fi
    i=$((i + 1))
    if [ $((i % 6)) -eq 0 ]; then
      log "healthcheck: still waiting; last log line: $(tail -n 1 "$STORYBOOK_LOG" 2>/dev/null || true)"
    fi
    sleep 5
  done
  # Index page must render the Storybook manager, not a host-check page
  curl -fsS -H "Host: example.air.local" "http://localhost:$STORYBOOK_PORT/" | grep -qi storybook
  log "healthcheck: Storybook is serving"
}

if [ -n "${WARMUP:-}" ]; then healthcheck; fi
log "Startup finished"
