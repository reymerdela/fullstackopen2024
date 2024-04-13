import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAnecdotes = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}
const addAnecdote = async (anecdote) => {
  const response = await axios.post(baseUrl, anecdote)
  return response.data
}
const voteAnecdote = async (content) => {
  const newContent = {
    ...content,
    votes: content.votes + 1,
  }
  console.log('Contenido:', content)
  const response = await axios.put(`${baseUrl}/${content.id}`, newContent)
  console.log(response)
  return response.data
}

export default {
  getAnecdotes,
  addAnecdote,
  voteAnecdote,
}
