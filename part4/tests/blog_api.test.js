const app = require('../app');
const supertest = require('supertest');
const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const { initialBlogs } = require('./blog_api_helper');
const Blog = require('../models/blog');
const User = require('../models/user');
const api = supertest(app);

describe.only('Blogs controller', () => {
  let user,login,token;
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    const newUser = {
      username: 'testUser',
      password: 'testPassword',
      name: 'nameTest'
    }
    try {
      user = await api.post('/api/users').send(newUser).expect(201) 
      const blogs = initialBlogs.map((blog) => new Blog({ ...blog, user: user.body.id}));
      const promises = blogs.map((blogs) => blogs.save());
      await Promise.all(promises);
    } catch (error) {
      console.log('Error', error.message);
    }
    login = await api.post('/api/login').send({username: newUser.username, password: newUser.password}).expect(200)
    token = login.body.token
    
  });

  test('should return the correct amount of blogs ', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test('unique identifier is named id ', async () => {
    const response = await api.get('/api/blogs');
    assert(response.body[0].id);
  });

  test('post create a new blog post', async () => {
    const initialDb = await api.get('/api/blogs');
    
    const newBlog = {
      title: 'Test new note',
      author: 'Me',
      url: 'test.com',
      likes: 17,
      user: user.body.id
    };
      await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201);

    const actualDb = await api.get('/api/blogs');
    assert.strictEqual(actualDb.body.length, initialDb.body.length + 1);
  });

  test('likes property has default value of 0', async () => {
    const newBlog = {
      title: 'Test new note',
      author: 'Me',
      url: 'test.com',
      user: user.body.id
    };
    const result = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201);
    assert.strictEqual(result.body.likes, 0);
  });

  test('title and url should be present', async () => {
    const initialDB = await api.get('/api/blogs');
    const newBlog = {
      author: 'Me',
      likes: 2,
      user: user.body.id
    };
    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400);
    const actualDb = await api.get('/api/blogs');
    assert.strictEqual(actualDb.body.length, initialDB.body.length);
  });

  test('delete should delete a correct blog', async () => {
    const blogs = await api.get('/api/blogs');
    const deletedId = blogs.body[blogs.body.length - 1].id;
    console.log('DeletedId:', deletedId);

    await api.delete(`/api/blogs/${deletedId}`).set('Authorization', `Bearer ${token}`).expect(204);
    const actualDb = await api.get('/api/blogs');

    assert.strictEqual(actualDb.body.length, blogs.body.length - 1);
  });

  test('You can update the note', async () => {
    const blogs = await api.get('/api/blogs');
    const toBeEdited = blogs.body[0].id;

    const newBlog = {
      title: 'Edited recently',
      author: 'test',
      url: 'www.testing.com',
      likes: 15,
    };

    const result = await api
      .put(`/api/blogs/${toBeEdited}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(toBeEdited, result.body.id);
    const verifiedBlog = await Blog.findById(toBeEdited);
    assert.strictEqual(verifiedBlog.title, newBlog.title);
  });
});

describe('User controller', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('Can create a valid user', async () => {
    const initialDb = await api.get('/api/users');
    const newUser = {
      name: 'reymer',
      username: 'reymerdc',
      password: 'thisisapassword',
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const actualDb = await api.get('/api/users');
    assert.strictEqual(actualDb.body.length, initialDb.body.length + 1);
  });

  test('invalid user are not created', async () => {
    const newUser = {
      name: 'reymer',
      username: 'reymerD',
      password: '26',
    };
    await api.post('/api/users').send(newUser).expect(400);
  });
});

after(async () => {
  await mongoose.connection.close();
});
