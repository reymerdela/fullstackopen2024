import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  const newBlog = {
    title: 'Blog de prueba',
    likes: 10,
    url: 'www.prueba.com',
    author: 'reymer',
    user: {
      username: 'reymer',
    },
  }
  const user = {
    user: 'reymer',
  }

  test('render title and author by default', async () => {
    render(<Blog blog={newBlog} user={user} />).container
    const element = screen.getByText(`${newBlog.title} ${newBlog.author}`)
    const url = screen.queryByText(newBlog.url)
    const likes = screen.queryByText(newBlog.likes)
    expect(url).toBeNull
    expect(likes).toBeNull
    expect(element).toBeDefined()
  })

  test('url and likes are show on click', async () => {
    const container = render(<Blog blog={newBlog} user={user} />).container
    const userEv = userEvent.setup()
    const button = container.querySelector('#showBtn')
    await userEv.click(button)
    const likes = screen.getByText(newBlog.likes, { exact: false })
    const url = screen.getByText(newBlog.url, { exact: false })
    expect(likes).toBeDefined()
    expect(url).toBeDefined()
  })

  test('button like calls twice the handler', async () => {
    const mockHandler = vi.fn()
    const userEv = userEvent.setup()
    const container = render(
      <Blog handleLike={mockHandler} blog={newBlog} user={user} />
    ).container
    const showButton = container.querySelector('#showBtn')
    await userEv.click(showButton)

    const likeButton = container.querySelector('#likeBtn')
    await userEv.click(likeButton)
    await userEv.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
