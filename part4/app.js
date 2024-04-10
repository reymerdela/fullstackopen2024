const express = require('express');
const config = require('./utils/config');
const cors = require('cors');
const blogRoute = require('./controllers/blogs');
const userRoute = require('./controllers/users');
const mongoose = require('mongoose');
const { errorMiddleware, getJwtToken } = require('./utils/middleware');
const loginRouter = require('./controllers/login');
const app = express();

mongoose.set('strictQuery', false);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to mongoDB');
  })
  .catch((error) => {
    console.log(error.message);
  });

app.use(cors());
app.use(express.json());
app.use(getJwtToken);

app.use('/api/blogs', blogRoute);
app.use('/api/users', userRoute);
app.use('/api/login', loginRouter);

app.use(errorMiddleware);

module.exports = app;
