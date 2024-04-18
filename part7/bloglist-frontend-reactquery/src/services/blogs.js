import axios from 'axios'
const baseUrl = '/api/blogs'


const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const createBlog = async ({ data, token }) => {
  try {
    const response = await axios.post(baseUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response
  } catch (error) {
    return error
  }
}

const updateBlog = async ({ data, token, blogId:id }) => {

  try {
    const response = await axios.put(`${baseUrl}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error) {
    return error
  }
}

const deleteBlog = async ({ id, token }) => {
  console.log(id, token)
  try {
    const response = await axios.delete(`${baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error) {
    return error
  }
}

const addComment = async ({ id,comment }) => {
  await axios.post(`${baseUrl}/${id}/comments`,{ comment })
}
export default { getAll, createBlog, updateBlog, deleteBlog,addComment }
