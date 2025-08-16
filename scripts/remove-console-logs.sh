#!/bin/bash

# Remove Console Logs Script for V1 Production
echo "🧹 Starting console.log removal for V1 production..."

# Count total console statements first
INITIAL_COUNT=$(grep -r "console\.\(log\|error\|warn\|info\|debug\)" ./src --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | wc -l)

echo "Found $INITIAL_COUNT console statements to remove..."

# Remove console statements from all source files
find ./src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i '' '/console\.\(log\|error\|warn\|info\|debug\)/d' {} \;

# Count remaining (should be 0)
FINAL_COUNT=$(grep -r "console\.\(log\|error\|warn\|info\|debug\)" ./src --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | wc -l)

echo "✅ Console.log removal complete!"
echo "📊 Removed $INITIAL_COUNT console statements"
echo "📊 Remaining: $FINAL_COUNT"
