import { useState } from "react";
import {
  TextField,
  Button,
} from '@mui/material'


const NewBlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });
    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        <TextField label ="title"
          id="newtitle"
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        <TextField label="author"
          id="newauthor"
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        <TextField label="url"
          id="newurl"
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>

      <Button variant="contained" color="success" type="submit">
            create
      </Button>
    </form>
  );
};

export default NewBlogForm;
