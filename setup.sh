#!/bin/bash

echo "🚀 Starting Project Setup..."

# 1. Check for Python 3.10
if ! command -v python3.10 &> /dev/null; then
    echo "❌ Python 3.10 is not installed or not in PATH."
    exit 1
fi

# 2. Create Virtual Environment
echo "📦 Creating Python virtual environment..."
python3.10 -m venv venv
source venv/bin/activate

# 3. Install Python Dependencies
echo "⬇️ Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# 4. Install Frontend Dependencies
echo "🎨 Installing Frontend dependencies..."
cd frontend
npm install

# 5. Fix Permissions
cd ..
chmod +x start.sh

echo "✅ Setup Complete! You can now run './start.sh' to launch the app."