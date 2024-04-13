import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

export const initializeAnecdotes = createAsyncThunk(
  'users/initializeAnecdotes',
  async () => {
    const anecdotes = await anecdoteService.getAnecdotes()
    return anecdotes
  }
)

export const addAnecdote = createAsyncThunk(
  'users/addAnecdote',
  async (content) => {
    const response = await anecdoteService.addAnecdote({ content, votes: 0 })
    console.log('Respuesta', response)
    return response
  }
)

export const voteAnecdote = createAsyncThunk(
  'users/voteAnecdote',
  async (anecdote) => {
    const response = await anecdoteService.voteAnecdote(anecdote)
    return response
  }
)

const anecdoteSlice = createSlice({
  initialState: [],
  name: 'anecdote',
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
  },
  extraReducers: (builer) => {
    builer.addCase(initializeAnecdotes.fulfilled, (state, action) => {
      return action.payload
    }),
      builer.addCase(addAnecdote.fulfilled, (state, action) => {
        state.push(action.payload)
      }),
      builer.addCase(voteAnecdote.fulfilled, (state, action) => {
        return state.map((a) =>
          a.id !== action.payload.id ? a : action.payload
        )
      })
  },
})

export const { appendAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
