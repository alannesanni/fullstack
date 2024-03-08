import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import NewBlogForm from './components/NewBlogForm'
import Togglable from './components/Togglable'
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  Button,
  Alert,
  AppBar,
  Toolbar,
} from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const newblogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleBlogsChange = () => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }

  const newBlogForm = () => (
    <Togglable buttonLabel="new blog" ref={newblogFormRef}>
      <NewBlogForm createBlog={addBlog} />
    </Togglable>
  )

  const addBlog = (blogObject) => {
    newblogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog))
      handleBlogsChange()
      setMessage(`New blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleLikeBlog = async (blog) => {
    const newBlog = {
      _id: blog.id,
      user: blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    await blogService.like(blog.id, newBlog)
    handleBlogsChange()
  }

  const handleRemoveButton = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
      handleBlogsChange()
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <TextField label="username"
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <TextField label="password"
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button variant="contained" color="primary" type="submit">
            login
      </Button>
    </form>
  )

  if (user === null) {
    return (
      <div>
        <Notification message={message} severity="success"/>
        <h2>Log in to application</h2>
        {loginForm()}
      </div>
    )
  }
  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit">
            home
          </Button>
          <Button color="inherit">
            blogs
          </Button>
          <Button color="inherit">
            users
          </Button>
        </Toolbar>
      </AppBar>
      <div>
        <Notification message={message} severity="success"/>
        <p>{user.name} logged in</p>
        <Button variant="contained" color="secondary" onClick={handleLogout}>logout</Button>

        {newBlogForm()}

        <h2>blogs</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <Blog
                      key={blog.id}
                      blog={blog}
                      likeBlog={handleLikeBlog}
                      removeBlog={handleRemoveButton}
                      username={user.name}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Container>
  )
}

const Notification = ({ message, severity }) => {
  if (message === null) {
    return null
  }

  return <div>
    {(message &&
    <Alert severity={severity}>
      {message}
    </Alert>
    )}
  </div>
}

export default App
