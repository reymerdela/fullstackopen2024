import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async () => {
  try {
    const result = await axios.get(baseUrl)
    return result.data
  } catch (error) {
    return error
  }
}


export default { getAll }