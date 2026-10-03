#!/usr/bin/env node

/**
 * JC Multi-Agent SDLC Framework CLI
 * Autonomous 17-Skill SDLC Engineering Suite for Google Antigravity
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// ANSI Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  boldCyan: '\x1b[1;36m',
  boldGreen: '\x1b[1;32m',
  boldYellow: '\x1b[1;33m',
  boldWhite: '\x1b[1;37m'
};

const c = {
  cyan: (t) => `${colors.cyan}${t}${colors.reset}`,
  green: (t) => `${colors.green}${t}${colors.reset}`,
  yellow: (t) => `${colors.yellow}${t}${colors.reset}`,
  blue: (t) => `${colors.blue}${t}${colors.reset}`,
  magenta: (t) => `${colors.magenta}${t}${colors.reset}`,
  red: (t) => `${colors.red}${t}${colors.reset}`,
  gray: (t) => `${colors.gray}${t}${colors.reset}`,
  bright: (t) => `${colors.bright}${t}${colors.reset}`,
  dim: (t) => `${colors.dim}${t}${colors.reset}`,
  boldCyan: (t) => `${colors.boldCyan}${t}${colors.reset}`,
  boldGreen: (t) => `${colors.boldGreen}${t}${colors.reset}`,
  boldYellow: (t) => `${colors.boldYellow}${t}${colors.reset}`,
  boldWhite: (t) => `${colors.boldWhite}${t}${colors.reset}`
};

// Paths
const PKG_ROOT = path.resolve(__dirname, '..');
const FRAMEWORK_JSON_PATH = path.join(PKG_ROOT, 'framework.json');
const SKILLS_SRC_DIR = path.join(PKG_ROOT, 'skills');
const RULES_SRC_DIR = path.join(PKG_ROOT, 'rules');
const TEMPLATES_SRC_DIR = path.join(PKG_ROOT, 'templates');
const AGENTS_MD_SRC = path.join(PKG_ROOT, 'AGENTS.md');

// Load manifest
let frameworkData = {};
try {
  if (fs.existsSync(FRAMEWORK_JSON_PATH)) {
    frameworkData = JSON.parse(fs.readFileSync(FRAMEWORK_JSON_PATH, 'utf-8'));
  }
} catch (e) {
  // fallback
}

const VERSION = frameworkData.version || '1.0.0';

// Global config path
const GLOBAL_CONFIG_DIR = path.join(os.homedir(), '.gemini', 'config');
const GLOBAL_SKILLS_DIR = path.join(GLOBAL_CONFIG_DIR, 'skills');
const GLOBAL_RULES_DIR = path.join(GLOBAL_CONFIG_DIR, 'rules');

// Minimalist Badge Banner (Vercel / Next.js / PNPM style)
function showBanner() {
  console.log(`
  ${colors.gray}┌─────────────────────────────────────────────────────────────┐${colors.reset}
  ${colors.gray}│${colors.reset}                                                             ${colors.gray}│${colors.reset}
  ${colors.gray}│${colors.reset}   ${colors.boldCyan}■${colors.reset} ${colors.boldWhite}JC FRAMEWORK${colors.reset}  ${colors.boldYellow}v${VERSION}${colors.reset}                                    ${colors.gray}│${colors.reset}
  ${colors.gray}│${colors.reset}     ${colors.dim}Multi-Agent SDLC Engineering Suite for Antigravity${colors.reset}      ${colors.gray}│${colors.reset}
  ${colors.gray}│${colors.reset}     ${colors.dim}Author:${colors.reset} ${colors.cyan}Jhee1995${colors.reset} ${colors.gray}|${colors.reset} ${colors.boldGreen}✔ 17 Specialized Skills Ready${colors.reset}        ${colors.gray}│${colors.reset}
  ${colors.gray}│${colors.reset}                                                             ${colors.gray}│${colors.reset}
  ${colors.gray}└─────────────────────────────────────────────────────────────┘${colors.reset}
`);
}

// Copy directory recursively
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return 0;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  let count = 0;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      count += copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
}

// Interactive prompt helper
function ask(question, defaultValue = '') {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const promptText = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
    rl.question(promptText, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

// Command: list
function cmdList() {
  showBanner();
  console.log(c.boldWhite('📋 Framework Skills Directory (17 Specialized Skills):\n'));

  const phases = frameworkData.phases || {
    governance: { name: 'Governance & Orchestration', skills: ['jc.orchestrator'] },
    A: { name: 'Phase A: Project Setup', skills: ['jc.product-owner', 'jc.project-structure', 'jc.environment-initializer', 'jc.structure-builder', 'jc.devops-engineer'] },
    B: { name: 'Phase B: Per-Story Iterative Loop', skills: ['jc.analyst', 'jc.contract-creator', 'jc.ai-engineer', 'jc.data-architect', 'jc.ux-ui', 'jc.backend-expert', 'jc.frontend-expert', 'jc.cybersecurity', 'jc.qa-automation', 'jc.sre-performance'] },
    C: { name: 'Phase C: Project Delivery & Release', skills: ['jc.tech-writer', 'jc.devops-engineer'] }
  };

  const skillsList = frameworkData.skills || [];
  const skillsMap = {};
  for (const s of skillsList) {
    skillsMap[s.name] = s;
  }

  for (const [phaseKey, phaseInfo] of Object.entries(phases)) {
    console.log(c.boldYellow(`  ▶ ${phaseInfo.name}`));
    if (phaseInfo.description) {
      console.log(c.gray(`    ${phaseInfo.description}`));
    }
    console.log('');

    for (const skillName of phaseInfo.skills) {
      const s = skillsMap[skillName] || { name: skillName, description: 'SDLC Skill' };
      console.log(`    ${c.boldCyan('•')} ${c.bright(s.name.padEnd(28))} ${c.dim(s.description)}`);
    }
    console.log('');
  }
}

// Command: status
function cmdStatus() {
  showBanner();
  const cwd = process.cwd();
  console.log(c.boldWhite(`🔍 Diagnostics & Installation Status:\n`));

  // Check Local Project
  const localAgentsDir = path.join(cwd, '.agents');
  const localSkillsDir = path.join(localAgentsDir, 'skills');
  const localAgentsMd = path.join(cwd, 'AGENTS.md');
  const localPipeline = path.join(cwd, 'Project-specification', 'pipeline-state.yml');

  console.log(c.boldCyan(`📁 Current Working Directory: ${cwd}`));
  if (fs.existsSync(localSkillsDir)) {
    const skills = fs.readdirSync(localSkillsDir).filter(f => fs.statSync(path.join(localSkillsDir, f)).isDirectory());
    console.log(`   ${c.green('✔')} Local .agents/skills detected: ${c.boldGreen(skills.length)} skills installed`);
  } else {
    console.log(`   ${c.yellow('○')} Local .agents/skills not found`);
  }

  if (fs.existsSync(localAgentsMd)) {
    console.log(`   ${c.green('✔')} Project AGENTS.md rules file detected`);
  } else {
    console.log(`   ${c.yellow('○')} Project AGENTS.md not found`);
  }

  if (fs.existsSync(localPipeline)) {
    console.log(`   ${c.green('✔')} Project-specification/pipeline-state.yml detected`);
  } else {
    console.log(`   ${c.gray('○')} Project-specification starter files not initialized`);
  }

  console.log('');

  // Check Global
  console.log(c.boldCyan(`🌐 Global Antigravity Config (${GLOBAL_CONFIG_DIR}):`));
  if (fs.existsSync(GLOBAL_SKILLS_DIR)) {
    try {
      const gSkills = fs.readdirSync(GLOBAL_SKILLS_DIR).filter(f => fs.statSync(path.join(GLOBAL_SKILLS_DIR, f)).isDirectory());
      console.log(`   ${c.green('✔')} Global skills directory: ${c.boldGreen(gSkills.length)} skills available to all projects`);
    } catch (e) {
      console.log(`   ${c.yellow('○')} Global directory exists (access restricted or unreadable)`);
    }
  } else {
    console.log(`   ${c.yellow('○')} Global skills not installed yet (~/.gemini/config/skills)`);
  }

  console.log('');
}

// Installation Core Routine
function performInstall({ targetDir, isGlobal, copyTemplates, copyRules, force }) {
  console.log(c.cyan(`\n🚀 Installing JC SDLC Framework...`));

  let skillsTarget = '';
  let rulesTarget = '';
  let agentsMdTarget = '';
  let templatesTarget = '';

  if (isGlobal) {
    skillsTarget = GLOBAL_SKILLS_DIR;
    rulesTarget = GLOBAL_RULES_DIR;
    console.log(`   ${c.boldWhite('Mode:')} Global User Installation (${GLOBAL_CONFIG_DIR})`);
  } else {
    skillsTarget = path.join(targetDir, '.agents', 'skills');
    rulesTarget = path.join(targetDir, '.agents', 'rules');
    agentsMdTarget = path.join(targetDir, 'AGENTS.md');
    templatesTarget = path.join(targetDir, 'Project-specification');
    console.log(`   ${c.boldWhite('Mode:')} Project Local Installation (${targetDir})`);
  }

  // 1. Install Skills
  console.log(`   ${c.blue('▶')} Copying 17 skills to: ${skillsTarget}`);
  const skillsCount = copyDirSync(SKILLS_SRC_DIR, skillsTarget);
  console.log(`     ${c.green('✔')} Installed skills successfully!`);

  // 2. Install Rules
  if (copyRules && fs.existsSync(RULES_SRC_DIR)) {
    console.log(`   ${c.blue('▶')} Copying master rules to: ${rulesTarget}`);
    copyDirSync(RULES_SRC_DIR, rulesTarget);
    console.log(`     ${c.green('✔')} Installed rules in ${rulesTarget}`);
  }

  if (!isGlobal && copyRules && fs.existsSync(AGENTS_MD_SRC)) {
    if (!fs.existsSync(agentsMdTarget) || force) {
      fs.copyFileSync(AGENTS_MD_SRC, agentsMdTarget);
      console.log(`     ${c.green('✔')} Created ${c.bright('AGENTS.md')} at project root`);
    }
  }

  // 3. Install Starter Templates
  if (!isGlobal && copyTemplates && fs.existsSync(TEMPLATES_SRC_DIR)) {
    console.log(`   ${c.blue('▶')} Initializing starter project templates...`);
    const tmplSpec = path.join(TEMPLATES_SRC_DIR, 'Project-specification');
    if (fs.existsSync(tmplSpec)) {
      if (!fs.existsSync(templatesTarget)) {
        fs.mkdirSync(templatesTarget, { recursive: true });
      }
      const files = fs.readdirSync(tmplSpec);
      for (const file of files) {
        const srcFile = path.join(tmplSpec, file);
        const destFile = path.join(templatesTarget, file);
        if (!fs.existsSync(destFile) || force) {
          fs.copyFileSync(srcFile, destFile);
          console.log(`     ${c.green('✔')} Created ${file}`);
        } else {
          console.log(`     ${c.gray('•')} Kept existing ${file}`);
        }
      }
    }
  }

  console.log(`\n${c.boldGreen('✨ Installation completed successfully!')}`);
  console.log(`\n${c.boldWhite('Next Steps:')}`);
  if (isGlobal) {
    console.log(`  1. Open any project in Google Antigravity IDE.`);
    console.log(`  2. The 17 skills (starting with ${c.cyan('jc.orchestrator')}) will be immediately available globally!`);
  } else {
    console.log(`  1. The skills are ready in ${c.cyan('.agents/skills/')}`);
    console.log(`  2. Commit ${c.cyan('.agents/')} and ${c.cyan('AGENTS.md')} to version control.`);
    console.log(`  3. Ask Antigravity: ${c.boldYellow('"Inicia el proyecto usando jc.orchestrator"')}`);
  }
  console.log('');
}

// Command: init / install
async function cmdInit(args) {
  showBanner();

  const isGlobalFlag = args.includes('--global') || args.includes('-g');
  const isLocalFlag = args.includes('--local') || args.includes('-l');
  const withTemplatesFlag = args.includes('--templates') || args.includes('-t');
  const isForceFlag = args.includes('--force') || args.includes('-f');
  const isAllFlag = args.includes('--all');

  let customDest = null;
  const destIndex = args.indexOf('--dest');
  if (destIndex !== -1 && args[destIndex + 1]) {
    customDest = path.resolve(args[destIndex + 1]);
  }

  // Non-interactive path if flags are passed
  if (isGlobalFlag || isLocalFlag || isAllFlag || customDest) {
    const targetDir = customDest || process.cwd();
    const isGlobal = isGlobalFlag;
    const copyTemplates = withTemplatesFlag || isAllFlag;
    const copyRules = true;
    const force = isForceFlag;

    performInstall({ targetDir, isGlobal, copyTemplates, copyRules, force });
    return;
  }

  // Interactive Wizard
  console.log(c.boldWhite('🛠️  Interactive Installation Wizard:\n'));
  console.log('Where would you like to install the JC SDLC Framework?\n');
  console.log(`  ${c.boldCyan('1)')} ${c.bright('Current Project')} ${c.gray('(local .agents/ directory in this workspace)')}`);
  console.log(`  ${c.boldCyan('2)')} ${c.bright('Global Configuration')} ${c.gray('(available to ALL projects in Antigravity on this computer)')}`);
  console.log(`  ${c.boldCyan('3)')} ${c.bright('Both')} ${c.gray('(local project + global config)')}`);
  console.log(`  ${c.boldCyan('4)')} ${c.bright('Custom directory path')}\n`);

  const choice = await ask(c.boldYellow('Select option [1-4]'), '1');

  let doLocal = false;
  let doGlobal = false;
  let customTarget = null;

  if (choice === '1') {
    doLocal = true;
  } else if (choice === '2') {
    doGlobal = true;
  } else if (choice === '3') {
    doLocal = true;
    doGlobal = true;
  } else if (choice === '4') {
    const dirInput = await ask(c.boldYellow('Enter destination directory path'), process.cwd());
    customTarget = path.resolve(dirInput);
    doLocal = true;
  } else {
    doLocal = true;
  }

  let copyTemplates = false;
  if (doLocal) {
    const tmplAns = await ask(c.boldYellow('Include project starter templates (pipeline-state.yml, decisions.yml)? [y/n]'), 'y');
    copyTemplates = tmplAns.toLowerCase().startsWith('y');
  }

  const forceAns = await ask(c.boldYellow('Overwrite existing files if already present? [y/n]'), 'y');
  const force = forceAns.toLowerCase().startsWith('y');

  if (doGlobal) {
    performInstall({
      targetDir: process.cwd(),
      isGlobal: true,
      copyTemplates: false,
      copyRules: true,
      force
    });
  }

  if (doLocal) {
    performInstall({
      targetDir: customTarget || process.cwd(),
      isGlobal: false,
      copyTemplates,
      copyRules: true,
      force
    });
  }
}

// Command: help
function cmdHelp() {
  showBanner();
  console.log(`
${c.boldWhite('Usage (globally installed):')}
  ${c.cyan('jc-skills')} ${c.yellow('<command>')} [options]
  ${c.cyan('jc')} ${c.yellow('<command>')} [options]

${c.boldWhite('Usage (without installing):')}
  ${c.cyan('npx github:jhee1995/skills')} ${c.yellow('<command>')} [options]
  ${c.cyan('node bin/cli.js')} ${c.yellow('<command>')} [options]

${c.boldWhite('Commands:')}
  ${c.boldYellow('init')} | ${c.boldYellow('install')}   Interactive setup wizard to install the framework
  ${c.boldYellow('list')}               List all 17 SDLC skills and descriptions
  ${c.boldYellow('status')}             Inspect current workspace and global installation status
  ${c.boldYellow('update')}             Update all installed skills and rules to latest version
  ${c.boldYellow('help')}               Show this help manual

${c.boldWhite('Options:')}
  ${c.cyan('-l, --local')}         Install to local workspace (.agents/)
  ${c.cyan('-g, --global')}        Install to global user config (~/.gemini/config/)
  ${c.cyan('-t, --templates')}     Include starter templates (Project-specification/)
  ${c.cyan('-a, --all')}           Install everything (skills, rules, templates)
  ${c.cyan('-f, --force')}         Overwrite existing files
  ${c.cyan('--dest <path>')}       Specify custom installation directory

${c.boldWhite('Global Install (Mac/Linux — no repo clone needed):')}
  ${c.dim('# Recommended: auto-fixes EACCES permissions on Mac:')}
  ${c.cyan('curl -fsSL https://raw.githubusercontent.com/jhee1995/skills/main/setup-global.sh | bash')}

  ${c.dim('# Manual global install via npm:')}
  ${c.cyan('npm install -g github:jhee1995/skills')}

${c.boldWhite('Examples:')}
  ${c.dim('# Run from anywhere without installing:')}
  ${c.cyan('npx github:jhee1995/skills init --local --all')}

  ${c.dim('# After global install — install in current project with templates:')}
  ${c.cyan('jc-skills init --local --all')}

  ${c.dim('# Install in ~/.gemini/config/ (global for all Antigravity projects):')}
  ${c.cyan('jc-skills init --global')}

  ${c.dim('# Check framework status:')}
  ${c.cyan('jc-skills status')}
`);
}

// Main dispatcher
async function main() {
  const args = process.argv.slice(2);
  const command = (args[0] || 'init').toLowerCase();

  switch (command) {
    case 'init':
    case 'install':
      await cmdInit(args.slice(1));
      break;
    case 'list':
    case 'skills':
      cmdList();
      break;
    case 'status':
    case 'check':
      cmdStatus();
      break;
    case 'update':
      await cmdInit([...args.slice(1), '--force']);
      break;
    case 'help':
    case '--help':
    case '-h':
      cmdHelp();
      break;
    case 'version':
    case '--version':
    case '-v':
      console.log(`v${VERSION}`);
      break;
    default:
      if (args[0] && args[0].startsWith('-')) {
        await cmdInit(args);
      } else {
        console.log(c.red(`Unknown command: ${command}`));
        cmdHelp();
      }
      break;
  }
}

main().catch(err => {
  console.error(c.red(`\nError: ${err.message}`));
  process.exit(1);
});
