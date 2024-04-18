import { Alert } from '@mui/material'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

const Notification = () => {
  const { message, status } = useSelector(state => state.notification)
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
    <div style={{ position: 'relative' }}>
      <Alert sx={{ position: 'absolute', right: 0, width: '20%' }} severity={status ? 'success' : 'error'}>{message}</Alert>
    </div>

  )
}

Notification.propTypes = {
  message: PropTypes.string,
  status: PropTypes.bool,
}

export default Notification
