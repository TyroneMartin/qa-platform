const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Answer content is required'],
    trim: true,
    minlength: [10, 'Answer must be at least 10 characters long']
  },
  author: {
    type: String,
    required: [true, 'Answer author is required'],
    trim: true
  },
  votes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true,
    minlength: [10, 'Title must be at least 10 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Question content is required'],
    trim: true,
    minlength: [20, 'Content must be at least 20 characters long']
  },
  author: {
    type: String,
    required: [true, 'Question author is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  votes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  answers: [answerSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better performance
questionSchema.index({ title: 'text', content: 'text', tags: 'text' });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ votes: -1 });
questionSchema.index({ views: -1 });

// Update the updatedAt field before saving
questionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for answer count
questionSchema.virtual('answerCount').get(function() {
  return this.answers.length;
});

// Ensure virtual fields are serialized
questionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Question', questionSchema);