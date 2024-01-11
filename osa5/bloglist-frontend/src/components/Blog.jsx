import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, likeBlog, removeBlog, username }) => {
  const [moreInfo, setInfo] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (moreInfo) {
    return (
      <div style={blogStyle}>
        <div className='blog'>
          <p>{blog.title} {blog.author}
            <button onClick={() => setInfo(false)}>hide</button></p>
          <a href={blog.url}>{blog.url}</a>
          <p className={blog.title}>likes {blog.likes} <button onClick={() => likeBlog(blog)}>like</button></p>
          <p>{blog.user.name}</p>
          {blog.user.name === username ? <button onClick={() => removeBlog(blog)}>remove</button> : null}

        </div>
      </div>  )
  }
  else {
    return(
      <div style={blogStyle}>
        <div>
          {blog.title}
          <button onClick={() => setInfo(true)}>view</button>
        </div>
      </div>
    )}}

export default Blog
