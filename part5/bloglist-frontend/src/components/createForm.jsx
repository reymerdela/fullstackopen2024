import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ addBlog }) => {
  const [data, setData] = useState({
    title: '',
    author: '',
    url: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const newBlog = {
      title: data.title,
      author: data.author,
      url: data.url,
    }
    addBlog(newBlog)
    setData({ title: '', author: '', url: '' })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">
          Title:
          <input
            id="title"
            type="text"
            value={data.title}
            onChange={({ target }) => setData({ ...data, title: target.value })}
          />
        </label>
      </div>
      <div>
        <label htmlFor="author">
          Author:
          <input
            id="author"
            type="text"
            value={data.author}
            onChange={({ target }) =>
              setData({ ...data, author: target.value })
            }
          />
        </label>
      </div>
      <div>
        <label htmlFor="url">
          Url:
          <input
            id="url"
            type="text"
            value={data.url}
            onChange={({ target }) => setData({ ...data, url: target.value })}
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
}

export default BlogForm
