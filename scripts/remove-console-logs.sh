#!/bin/bash

echo "🔍 Searching for console.log statements..."

# Count console.log occurrences first
TOTAL_COUNT=$(grep -r "console\.log" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/ app/ components/ lib/ hooks/ services/ utils/ 2>/dev/null | wc -l)

echo "Found $TOTAL_COUNT console.log statements"

# Create backup of files before modification
echo "📦 Creating backup..."
tar -czf console-logs-backup-$(date +%Y%m%d-%H%M%S).tar.gz src/ app/ components/ lib/ hooks/ services/ utils/ 2>/dev/null

# Remove console.log statements
echo "🧹 Removing console.log statements..."

# Find all TypeScript and JavaScript files and remove console.log statements
find src/ app/ components/ lib/ hooks/ services/ utils/ -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) 2>/dev/null | while read file; do
    # Check if file has console.log
    if grep -q "console\.log" "$file"; then
        # Remove simple console.log statements
        sed -i '' '/^\s*console\.log(/d' "$file"
        
        # Remove multi-line console.log statements (up to 5 lines)
        sed -i '' '/console\.log(/,/);/d' "$file"
        
        # Remove console.log statements that are part of expressions
        sed -i '' 's/console\.log([^)]*)[,;]*//g' "$file"
        
        echo "✓ Cleaned: $file"
    fi
done

# Count remaining console.log occurrences
REMAINING_COUNT=$(grep -r "console\.log" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/ app/ components/ lib/ hooks/ services/ utils/ 2>/dev/null | wc -l)

echo ""
echo "✅ Console.log removal complete!"
echo "📊 Results:"
echo "   - Initial count: $TOTAL_COUNT"
echo "   - Removed: $((TOTAL_COUNT - REMAINING_COUNT))"
echo "   - Remaining: $REMAINING_COUNT"
echo ""
echo "💾 Backup saved as console-logs-backup-*.tar.gz"
echo ""

if [ $REMAINING_COUNT -gt 0 ]; then
    echo "⚠️  Some console.log statements may require manual review:"
    grep -r "console\.log" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/ app/ components/ lib/ hooks/ services/ utils/ 2>/dev/null | head -10
fi