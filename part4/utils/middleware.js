const jwt = require('jsonwebtoken');
const User = require('../models/user');
const errorMiddleware = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: 'invalid data' });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: 'token mission or invalid' });
  } else if (error.name === 'MongoServerError') {
    return response.status(400).json({ error: 'username already exists' });
  }
  next(error);
};

const userExtractor = async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);
    request.user = user;
  } catch (error) {
    next(error);
  }
  next();
};

const getJwtToken = (request, response, next) => {
  const token = request.get('authorization');
  if (token && token.startsWith('Bearer ')) {
    request.token = token.replace('Bearer ', '');
  }

  next();
};

module.exports = { errorMiddleware, getJwtToken, userExtractor };
