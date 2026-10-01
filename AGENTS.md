# Antigravity Project Instructions: JC Multi-Agent SDLC Framework

This project is governed by the **JC Multi-Agent Autonomous SDLC Framework**.
All development follows an orchestrated 17-agent SDLC workflow with deterministic quality gates.

---

## 🏛️ Pipeline Orchestration

Always inspect `Project-specification/pipeline-state.yml` and `Project-specification/decisions.yml` before taking action:
- If setup is not completed -> Execute **Phase A** (Product Owner -> Project Structure -> Environment -> Scaffolding -> Early CI).
- If working on user stories -> Execute **Phase B** (Analyst -> Contracts -> Deep-Spec -> Backend/Frontend -> Cybersecurity -> QA -> SRE -> Analyst Sign-Off).
- If stories are completed -> Execute **Phase C** (Tech Writer Documentation -> Production DevOps Release).

## 🔒 Non-Negotiable Quality Gates
1. **Security**: 0 High/Critical vulnerabilities (SAST + Dependency audit + Secret detection).
2. **QA Testing**: $\ge$ 80% automated test coverage + WCAG 2.1 AA a11y compliance.
3. **Performance**: All endpoints must meet story p95 latency SLOs under load test.
4. **Sign-off**: Every completed story must be formally signed off by `jc.analyst` and archived in `Project-specification/Change-Log/`.
