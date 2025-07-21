const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Helper function for pagination
const getPaginationData = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage: page,
    totalPages,
    totalQuestions: total,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

// GET /api/questions - Get all questions with pagination and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 5, 10); // Max 10 per page
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
          { author: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute queries
    const [questions, total] = await Promise.all([
     Question.find(searchQuery)
         .sort(sortObj)
        .skip(skip)
        .limit(limit),
        // .select('-answers'), // Exclude answers for list view
      Question.countDocuments(searchQuery)
    ]);

    const pagination = getPaginationData(page, limit, total);

    res.json({
      questions,
      pagination,
      search: search || null,
      sortBy,
      sortOrder
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ 
      message: 'Failed to fetch questions',
      error: error.message 
    });
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
    console.error('Error fetching question:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid question ID' });
    }
    res.status(500).json({ 
      message: 'Failed to fetch question',
      error: error.message 
    });
  }
});

// POST /api/questions - Create new question
router.post('/', async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;

    // Validation
    if (!title || !content || !author) {
      return res.status(400).json({ 
        message: 'Title, content, and author are required' 
      });
    }

    const question = new Question({
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      tags: tags ? tags.map(tag => tag.trim().toLowerCase()).filter(tag => tag) : []
    });

    const savedQuestion = await question.save();
    
    console.log('Question created:', savedQuestion._id);
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ 
      message: 'Failed to create question',
      error: error.message 
    });
  }
});

// PUT /api/questions/:id - Update question
router.put('/:id', async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    const updateData = {
      updatedAt: Date.now()
    };
    
    if (title) updateData.title = title.trim();
    if (content) updateData.content = content.trim();
    if (tags) updateData.tags = tags.map(tag => tag.trim().toLowerCase()).filter(tag => tag);

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    console.log('Question updated:', question._id);
    res.json(question);
  } catch (error) {
    console.error('Error updating question:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid question ID' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ 
      message: 'Failed to update question',
      error: error.message 
    });
  }
});

// DELETE /api/questions/:id - Delete question
router.delete('/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    console.log('Question deleted:', req.params.id);
    res.json({ message: 'Question deleted successfully', questionId: req.params.id });
  } catch (error) {
    console.error('Error deleting question:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid question ID' });
    }
    res.status(500).json({ 
      message: 'Failed to delete question',
      error: error.message 
    });
  }
});

// POST /api/questions/:id/answers - Add answer to question
router.post('/:id/answers', async (req, res) => {
  try {
    const { content, author } = req.body;
    
    if (!content || !author) {
      return res.status(400).json({ 
        message: 'Answer content and author are required' 
      });
    }

    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const newAnswer = {
      content: content.trim(),
      author: author.trim()
    };

    question.answers.push(newAnswer);
    question.updatedAt = Date.now();
    await question.save();

    console.log('Answer added to question:', req.params.id);
    res.status(201).json(question);
  } catch (error) {
    console.error('Error adding answer:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid question ID' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ 
      message: 'Failed to add answer',
      error: error.message 
    });
  }
});

// PUT /api/questions/:questionId/answers/:answerId - Update answer
router.put('/:questionId/answers/:answerId', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Answer content is required' });
    }

    const question = await Question.findById(req.params.questionId);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = question.answers.id(req.params.answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    answer.content = content.trim();
    question.updatedAt = Date.now();
    await question.save();

    console.log('Answer updated:', req.params.answerId);
    res.json(question);
  } catch (error) {
    console.error('Error updating answer:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid question or answer ID' });
    }
    res.status(500).json({ 
      message: 'Failed to update answer',
      error: error.message 
    });
  }
});

// DELETE /api/questions/:questionId/answers/:answerId - Delete answer
router.delete('/:questionId/answers/:answerId', async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answerExists = question.answers.id(req.params.answerId);
    if (!answerExists) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    question.answers.pull({ _id: req.params.answerId });
    question.updatedAt = Date.now();
    await question.save();

    console.log('Answer deleted:', req.params.answerId);
    res.json(question);
  } catch (error) {
    console.error('Error deleting answer:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid question or answer ID' });
    }
    res.status(500).json({ 
      message: 'Failed to delete answer',
      error: error.message 
    });
  }
});

module.exports = router;