import PropTypes from 'prop-types'
import { useContext } from 'react'
import NotificationContext from '../reducers/noticationContext'

const Notification = () => {
  const [{ message,status }] = useContext(NotificationContext)
  if (!message) {
    return null
  }

  let style = {
    color: 'white',
    fontSize: '24px',
    textAlign: 'center',
    display: 'block',
    padding: '10px 0',
    fontWeight: 'bold',
    margin: '10px 0',
  }

  style = status
    ? { ...style, backgroundColor: 'green' }
    : { ...style, backgroundColor: 'red' }


  return (
    <div style={style}>
      <p>{message}</p>
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  status: PropTypes.bool,
}

export default Notification
