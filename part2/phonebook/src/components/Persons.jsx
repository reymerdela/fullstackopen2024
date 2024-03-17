const Person = ({ person, onDelete }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={() => onDelete(person)}>delete</button>
    </p>
  );
};

const Persons = ({ persons, onDelete }) => {
  return (
    <>
      {persons.map((person) => (
        <Person onDelete={onDelete} key={person.id} person={person} />
      ))}
    </>
  );
};
export default Persons;
