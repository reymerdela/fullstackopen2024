const Notification = ({ status: { message = null, success = true } }) => {
  if (!message) {
    return null;
  }

  const baseStyle = {
    backgroundColor: 'silver',
    border: '1px solid',
    padding: '10px',
    borderRadius: '12px',
    marginBottom: '15px',
    fontSize: '22px',
    fontWeight: 'bold',
  };
  const style = success
    ? { color: 'green', borderColor: 'green' }
    : { color: 'red', borderColor: 'red' };

  return <p style={{ ...baseStyle, ...style }}>{message}</p>;
};

export default Notification;
