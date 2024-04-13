import NotificationContext from '../context/notificationContext'
import { useReducer } from 'react'
const notificationReducer = (state, action) => {
  console.log('State:', state, 'Action:', action)
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'REMOVE_NOTIFICATION':
      return null
    default:
      return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}
let idTimer = null

export const setNotification = (dispatch, message) => {
  if (idTimer) {
    clearInterval(idTimer)
  }
  dispatch({
    type: 'SET_NOTIFICATION',
    payload: message,
  })
  idTimer = setTimeout(() => {
    dispatch({ type: 'REMOVE_NOTIFICATION' })
  }, 5000)
}

export default NotificationContextProvider
