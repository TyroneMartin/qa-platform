# Test Data Setup Guide

This guide will help you populate your MongoDB database with sample questions and answers for testing the DevQ&A Platform.

## Quick Setup (Recommended)

### Option 1: Using MongoDB Shell

1. **Connect to MongoDB:**
   ```bash
   # If using local MongoDB
   mongosh
   
   # If using MongoDB Atlas
   mongosh "your_connection_string"
   ```

2. **Switch to your database:**
   ```javascript
   use qa-platform
   ```

3. **Clear existing data (optional):**
   ```javascript
   db.questions.drop()
   ```

4. **Insert sample data:**
   ```javascript
   db.questions.insertMany([
     {
       title: "How to center a div in CSS?",
       content: "I'm struggling to center a div element both horizontally and vertically. I've tried different approaches but none seem to work consistently across all browsers. What's the best modern approach?",
       author: "WebDev_Beginner",
       tags: ["css", "html", "layout", "flexbox"],
       votes: 15,
       views: 234,
       answers: [
         {
           content: "Use Flexbox! Set the parent container to display: flex; justify-content: center; align-items: center; This works great in all modern browsers.",
           author: "CSS_Expert",
           votes: 12,
           createdAt: new Date()
         },
         {
           content: "Another option is CSS Grid: display: grid; place-items: center; This is even simpler than flexbox for centering.",
           author: "GridMaster",
           votes: 8,
           createdAt: new Date()
         }
       ],
       createdAt: new Date("2025-01-17T10:30:00Z"),
       updatedAt: new Date("2025-01-17T10:30:00Z")
     },
     {
       title: "What's the difference between let, const, and var in JavaScript?",
       content: "I keep hearing about different ways to declare variables in JavaScript. Can someone explain the differences between let, const, and var? When should I use each one?",
       author: "JS_Learner",
       tags: ["javascript", "variables", "es6", "scope"],
       votes: 23,
       views: 456,
       answers: [
         {
           content: "var has function scope and is hoisted. let and const have block scope. const can't be reassigned after declaration. Use const by default, let when you need to reassign, avoid var in modern code.",
           author: "JavaScript_Guru",
           votes: 18,
           createdAt: new Date()
         }
       ],
       createdAt: new Date("2025-01-16T14:20:00Z"),
       updatedAt: new Date("2025-01-16T14:20:00Z")
     },
     {
       title: "How to handle async/await in JavaScript?",
       content: "I'm trying to understand asynchronous programming in JavaScript. What are async/await and how do they compare to Promises? Can someone provide some practical examples?",
       author: "AsyncNewbie",
       tags: ["javascript", "async", "promises", "asynchronous"],
       votes: 19,
       views: 312,
       answers: [],
       createdAt: new Date("2025-01-15T09:45:00Z"),
       updatedAt: new Date("2025-01-15T09:45:00Z")
     },
     {
       title: "Best practices for Angular component architecture?",
       content: "I'm building a large Angular application and want to make sure I'm structuring my components correctly. What are the best practices for component architecture and communication?",
       author: "AngularDeveloper",
       tags: ["angular", "architecture", "components", "best-practices"],
       votes: 11,
       views: 189,
       answers: [
         {
           content: "Follow the single responsibility principle. Use smart/dumb component pattern. Smart components handle data and business logic, dumb components just display data. Use services for shared state.",
           author: "AngularExpert",
           votes: 9,
           createdAt: new Date()
         }
       ],
       createdAt: new Date("2025-01-14T16:00:00Z"),
       updatedAt: new Date("2025-01-14T16:00:00Z")
     },
     {
       title: "How do I install Angular CLI?",
       content: "I ran `npm install -g @angular/cli` but `ng` isn't recognized. What am I missing?",
       author: "tyronemartin",
       tags: ["angular", "cli", "installation"],
       votes: 5,
       views: 67,
       answers: [
         {
           content: "Try restarting your terminal after installation. Also make sure your PATH includes npm global packages. On Windows, you might need to run as administrator.",
           author: "AngularHelper",
           votes: 3,
           createdAt: new Date()
         }
       ],
       createdAt: new Date("2025-01-20T22:00:00Z"),
       updatedAt: new Date("2025-01-20T22:00:00Z")
     },
     {
       title: "Best practice for JWT storage in Angular?",
       content: "Should I keep my JWT in localStorage, sessionStorage, or an HttpOnly cookie?",
       author: "tyronemartin",
       tags: ["angular", "jwt", "security"],
       votes: 8,
       views: 123,
       answers: [
         {
           content: "HttpOnly cookies are the most secure option as they're not accessible via JavaScript, preventing XSS attacks. However, you'll need to handle CSRF protection properly.",
           author: "SecurityExpert",
           votes: 6,
           createdAt: new Date()
         }
       ],
       createdAt: new Date("2025-01-19T18:30:00Z"),
       updatedAt: new Date("2025-01-19T18:30:00Z")
     },
     {
       title: "MongoDB vs PostgreSQL for web applications?",
       content: "I'm starting a new web project and need to choose between MongoDB and PostgreSQL. What are the pros and cons of each? Which one would be better for a Q&A platform like this?",
       author: "DatabaseNewbie",
       tags: ["mongodb", "postgresql", "database", "comparison"],
       votes: 12,
       views: 234,
       answers: [],
       createdAt: new Date("2025-01-18T12:15:00Z"),
       updatedAt: new Date("2025-01-18T12:15:00Z")
     },
     {
       title: "React vs Angular vs Vue - Which to choose in 2025?",
       content: "I'm learning frontend development and confused about which framework to choose. What are the main differences between React, Angular, and Vue? Which one has better job prospects?",
       author: "FrontendNewbie",
       tags: ["react", "angular", "vue", "frontend", "comparison"],
       votes: 18,
       views: 387,
       answers: [
         {
           content: "All three are great choices. React has the largest job market, Angular is best for enterprise apps, Vue is easiest to learn. Choose based on your project needs and learning style.",
           author: "FrameworkExpert",
           votes: 12,
           createdAt: new Date()
         }
       ],
       createdAt: new Date("2025-01-13T11:30:00Z"),
       updatedAt: new Date("2025-01-13T11:30:00Z")
     }
   ])
   ```

5. **Verify the data:**
   ```javascript
   db.questions.find().count()  // Should return 8
   db.questions.findOne()       // Show one sample question
   ```

### Option 2: Using a Node.js Seed Script

1. **Create a seed script in your backend directory:**
   ```bash
   # In the backend folder
   touch seedData.js
   ```

2. **Add this content to seedData.js:**
   ```javascript
   require('dotenv').config();
   const mongoose = require('mongoose');
   const Question = require('./models/Question');

   const sampleQuestions = [
     // Copy the questions array from the MongoDB shell command above
   ];

   async function seedDatabase() {
     try {
       await mongoose.connect(process.env.MONGODB_URI);
       console.log('Connected to MongoDB');

       // Clear existing data
       await Question.deleteMany({});
       console.log('Cleared existing questions');

       // Insert sample data
       const insertedQuestions = await Question.insertMany(sampleQuestions);
       console.log(`Inserted ${insertedQuestions.length} questions`);

       console.log('Database seeded successfully!');
       process.exit(0);
     } catch (error) {
       console.error('Error seeding database:', error);
       process.exit(1);
     }
   }

   seedDatabase();
   ```

3. **Run the seed script:**
   ```bash
   node seedData.js
   ```

## Testing the Data

After inserting the test data, you can verify it's working by:

1. **Backend API Test:**
   ```bash
   # Get all questions
   curl http://localhost:3000/api/questions

   # Get a specific question
   curl http://localhost:3000/api/questions/[question_id]

   # Health check
   curl http://localhost:3000/api/health
   ```

2. **Frontend Test:**
   - Navigate to `http://localhost:4200`
   - You should see the sample questions listed
   - Click on any question to view details and answers
   - Try the search functionality with terms like "CSS", "JavaScript", or "Angular"

## Sample Data Overview

The test data includes:

- **8 Questions** covering various programming topics
- **7 Answers** distributed across different questions
- **Multiple Tags** for testing search and filtering
- **Vote counts** and **view counts** for testing sorting
- **Different authors** including "tyronemartin" for testing user-specific queries
- **Various creation dates** for testing date-based sorting

## Custom Test Data

To add your own test data:

1. Follow the same MongoDB insertMany format
2. Ensure required fields: `title`, `content`, `author`
3. Optional fields: `tags`, `votes`, `views`, `answers`
4. Use proper date formats: `new Date()` or `new Date("ISO-string")`

## Troubleshooting

**Common Issues:**

1. **Connection Error:**
   - Ensure MongoDB is running
   - Check your connection string in `.env`
   - Verify database name matches your backend configuration

2. **Schema Validation Error:**
   - Ensure all required fields are present
   - Check field types match the Question model
   - Verify content length meets minimum requirements

3. **Frontend Not Showing Data:**
   - Confirm backend server is running on port 3000
   - Check browser console for API errors
   - Verify CORS is properly configured

## Success!

Once your test data is loaded, you should be able to:
- Browse questions on the home page
- Search and filter questions
- View question details and answers
- Add new questions and answers
- Edit existing content
