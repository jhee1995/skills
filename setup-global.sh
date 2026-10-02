#!/usr/bin/env bash
# ============================================================
# JC Multi-Agent SDLC Framework — Global Setup (Mac / Linux)
# ============================================================
# Installs the 'jc-skills' / 'jc' command globally from GitHub.
# Automatically fixes the EACCES npm permission issue on Mac.
#
# Usage (no repo clone required):
#   curl -fsSL https://raw.githubusercontent.com/jhee1995/skills/main/setup-global.sh | bash
#   # or after cloning:
#   bash setup-global.sh
# ============================================================

set -e

GITHUB_PKG="github:jhee1995/skills"
NPM_GLOBAL_DIR="$HOME/.npm-global"

echo ""
echo "========================================================"
echo "  JC MULTI-AGENT SDLC FRAMEWORK — Global Installer"
echo "========================================================"
echo ""

# ── 1. Check Node.js ─────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo "❌ Node.js not found. Please install Node.js >= 18 first:"
  echo "   https://nodejs.org"
  exit 1
fi
NODE_VER=$(node -e "process.stdout.write(process.version.slice(1).split('.')[0])")
if [ "$NODE_VER" -lt 18 ]; then
  echo "❌ Node.js >= 18 required. Found: $(node --version)"
  exit 1
fi
echo "✔  Node.js $(node --version) detected."

# ── 2. Check if npm global prefix is user-writable ───────────
NPM_PREFIX=$(npm config get prefix 2>/dev/null || echo "/usr/local")
GLOBAL_MODULES="$NPM_PREFIX/lib/node_modules"

if [ -d "$GLOBAL_MODULES" ] && [ ! -w "$GLOBAL_MODULES" ]; then
  echo ""
  echo "⚠️  npm global prefix '$NPM_PREFIX' is NOT writable by the current user."
  echo "   Configuring a user-writable npm prefix at: $NPM_GLOBAL_DIR"
  echo ""

  mkdir -p "$NPM_GLOBAL_DIR"
  npm config set prefix "$NPM_GLOBAL_DIR"

  # Add to PATH in shell config if not already there
  SHELL_RC=""
  if [ -n "$ZSH_VERSION" ] || [[ "$SHELL" == */zsh ]]; then
    SHELL_RC="$HOME/.zshrc"
  elif [ -n "$BASH_VERSION" ] || [[ "$SHELL" == */bash ]]; then
    SHELL_RC="$HOME/.bash_profile"
  fi

  if [ -n "$SHELL_RC" ]; then
    if ! grep -q 'npm-global/bin' "$SHELL_RC" 2>/dev/null; then
      echo '' >> "$SHELL_RC"
      echo '# npm global user prefix (added by jc-skills installer)' >> "$SHELL_RC"
      echo "export PATH=\"$NPM_GLOBAL_DIR/bin:\$PATH\"" >> "$SHELL_RC"
      echo "   ✔  Added '$NPM_GLOBAL_DIR/bin' to PATH in $SHELL_RC"
    fi
  fi

  # Export PATH for the current session
  export PATH="$NPM_GLOBAL_DIR/bin:$PATH"
  NPM_PREFIX="$NPM_GLOBAL_DIR"
  echo "   ✔  npm prefix set to: $NPM_GLOBAL_DIR"
  echo ""
else
  echo "✔  npm global prefix '$NPM_PREFIX' is writable."
fi

# ── 3. Install from GitHub ────────────────────────────────────
echo "📦 Installing jc-skills from GitHub..."
echo "   Source: https://github.com/jhee1995/skills"
echo ""

npm install -g "$GITHUB_PKG"

# ── 4. Verify ────────────────────────────────────────────────
echo ""
if command -v jc-skills &>/dev/null; then
  echo "✅ SUCCESS! 'jc-skills' command is now available globally."
  echo ""
  echo "Quick start:"
  echo "   jc-skills init --local --all   # Install in current project"
  echo "   jc-skills list                 # Show all 17 SDLC skills"
  echo "   jc-skills status               # Check installation status"
  echo ""
  echo "Or use the short alias:"
  echo "   jc init --local --all"
  echo ""
else
  echo "⚠️  Installation completed but 'jc-skills' is not in PATH yet."
  echo "   Run the following to activate it in the current terminal:"
  echo ""
  echo "   export PATH=\"$NPM_GLOBAL_DIR/bin:\$PATH\""
  echo ""
  echo "   Then run: jc-skills init --local --all"
  echo ""
  if [ -n "$SHELL_RC" ]; then
    echo "   (New terminal sessions will have it automatically via $SHELL_RC)"
  fi
fi
