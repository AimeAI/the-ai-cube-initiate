# 50-Agent Code Review System Guide

## Overview

This system coordinates 50 specialized AI agents to perform comprehensive code review across your entire codebase. Each agent has specific expertise and focuses on different aspects of code quality, security, performance, and best practices.

## Quick Start

```bash
# Run the complete code review
./execute-code-review.sh
```

## Agent Specializations

### 1. React/Frontend Specialists (10 agents)
- React Architecture Reviewer
- React Hooks Analyzer
- Component Performance Auditor
- State Management Expert
- React Testing Specialist
- Props & Types Validator
- UI Component Reviewer
- Form & Input Validator
- Router & Navigation Expert
- React Best Practices Enforcer

### 2. 3D Graphics/Game Specialists (5 agents)
- Three.js Performance Optimizer
- WebGL Compatibility Checker
- Game Physics Reviewer
- Animation Performance Auditor
- Game State Management Expert

### 3. Security Specialists (5 agents)
- Authentication Security Auditor
- API Security Reviewer
- Payment Security Specialist
- Data Validation Expert
- Environment & Secrets Auditor

### 4. Backend/Database Specialists (5 agents)
- Database Schema Reviewer
- API Design Expert
- Query Performance Optimizer
- Data Model Architect
- Backend Integration Reviewer

### 5. Testing Specialists (3 agents)
- Test Coverage Analyzer
- E2E Test Reviewer
- Mock & Stub Validator

### 6. Performance Specialists (3 agents)
- Bundle Size Optimizer
- Code Splitting Expert
- Memory Leak Detective

### 7. AI/ML System Specialists (5 agents)
- Agent Architecture Reviewer
- Memory System Auditor
- Task Coordination Expert
- MCP Protocol Validator
- AI Integration Reviewer

### 8. DevOps/Build Specialists (3 agents)
- Build Process Optimizer
- CI/CD Pipeline Reviewer
- Deployment Config Auditor

### 9. Accessibility Specialists (3 agents)
- ARIA Implementation Checker
- Keyboard Navigation Tester
- Color Contrast Validator

### 10. Code Quality Specialists (8 agents)
- TypeScript Strictness Enforcer
- ESLint Rule Validator
- Code Duplication Detector
- Naming Convention Auditor
- Import Organization Expert
- Comment & Documentation Reviewer
- Error Handling Specialist
- Code Complexity Analyzer

## Manual Operations

### Start the orchestration system
```bash
./claude-flow start --daemon
```

### Spawn individual agents
```bash
npx claude-flow agent spawn code-reviewer --name "Custom Reviewer" --specialization "custom"
```

### Monitor progress
```bash
npx claude-flow monitor
```

### Check system status
```bash
npx claude-flow status
```

### Query review results
```bash
npx claude-flow memory query review_results
```

### Generate report manually
```bash
deno run --allow-all review-aggregator.ts
```

## Understanding the Reports

### code-review-report.md
Human-readable markdown report containing:
- Overall code quality score (0-100)
- Issue summary by severity
- Top priority issues with code snippets
- Category breakdown
- File heatmap showing problematic files
- Actionable recommendations

### code-review-report.json
Machine-readable JSON containing:
- Detailed findings from all agents
- Metrics and statistics
- File-by-file analysis
- Integration-ready data

## Customization

### Add New Review Agents
Edit `code-review-orchestration.ts` and add new agents to the `reviewAgents` array:

```typescript
{
  id: 'custom-1',
  name: 'Custom Reviewer',
  specialization: 'custom-area',
  areas: ['src/custom/**/*.ts'],
  priority: 'high'
}
```

### Modify Review Criteria
Agents can be customized by modifying their focus areas and specializations in the orchestration configuration.

### Adjust Priorities
Set agent priorities to 'critical', 'high', 'medium', or 'low' to control review order.

## Best Practices

1. **Run regularly**: Schedule reviews before major releases
2. **Focus on critical issues**: Address security and performance issues first
3. **Track improvements**: Compare scores over time
4. **Customize for your needs**: Add agents for your specific tech stack
5. **Integrate with CI/CD**: Automate reviews in your pipeline

## Troubleshooting

### Agents not spawning
```bash
# Check orchestrator status
./claude-flow status

# Restart the system
./claude-flow stop
./claude-flow start --daemon
```

### Memory issues
```bash
# Clear memory bank
npx claude-flow memory clear

# Export current state
npx claude-flow memory export backup.json
```

### Review taking too long
- Reduce number of agents
- Focus on specific directories
- Increase system resources

## Performance Tips

1. **Parallel execution**: Agents work concurrently for faster reviews
2. **Priority queuing**: Critical issues are found first
3. **Incremental reviews**: Can focus on changed files only
4. **Resource management**: System auto-scales based on available resources

## Integration

### GitHub Actions
```yaml
- name: Run Code Review
  run: |
    npm install
    ./execute-code-review.sh
    cat code-review-report.md >> $GITHUB_STEP_SUMMARY
```

### Pre-commit Hook
```bash
#!/bin/sh
./execute-code-review.sh --quick --changed-files-only
```

### Slack Notifications
The system can be configured to send review summaries to Slack or other platforms.

## Support

For issues or improvements:
1. Check logs: `./claude-flow.log`
2. Debug mode: `./execute-code-review.sh --debug`
3. Report issues: Create an issue in your repository