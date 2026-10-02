#!/usr/bin/env bash
set -e

# JC Multi-Agent SDLC Framework Installer (Bash)
# Usage:
#   ./install.sh --local
#   ./install.sh --global
#   ./install.sh --all

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_SRC="$SCRIPT_DIR/skills"
RULES_SRC="$SCRIPT_DIR/rules"
TEMPLATES_SRC="$SCRIPT_DIR/templates"
AGENTS_MD_SRC="$SCRIPT_DIR/AGENTS.md"

GLOBAL_CONFIG_DIR="$HOME/.gemini/config"
GLOBAL_SKILLS_DIR="$GLOBAL_CONFIG_DIR/skills"
GLOBAL_RULES_DIR="$GLOBAL_CONFIG_DIR/rules"

DO_GLOBAL=false
DO_LOCAL=false
DO_ALL=false
FORCE=false
DEST=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -g|--global)
      DO_GLOBAL=true
      shift
      ;;
    -l|--local)
      DO_LOCAL=true
      shift
      ;;
    -a|--all)
      DO_ALL=true
      shift
      ;;
    -f|--force)
      FORCE=true
      shift
      ;;
    --dest)
      DEST="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

echo ""
echo "========================================================================"
echo "   JC MULTI-AGENT SDLC FRAMEWORK INSTALLER (Bash)"
echo "========================================================================"
echo ""

if [ "$DO_GLOBAL" = false ] && [ "$DO_LOCAL" = false ] && [ -z "$DEST" ]; then
  echo "Where would you like to install the JC SDLC Framework?"
  echo "  1) Current Project (.agents/ directory)"
  echo "  2) Global Antigravity Config (~/.gemini/config/)"
  echo "  3) Both (Local + Global)"
  read -p "Select option [1-3] (Default: 1): " choice
  case "$choice" in
    2) DO_GLOBAL=true ;;
    3) DO_LOCAL=true; DO_GLOBAL=true ;;
    *) DO_LOCAL=true ;;
  esac
fi

install_to_path() {
  local target_skills="$1"
  local target_rules="$2"
  local target_agents_md="$3"
  local target_templates="$4"
  local label="$5"

  echo "--> Installing to $label..."
  mkdir -p "$target_skills"
  cp -r "$SKILLS_SRC"/* "$target_skills/"
  echo "    [OK] 17 Skills installed."

  if [ -n "$target_rules" ] && [ -d "$RULES_SRC" ]; then
    mkdir -p "$target_rules"
    cp -r "$RULES_SRC"/* "$target_rules/"
    echo "    [OK] SDLC rules installed."
  fi

  if [ -n "$target_agents_md" ] && [ -f "$AGENTS_MD_SRC" ]; then
    if [ ! -f "$target_agents_md" ] || [ "$FORCE" = true ]; then
      cp "$AGENTS_MD_SRC" "$target_agents_md"
      echo "    [OK] AGENTS.md created."
    fi
  fi

  if [ -n "$target_templates" ] && [ -d "$TEMPLATES_SRC/Project-specification" ]; then
    mkdir -p "$target_templates"
    cp -r "$TEMPLATES_SRC/Project-specification"/* "$target_templates/"
    echo "    [OK] Project starter templates initialized."
  fi
}

if [ "$DO_GLOBAL" = true ]; then
  # Check if the global npm prefix is user-writable
  NPM_PREFIX=$(npm config get prefix 2>/dev/null || echo "/usr/local")
  GLOBAL_TARGET_DIR="$NPM_PREFIX/lib/node_modules"
  if [ -d "$GLOBAL_TARGET_DIR" ] && [ ! -w "$GLOBAL_TARGET_DIR" ]; then
    echo ""
    echo "⚠️  WARNING: Global npm prefix '$NPM_PREFIX' is NOT writable by the current user."
    echo "   If you intend to use 'npm install -g' or 'npm link' later, you will get an EACCES error."
    echo "   Fix with:"
    echo "     mkdir -p ~/.npm-global"
    echo "     npm config set prefix '~/.npm-global'"
    echo "     echo 'export PATH=~/.npm-global/bin:\$PATH' >> ~/.zshrc && source ~/.zshrc"
    echo ""
  fi
  install_to_path "$GLOBAL_SKILLS_DIR" "$GLOBAL_RULES_DIR" "" "" "Global Config ($GLOBAL_CONFIG_DIR)"
fi

if [ "$DO_LOCAL" = true ] || [ -n "$DEST" ]; then
  TARGET_BASE="${DEST:-$(pwd)}"
  install_to_path "$TARGET_BASE/.agents/skills" "$TARGET_BASE/.agents/rules" "$TARGET_BASE/AGENTS.md" "$TARGET_BASE/Project-specification" "Local Project ($TARGET_BASE)"
fi

echo ""
echo "SUCCESS: JC SDLC Framework installed successfully!"
echo ""
