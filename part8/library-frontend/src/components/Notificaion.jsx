const Notification = ({ message }) => {
  if (!message) {
    return null
  }
  const styles = {
    color: 'white',
    padding: '5px',
    fontSize: '24px',
    fontWeigth: 'bold',
    backgroundColor: 'green',
  }

  return (
    <div style={styles}>
      <p>{message}</p>
    </div>
  )
}

export default Notification
