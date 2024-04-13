import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = () => {
  return axios.get(baseUrl).then((result) => result.data)
}

const addNewAnecdote = (content) => {
  const newAnecdote = {
    content,
    votes: 0,
  }
  return axios.post(baseUrl, newAnecdote)
}
const voteAnecdote = (content) => {
  const newNote = {
    ...content,
    votes: content.votes + 1,
  }
  return axios.put(`${baseUrl}/${content.id}`, newNote).then((res) => res.data)
}

export { getAll, addNewAnecdote, voteAnecdote }
