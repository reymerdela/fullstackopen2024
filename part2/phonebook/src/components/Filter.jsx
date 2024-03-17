const Filter = ({ handleChange }) => {
  return (
    <div>
      filter shown with{' '}
      <input type="text" onChange={(e) => handleChange(e.target.value)} />
    </div>
  );
};

export default Filter;
