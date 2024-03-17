const PersonForm = ({ onSubmit, handleName, handleNumber, name, number }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name:{' '}
        <input
          type="text"
          value={name}
          onChange={(e) => handleName(e.target.value)}
        />
      </div>
      <div>
        number:{' '}
        <input
          type="text"
          value={number}
          onChange={(e) => handleNumber(e.target.value)}
        />
      </div>
      <button type="submit">Add</button>
    </form>
  );
};

export default PersonForm;
