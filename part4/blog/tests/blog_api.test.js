// tests/blog_api.test.js

const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const api = supertest(app)
const User = require('../models/user')
const jwt = require('jsonwebtoken')

let token = null

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await Blog.insertMany(initialBlogs)

  const user = await helper.createUser()
  const userForToken = {
    username: user.username,
    id: user._id,
  }
  token = jwt.sign(userForToken, process.env.SECRET)

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog({ ...blog, user: user._id }))
  await Blog.insertMany(blogObjects)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)
  assert(titles.includes('React patterns'))
})

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  assert(response.body[0].id)
  assert(!response.body[0]._id)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Async/Await Simplifies Making Asynchronous Calls',
    author: 'John Doe',
    url: 'http://example.com/async-await',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, initialBlogs.length + 1)
  assert(titles.includes('Async/Await Simplifies Making Asynchronous Calls'))
})

test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'Test blog without likes',
    author: 'Jane Doe',
    url: 'http://example.com/test',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'John Doe',
    url: 'http://example.com/no-title',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'Test blog without URL',
    author: 'Jane Doe',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})
test('a blog can be deleted', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
  
    const blogsAtEnd = await api.get('/api/blogs')
  
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)
  
    const titles = blogsAtEnd.body.map(r => r.title)
  
    assert(!titles.includes(blogToDelete.title))
  })
  
  test('a blog can be updated', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]
  
    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    }
  
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
  
    const blogsAtEnd = await api.get('/api/blogs')
    const updatedBlogInDb = blogsAtEnd.body.find(blog => blog.id === blogToUpdate.id)
  
    assert.strictEqual(updatedBlogInDb.likes, blogToUpdate.likes + 1)
  })
after(async () => {
  await mongoose.connection.close()
})
afterAll(() => {
  mongoose.connection.close()
})