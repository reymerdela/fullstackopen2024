import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAll, voteAnecdote } from './services/anecdotes'
import { setNotification } from './reducers/notificationReducer'
import { useContext } from 'react'
import NotificationContext from './context/notificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const [notification, dispatch] = useContext(NotificationContext)

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    retry: 1,
  })
  const votesMutate = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: (result) => {
      queryClient.setQueryData(['anecdotes'], (old) =>
        old.map((an) => (an.id !== result.id ? an : result))
      )
      setNotification(dispatch, `you voted '${result.content}'`)
    },
  })
  const handleVote = (anecdote) => {
    votesMutate.mutate(anecdote)
  }

  if (result.isPending || result.isError) {
    return <p>anecdote service not available due to problems in server</p>
  }
  console.log(result)
  const anecdotes = result.data
  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes?.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
