import { useState } from "react";
import blogService from "../services/blogs";
import {
  Button,
} from '@mui/material'

const Blog = ({ blog, likeBlog, removeBlog, username }) => {
  const [moreInfo, setInfo] = useState(false);

  if (moreInfo) {
    return (
      <div>
        <div className="blog">
          <p>
            {blog.title} {blog.author}
            <Button variant="contained" color="primary" onClick={() => setInfo(false)}>hide</Button>
          </p>
          <a href={blog.url}>{blog.url}</a>
          <p className={blog.title}>
            likes {blog.likes}{" "}
            <Button variant="contained" color="success" onClick={() => likeBlog(blog)}>like</Button>
          </p>
          <p>{blog.user.name}</p>
          {blog.user.name === username ? (
            <Button variant="contained" color="error" onClick={() => removeBlog(blog)}>remove</Button>
          ) : null}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div>
          {blog.title}
          <Button variant="contained" color="primary" onClick={() => setInfo(true)}>view</Button>
        </div>
      </div>
    );
  }
};

export default Blog;
