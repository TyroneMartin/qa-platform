const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// GET /api/questions - Get all questions with pagination and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = search ? {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    } : {};

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const questions = await Question.find(searchQuery)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .select('-answers'); // Exclude answers for list view

    const total = await Question.countDocuments(searchQuery);
    const totalPages = Math.ceil(total / limit);

    res.json({
      questions,
      pagination: {
        currentPage: page,
        totalPages,
        totalQuestions: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/questions/:id - Get single question with answers
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/questions - Create new question
router.post('/', async (req, res) => {
  try {
    const question = new Question({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      tags: req.body.tags || []
    });

    const savedQuestion = await question.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/questions/:id - Update question
router.put('/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/questions/:id - Delete question
router.delete('/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/questions/:id/answers - Add answer to question
router.post('/:id/answers', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const newAnswer = {
      content: req.body.content,
      author: req.body.author
    };

    question.answers.push(newAnswer);
    await question.save();

    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/questions/:questionId/answers/:answerId - Update answer
router.put('/:questionId/answers/:answerId', async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = question.answers.id(req.params.answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    answer.content = req.body.content;
    await question.save();

    res.json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/questions/:questionId/answers/:answerId - Delete answer
router.delete('/:questionId/answers/:answerId', async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.answers.pull({ _id: req.params.answerId });
    await question.save();

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;