import { createSlice } from '@reduxjs/toolkit'
let timerId = null
const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    addNotification: (state, action) => {
      return action.payload
    },
    removeNofication: () => {
      return ''
    },
  },
})

export const setNoficacion = (payload, time) => {
  return async (dispatch) => {
    if (timerId) {
      clearInterval(timerId)
    }
    dispatch(addNotification(payload))
    timerId = setTimeout(() => {
      dispatch(removeNofication())
      timerId = null
    }, time * 1000)
  }
}

export const { addNotification, removeNofication } = notificationSlice.actions
export default notificationSlice.reducer
