# E-commerce Application

A modern full-stack e-commerce application built with React, Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker Desktop (for MongoDB)

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Start MongoDB
```bash
docker run -d --name ecommerce-mongo -p 27017:27017 mongo:latest
```

### 3. Start Development Servers
```bash
npm run dev
```

This will start:
<<<<<<< Updated upstream
- **Backend API**: http://localhost:5001
=======
- **Backend API**: http://localhost:3001
>>>>>>> Stashed changes
- **Frontend**: http://localhost:3000
- **MongoDB**: localhost:27017

## 📱 Demo Accounts

The system automatically creates sample users:

- **Admin**: `admin@example.com` / `password123`
- **User**: `user@example.com` / `password123`

## 🛠️ Tech Stack

- **Frontend**: React, Redux Toolkit, Tailwind CSS
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Authentication**: JWT

## 📋 Features

- User authentication (signup/signin)
- Product management (admin only)
- Shopping cart with persistence
- Product search and pagination
- Responsive design
- Role-based access control

## 🧹 Cleanup

Stop and remove MongoDB container:
```bash
docker stop ecommerce-mongo
docker rm ecommerce-mongo
```

## 📚 API Documentation

Visit http://localhost:5001/api for API documentation and health check. 