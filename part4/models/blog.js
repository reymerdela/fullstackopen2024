const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
  comments: {
    type: [String],
    minlength: 3,
    
  },
});

blogSchema.set('toJSON', {
  transform: (object, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
