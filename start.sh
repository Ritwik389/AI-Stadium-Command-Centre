#!/bin/bash

# Function to kill processes on exit (Ctrl+C)
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Trap keyboard interrupt (Ctrl+C)
trap cleanup SIGINT

echo "🚀 Launching AI Stadium Command Centre..."

# 1. Activate Virtual Environment
source venv/bin/activate

# 2. Run Setup Zone (Blocking - script waits until you close the window)
echo "✏️  Opening Zone Setup... (Draw your zones and press 'Enter' to save, 'q' to quit)"
python3.10 setup_zone.py

echo "✅ Zones Saved. Starting System..."

# 3. Start Backend Server (in Background)
echo "🧠 Starting Python Backend (Port 8000)..."
python3.10 server.py &
BACKEND_PID=$! # Save Process ID to kill later

# Wait a moment for backend to initialize
sleep 3

# 4. Start Frontend (in Background)
echo "💻 Starting React Frontend (Port 3000)..."
cd frontend
npm run dev &
FRONTEND_PID=$! # Save Process ID

# Wait for frontend to spin up
sleep 5

# 5. Open Browser
echo "🌐 Opening Dashboard..."
open "http://localhost:3000"

# Keep script running to maintain background processes
echo "🟢 System is Live! Press Ctrl+C to stop."
wait