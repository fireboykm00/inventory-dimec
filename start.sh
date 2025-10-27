#!/bin/bash

# 🚀 Quick Start Script - DIMEC Inventory System
# ================================================

echo "🧾 Starting DIMEC Inventory System..."
echo ""

# Check if run.sh exists
if [ ! -f "run.sh" ]; then
    echo "❌ Error: run.sh not found in current directory"
    exit 1
fi

# Make sure run.sh is executable
chmod +x run.sh

# Start the system
./run.sh start
