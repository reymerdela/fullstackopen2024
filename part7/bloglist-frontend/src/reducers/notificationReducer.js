import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: '',status: false },
  reducers: {
    setNotification: (state, action) => {
      console.log('Payload:',action.payload)
      return action.payload
    },
    removeNotification: (state) => {
      return { message: '',status: false }
    }
  }
})
let timer

export const newNotification = (notification,time = 5000) => {
  console.log('Notification:',notification, 'Time:',time)
  if(!(notification instanceof Object)){
    notification = {
      message: notification,
      status: false
    }
    console.log(notification)
  }
  return async dispatch => {
    if(timer) {
      clearTimeout(timer)
    }
    dispatch(setNotification(notification))
    timer = setTimeout(() => {
      dispatch(removeNotification())
    }, time)
  }
}

export const { setNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer