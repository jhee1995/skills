<#
.SYNOPSIS
    JC Multi-Agent SDLC Framework Installer for Windows PowerShell
.DESCRIPTION
    Installs the 17-Skill SDLC Framework into local project (.agents/) or global Antigravity config (~/.gemini/config/).
.EXAMPLE
    .\install.ps1 -Global
.EXAMPLE
    .\install.ps1 -Local -All
#>

[CmdletBinding()]
param(
    [switch]$Global,
    [switch]$Local,
    [switch]$All,
    [switch]$Force,
    [string]$Destination = ""
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "   JC MULTI-AGENT SDLC FRAMEWORK INSTALLER (PowerShell)" -ForegroundColor White
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$SkillsSrc = Join-Path $ScriptDir "skills"
$RulesSrc = Join-Path $ScriptDir "rules"
$TemplatesSrc = Join-Path $ScriptDir "templates"
$AgentsMdSrc = Join-Path $ScriptDir "AGENTS.md"

$GlobalConfigDir = Join-Path $HOME ".gemini\config"
$GlobalSkillsDir = Join-Path $GlobalConfigDir "skills"
$GlobalRulesDir = Join-Path $GlobalConfigDir "rules"

# If neither -Global nor -Local specified, prompt user
if (-not $Global -and -not $Local -and -not $Destination) {
    Write-Host "Where would you like to install the JC SDLC Framework?" -ForegroundColor Yellow
    Write-Host "  1) Current Project (.agents/ directory)" -ForegroundColor White
    Write-Host "  2) Global Antigravity Config (~/.gemini/config/)" -ForegroundColor White
    Write-Host "  3) Both (Local + Global)" -ForegroundColor White
    Write-Host ""
    $choice = Read-Host "Select option [1-3] (Default: 1)"
    if ($choice -eq "2") {
        $Global = $true
    } elseif ($choice -eq "3") {
        $Local = $true
        $Global = $true
    } else {
        $Local = $true
    }
}

function Install-ToPath {
    param(
        [string]$TargetSkills,
        [string]$TargetRules,
        [string]$TargetAgentsMd = "",
        [string]$TargetTemplates = "",
        [string]$Label = ""
    )

    Write-Host "--> Installing to $Label..." -ForegroundColor Cyan

    # Ensure directories
    if (-not (Test-Path $TargetSkills)) {
        New-Item -ItemType Directory -Path $TargetSkills -Force | Out-Null
    }

    # Copy Skills
    Write-Host "    Copying 17 skills..." -ForegroundColor Gray
    Copy-Item -Path "$SkillsSrc\*" -Destination $TargetSkills -Recurse -Force
    Write-Host "    [OK] 17 Skills installed." -ForegroundColor Green

    # Copy Rules
    if ($TargetRules -and (Test-Path $RulesSrc)) {
        if (-not (Test-Path $TargetRules)) {
            New-Item -ItemType Directory -Path $TargetRules -Force | Out-Null
        }
        Copy-Item -Path "$RulesSrc\*" -Destination $TargetRules -Recurse -Force
        Write-Host "    [OK] SDLC rules installed." -ForegroundColor Green
    }

    # Copy AGENTS.md
    if ($TargetAgentsMd -and (Test-Path $AgentsMdSrc)) {
        if (-not (Test-Path $TargetAgentsMd) -or $Force) {
            Copy-Item -Path $AgentsMdSrc -Destination $TargetAgentsMd -Force
            Write-Host "    [OK] AGENTS.md created." -ForegroundColor Green
        }
    }

    # Copy Templates
    if ($TargetTemplates -and (Test-Path "$TemplatesSrc\Project-specification")) {
        if (-not (Test-Path $TargetTemplates)) {
            New-Item -ItemType Directory -Path $TargetTemplates -Force | Out-Null
        }
        Copy-Item -Path "$TemplatesSrc\Project-specification\*" -Destination $TargetTemplates -Recurse -Force
        Write-Host "    [OK] Project starter templates initialized." -ForegroundColor Green
    }
}

if ($Global) {
    Install-ToPath -TargetSkills $GlobalSkillsDir -TargetRules $GlobalRulesDir -Label "Global Config ($GlobalConfigDir)"
}

if ($Local -or $Destination) {
    $baseDir = if ($Destination) { $Destination } else { Get-Location }
    $localSkills = Join-Path $baseDir ".agents\skills"
    $localRules = Join-Path $baseDir ".agents\rules"
    $localAgentsMd = Join-Path $baseDir "AGENTS.md"
    $localTemplates = Join-Path $baseDir "Project-specification"

    Install-ToPath -TargetSkills $localSkills -TargetRules $localRules -TargetAgentsMd $localAgentsMd -TargetTemplates $localTemplates -Label "Local Project ($baseDir)"
}

Write-Host ""
Write-Host "SUCCESS: JC SDLC Framework installed successfully!" -ForegroundColor Green
Write-Host ""
