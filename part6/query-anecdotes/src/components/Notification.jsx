import NotificationContext from '../context/notificationContext'
import { useContext } from 'react'

const Notification = () => {
  const [notification] = useContext(NotificationContext)
  console.log(notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }
  if (!notification) return null

  return <div style={style}>{notification}</div>
}

export default Notification
