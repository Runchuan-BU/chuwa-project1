#!/bin/bash

echo "🚀 启动 Node.js + React 全栈应用"
echo "=================================="

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装根目录依赖..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 安装后端依赖..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 安装前端依赖..."
    cd frontend && npm install && cd ..
fi

echo "🎯 同时启动前端和后端..."
echo "前端: http://localhost:3000"
echo "后端: http://localhost:3001"
echo "按 Ctrl+C 停止服务"

npm run dev 