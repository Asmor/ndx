#!/usr/bin/env bash
# pipe stdin through this script; if it exceeds N lines, send to less, otherwise print directly.

MAX_LINES=50

# Capture stdin, count lines
tmp=$(mktemp)
cat > "$tmp"

line_count=$(wc -l < "$tmp")

if [ "$line_count" -gt "$MAX_LINES" ]; then
  # Use less with color support
  less -R "$tmp"
else
  # Output directly with preserved color codes
  cat "$tmp"
fi

rm -f "$tmp"
