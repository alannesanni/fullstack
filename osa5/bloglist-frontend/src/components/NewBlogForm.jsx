import { useState } from 'react'

const NewBlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return(
    <form onSubmit={addBlog}>
      <div>
      title: <input
          id='newtitle'
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
      author: <input
          id='newauthor'
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
      url: <input
          id='newurl'
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>

      <button type="submit">create</button>
    </form>
  )}

export default NewBlogForm