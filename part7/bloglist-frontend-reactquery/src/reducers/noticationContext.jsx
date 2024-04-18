import { createContext, useContext, useReducer } from 'react'
import PropTypes from 'prop-types'

const notificationReducer = (state, action) => {
  switch (action.type) {
  case 'setNotification':
    return {
      message: action.payload.message,
      status: action.payload.status
    }
  case 'removeNotification':
    return {
      message: '',
      status: false
    }
  default:
    break
  }
}


const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification,notificationDispath] = useReducer(notificationReducer ,{ message: '',status: false, })

  return (
    <NotificationContext.Provider value={[notification,notificationDispath]}>
      {children}
    </NotificationContext.Provider>
  )
}

NotificationContextProvider.propTypes = {
  children: PropTypes.element
}
let timer

export const pushNotification = (dispath,message,status = false) => {
  dispath({ type: 'setNotification',payload: { message,status } })
  if(timer){
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    dispath({ type: 'removeNotification' })
  }, 5000)
}



export default NotificationContext