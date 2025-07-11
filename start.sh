#!/bin/bash

echo "🚀 Starting KeyWizard.com Platform..."

# Start backend server in background
echo "📡 Starting backend server on port 3000..."
node server/index.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend server in background
echo "🎨 Starting frontend server on port 5173..."
cd client && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ KeyWizard.com is running!"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3000/api/packages"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait 