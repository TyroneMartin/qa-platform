# DevQ&A Platform

A full-stack Question & Answer platform built with Angular and Node.js/Express, similar to Stack Overflow. This project was created as a final project for WDD430 Full-Stack Development class.

## Project Structure

This project has a **custom setup** with separate frontend and backend servers:

```
qa-platform/
├── frontend/          # Angular application (port 4200)
├── backend/           # Node.js/Express API (port 3000)
└── README.md
```

## Development Setup

**Important:** This project requires starting BOTH backend and frontend servers separately.

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local installation or MongoDB Atlas)
- Angular CLI (`npm install -g @angular/cli`)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with your MongoDB connection
echo "MONGODB_URI=mongodb://localhost:27017/qa-platform" > .env

# Start the backend server
npm run dev
```

The backend server will run on `http://localhost:3000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the Angular development server
ng serve
```

The frontend application will run on `http://localhost:4200`

### 3. Verify Setup

- Backend API: `http://localhost:3000/api/health`
- Frontend App: `http://localhost:4200`
- API Endpoint: `http://localhost:3000/api/questions`

##  Test Data Setup

For testing purposes, you can populate the database with sample questions and answers.

👉 **[View Test Data Setup Instructions](./backend/TEST_DATA_SETUP.md)**

##  Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
```

### Frontend Scripts
```bash
ng serve            # Start development server
ng build            # Build for production
ng test             # Run unit tests
ng e2e              # Run end-to-end tests
```

## Features

- View questions with pagination and search
- Ask new questions with tags
- Answer questions
- Edit and delete questions/answers
- Vote on questions and answers
- Question view tracking
- Responsive design
- Real-time updates

## Technology Stack

**Frontend:**
- Angular 18
- TypeScript
- Tailwind CSS
- Angular Router
- RxJS

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled
- RESTful API

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions` | Get all questions with pagination |
| GET | `/api/questions/:id` | Get single question with answers |
| POST | `/api/questions` | Create new question |
| PUT | `/api/questions/:id` | Update question |
| DELETE | `/api/questions/:id` | Delete question |
| POST | `/api/questions/:id/answers` | Add answer to question |
| PUT | `/api/questions/:questionId/answers/:answerId` | Update answer |
| DELETE | `/api/questions/:questionId/answers/:answerId` | Delete answer |
| GET | `/api/health` | Health check endpoint |

##  Production Deployment

### Backend Deployment

1. **Environment Variables:**
   ```bash
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   PORT=3000
   ```

2. **Build and Start:**
   ```bash
   npm install --production
   npm start
   ```

### Frontend Deployment

1. **Build for Production:**
   ```bash
   ng build --configuration=production
   ```

2. **Deploy dist/ folder** to your hosting provider (Netlify, Vercel, AWS S3, etc.)

3. **Update API Base URL** in your environment files to point to your production backend

### Deployment Platforms

**Backend Options:**
- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Google Cloud Run

**Frontend Options:**
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting

**Database Options:**
- MongoDB Atlas (recommended)
- AWS DocumentDB
- Azure Cosmos DB

## Contributing

This project was created for educational purposes as part of WDD430 Full-Stack Development course.

---

**Note:** Make sure both servers are running during development. The frontend (Angular) serves on port 4200 and communicates with the backend API on port 3000.