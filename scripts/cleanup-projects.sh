#!/bin/bash

# Cleanup Script for AI Cube Initiate
# This script helps separate unrelated projects and clean up the repository

echo "🧹 AI Cube Initiate - Project Cleanup Script"
echo "=============================================="

# Create a backup directory
BACKUP_DIR="../ai-cube-backup-$(date +%Y%m%d-%H%M%S)"
echo "📦 Creating backup directory: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Move unrelated projects to backup
echo "📁 Moving unrelated projects to backup..."

if [ -d "QuDAG" ]; then
    echo "  - Moving QuDAG project..."
    mv QuDAG "$BACKUP_DIR/"
fi

if [ -d "claude-code-flow" ]; then
    echo "  - Moving claude-code-flow project..."
    mv claude-code-flow "$BACKUP_DIR/"
fi

# Clean up orchestration files
echo "🗑️  Cleaning up orchestration files..."
files_to_move=(
    "claude-flow"
    ".claude-flow.pid"
    "claude-flow.log"
    "code-review-orchestration.ts"
    "review-aggregator.ts" 
    "coordination.md"
    "execute-code-review.sh"
    "memory-bank.md"
    "monitor-audit-completion.sh"
    "orchestrate-to-completion.sh"
    "swarm-production-readiness.sh"
    "⚠️  No namespaces found-results.json"
)

for file in "${files_to_move[@]}"; do
    if [ -e "$file" ]; then
        echo "  - Moving $file to backup..."
        mv "$file" "$BACKUP_DIR/"
    fi
done

# Clean up memory folder if it exists
if [ -d "memory" ]; then
    echo "  - Moving memory folder to backup..."
    mv memory "$BACKUP_DIR/"
fi

echo "✅ Cleanup completed!"
echo ""
echo "📂 Moved files are available in: $BACKUP_DIR"
echo "🚀 Your AI Cube Initiate project is now cleaner and ready for launch!"
echo ""
echo "Next steps:"
echo "1. Review the backup directory to ensure nothing important was moved"
echo "2. Run 'npm run build' to test the build"
echo "3. Run 'npm run test' to ensure tests still work"
echo "4. Commit your changes to git"