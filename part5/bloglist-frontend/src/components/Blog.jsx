import { useState } from 'react'
import PropTypes from 'prop-types'

function Blog({ blog, handleLike, handleDelete, user }) {
  const [isVisible, setIsVisible] = useState(false)
  const label = isVisible ? 'hide' : 'view'
  const style = {
    border: '1px solid black',
    margin: '10px 0px',
    padding: '5px',
  }
  return (
    <div style={style} className="Blog">
      <p>
        {blog.title + ' '}
        {blog.author + ' '}
        <button id="showBtn" onClick={() => setIsVisible(!isVisible)}>
          {label}
        </button>
      </p>
      {isVisible && (
        <>
          <p>
            url:
            {blog.url}
          </p>
          <p>
            likes: {blog.likes}{' '}
            <button id="likeBtn" onClick={() => handleLike(blog)}>
              like
            </button>
          </p>
          <p>
            author:
            {blog.author}
          </p>
          {user.user === blog.user.username && (
            <button
              onClick={() => {
                const deleteBlog = confirm(
                  `Remove blog:  ${blog.title} by ${blog.author}`
                )
                if (deleteBlog) {
                  handleDelete(blog.id)
                }
              }}
            >
              delete
            </button>
          )}
        </>
      )}
    </div>
  )
}
Blog.propTypes = {
  handleLike: PropTypes.func,
  blog: PropTypes.object.isRequired,
  handleDelete: PropTypes.func,
  user: PropTypes.object.isRequired,
}
export default Blog
