import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import NewBlogForm from './NewBlogForm'

test('only blog name is shown', () => {
  const blog = {
    _id: 'abc123',
    user: 'abcdefg',
    likes: 5,
    author: 'Testi Testi',
    title: 'Testiblogi',
    url: 'www.testi.fi'
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Testiblogi')
  expect(element).toBeDefined()

  const element1 = screen.queryByText(5)
  expect(element1).toBeNull()

  const element2 = screen.queryByText('www.testi.fi')
  expect(element2).toBeNull()
})

test('all info is shown when view button is clicked', async () => {
  const blog = {
    _id: 'abc123',
    user: 'abcdefg',
    likes: 5,
    author: 'Testi Testi',
    title: 'Testiblogi',
    url: 'www.testi.fi'
  }

  render(
    <Blog blog={blog} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const element = screen.getByText('Testiblogi Testi Testi')
  expect(element).toBeDefined()

  const element1 = screen.getByText('likes 5')
  expect(element1).toBeDefined()

  const element2 = screen.queryByText('www.testi.fi')
  expect(element2).toBeDefined()
})

test('mock is called twice when like button is clicked twice', async () => {
  const blog = {
    _id: 'abc123',
    user: 'abcdefg',
    likes: 5,
    author: 'Testi Testi',
    title: 'Testiblogi',
    url: 'www.testi.fi'
  }

  const mockHandler = jest.fn()

  render(
    <Blog blog={blog} likeBlog={mockHandler}/>
  )

  const user = userEvent.setup()
  const buttonView = screen.getByText('view')
  await user.click(buttonView)

  const buttonLike = screen.getByText('like')
  await user.click(buttonLike)
  await user.click(buttonLike)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('mock is called with right info when creating a new blog', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  render(<NewBlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('create')

  await user.type(inputs[0], 'new title')
  await user.type(inputs[1], 'new author')
  await user.type(inputs[2], 'new url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('new title')
  expect(createBlog.mock.calls[0][0].author).toBe('new author')
  expect(createBlog.mock.calls[0][0].url).toBe('new url')
})