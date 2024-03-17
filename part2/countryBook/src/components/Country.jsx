const Country = ({ name, onClick }) => {
  return (
    <div>
      <p>
        {name} <button onClick={onClick}>Show</button>
      </p>
    </div>
  );
};

export default Country;
