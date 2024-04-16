import { render } from '@testing-library/react'
import BlogForm from './createForm'
import { expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('<BlogForm>', () => {
  test('onSubmit should call with the right data', async () => {
    const blog = {
      title: 'Titulo de prueba',
      author: 'john doe',
      url: 'www.test.com',
    }

    const mockFn = vi.fn()
    const user = userEvent.setup()
    const form = render(<BlogForm addBlog={mockFn} />).container
    const titleField = form.querySelector('#title')
    const authorField = form.querySelector('#author')
    const urlField = form.querySelector('#url')
    const submitButton = form.querySelector('button[type=submit]')
    await user.type(titleField, blog.title)
    await user.type(authorField, blog.author)
    await user.type(urlField, blog.url)
    await user.click(submitButton)
    expect(mockFn.mock.calls).toHaveLength(1)
    expect(mockFn.mock.calls[0][0]).toEqual(blog)
  })
})
