const mongoose = require('mongoose');
require('dotenv').config();
const Question = require('./models/Question');

const sampleQuestions = [
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
        votes: 12
      },
      {
        content: "Another option is CSS Grid: display: grid; place-items: center; This is even simpler than flexbox for centering.",
        author: "GridMaster",
        votes: 8
      }
    ]
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
        votes: 18
      }
    ]
  },
  {
    title: "How to handle async/await in JavaScript?",
    content: "I'm trying to understand asynchronous programming in JavaScript. What are async/await and how do they compare to Promises? Can someone provide some practical examples?",
    author: "AsyncNewbie",
    tags: ["javascript", "async", "promises", "asynchronous"],
    votes: 19,
    views: 312,
    answers: []
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
        votes: 9
      }
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');
    
    // Insert sample questions
    await Question.insertMany(sampleQuestions);
    console.log('Sample questions inserted successfully');
    
    const count = await Question.countDocuments();
    console.log(`Total questions in database: ${count}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Uncomment to run: node seedData.js
// seedDatabase();

module.exports = { seedDatabase, sampleQuestions };
