// utils/list_helper.js
const User = require('../models/user')
const bcrypt = require('bcrypt')

const dummy = (blogs) => {
    return 1
  }
  
  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }
  
  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
  
    const favorite = blogs.reduce((max, blog) => 
      blog.likes > max.likes ? blog : max
    )
  
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    }
  }
  
  const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null
  
    const authorCounts = blogs.reduce((counts, blog) => {
      counts[blog.author] = (counts[blog.author] || 0) + 1
      return counts
    }, {})
  
    const topAuthor = Object.keys(authorCounts).reduce((a, b) => 
      authorCounts[a] > authorCounts[b] ? a : b
    )
  
    return {
      author: topAuthor,
      blogs: authorCounts[topAuthor]
    }
  }
  
  const mostLikes = (blogs) => {
    if (blogs.length === 0) return null
  
    const likesCount = blogs.reduce((counts, blog) => {
      counts[blog.author] = (counts[blog.author] || 0) + blog.likes
      return counts
    }, {})
  
    const topAuthor = Object.keys(likesCount).reduce((a, b) => 
      likesCount[a] > likesCount[b] ? a : b
    )
  
    return {
      author: topAuthor,
      likes: likesCount[topAuthor]
    }
  }
  const createUser = async () => {
    await User.deleteMany({})
  
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
  
    await user.save()
    return user
  }
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    createUser
  }