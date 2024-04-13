import axios from 'axios'
const baseUrl = '/api/login'

const loginUser = async (credentials) => {
  const user = await axios.post(baseUrl, credentials)
  return user
}

export default { loginUser }
