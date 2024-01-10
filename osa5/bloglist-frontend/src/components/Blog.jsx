import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, username }) => {
  const [moreInfo, setInfo] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const likeBlog = async () => {
    const newBlog = {
      _id: blog.id,
      user: blog.user,
      likes: blog.likes+1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    await blogService.like(blog.id, newBlog)
    await blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs( blogs )
    }
    )
  }

  const removeButton = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
      await blogService.getAll().then(blogs => {
        blogs.sort((a, b) => b.likes - a.likes)
        setBlogs( blogs )
      })
    }}

  if (moreInfo) {
    return (
      <div style={blogStyle}>
        <div>
          <p>{blog.title} {blog.author}
            <button onClick={() => setInfo(false)}>hide</button></p>
          <a href={blog.url}>{blog.url}</a>
          <p>likes {blog.likes} <button onClick={likeBlog}>like</button></p>
          <p>{blog.user.name}</p>
          {blog.user.name === username ? <button onClick={removeButton}>remove</button> : null}

        </div>
      </div>  )
  }
  else {
    return(
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setInfo(true)}>view</button>
        </div>
      </div>
    )}}

export default Blog
