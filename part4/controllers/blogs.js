const blogRoute = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { userExtractor } = require('../utils/middleware');
blogRoute.get('/', async (request, response, next) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogRoute.post('/', userExtractor, async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }

    const user = request.user;
    const { title, url, likes, author } = request.body;
    const blog = new Blog({
      author,
      likes,
      title,
      url,
      user: user.id,
    });

    const savedNote = await blog.save();
    user.blogs = user.blogs.concat(savedNote._id);
    await user.save();
    response.status(201).json(savedNote);
  } catch (error) {
    return next(error);
  }
});

blogRoute.delete('/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params;
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    const blog = await Blog.findById(id);
    if (decodedToken.id.toString() !== blog.user.toString()) {
      return response.status(400).json({ error: 'permission dennied' });
    }
    const user = request.user;
    await blog.deleteOne();
    user.blogs = user.blogs.filter((blog) => blog.id !== id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogRoute.put('/:id', async (request, response, next) => {
  const id = request.params.id;
  const body = request.body;

  const updateBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  try {
    const result = await Blog.findByIdAndUpdate(id, updateBlog, { new: true });
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = blogRoute;
