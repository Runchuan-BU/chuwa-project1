# Chuwa Project 1

A Node.js web application built with Express.js

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Development Mode
```bash
npm run dev
```
This will start the server with nodemon for automatic restarting on file changes.

#### Production Mode
```bash
npm start
```

The server will start on port 3000 by default, or on the port specified in the PORT environment variable.

### API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check endpoint

### Project Structure

```
chuwa_project1/
├── index.js          # Main application file
├── package.json      # Project dependencies and scripts
├── .gitignore        # Git ignore rules
├── README.md         # Project documentation
├── routes/           # API routes (to be created)
├── middleware/       # Custom middleware (to be created)
├── controllers/      # Route controllers (to be created)
├── models/           # Data models (to be created)
├── config/           # Configuration files (to be created)
├── utils/            # Utility functions (to be created)
└── public/           # Static files (to be created)
```

### Environment Variables

Create a `.env` file in the root directory to configure environment variables:

```
PORT=3000
NODE_ENV=development
```

### License

ISC 