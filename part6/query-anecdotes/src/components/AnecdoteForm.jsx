import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addNewAnecdote } from '../services/anecdotes'
import { useContext } from 'react'
import NotificationContext from '../context/notificationContext'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const [notification, dispatch] = useContext(NotificationContext)

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    mutation.mutate(content)
  }

  const mutation = useMutation({
    mutationFn: (data) => addNewAnecdote(data),
    onSuccess: (result) => {
      queryClient.setQueryData(['anecdotes'], (old) => [...old, result.data])
      setNotification(
        dispatch,
        `a new anecdote '${result.data.content}' created`
      )
    },
    onError: (error) => {
      setNotification(dispatch, error.response.data.error)
    },
  })

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
