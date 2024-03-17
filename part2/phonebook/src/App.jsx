import { useEffect, useState } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personService from './services/person';
import Notification from './components/Notification';

function App() {
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [persons, setPersons] = useState([]);
  const [alertMsg, setAlertMsg] = useState({ message: null });

  useEffect(() => {
    personService.getAll().then((persons) => setPersons(persons));
  }, []);

  useEffect(() => {
    console.log('Efecto');
    setTimeout(() => {
      setAlertMsg({ message: null });
    }, 3000);
  }, [persons]);

  const addPerson = (e) => {
    e.preventDefault();
    if (newName < 1) {
      return alert('name too short!');
    }
    const personExist = persons.find((person) => person.name === newName);

    if (!personExist) {
      personService
        .addPerson({
          name: newName,
          number: newNumber,
          id: (persons.length + 1).toString(),
        })
        .then((returnedPerson) => {
          setAlertMsg({
            message: `Added ${returnedPerson.name}`,
            success: true,
          });
          setPersons([...persons, returnedPerson]);
        });
    } else {
      if (personExist.number !== newNumber) {
        const changeNumber = confirm(
          `${personExist.name} is already added to phonebook, replace the old number with a new one?`
        );
        changeNumber &&
          personService
            .updatePerson(personExist.id, {
              name: newName,
              id: personExist.id,
              number: newNumber,
            })
            .then((returnedPerson) => {
              setAlertMsg({
                message: `${returnedPerson.name} number has changed successfully!`,
              });
              setPersons(
                persons.map((person) =>
                  person.id !== returnedPerson.id ? person : returnedPerson
                )
              );
            });
      } else {
        alert(`${newName} is already added to phonebook`);
      }
    }

    setNewName('');
    setNewNumber('');
  };

  const deletePerson = (person) => {
    const hasToBeDeleted = confirm(`Delete ${person.name} ?`);
    if (hasToBeDeleted) {
      personService
        .deletePerson(person.id)
        .then((deletedPerson) => {
          setAlertMsg({
            message: `${deletedPerson.name} successfully deleted`,
            success: true,
          });
          setPersons(persons.filter((p) => p.id !== deletedPerson.id));
        })
        .catch(() => {
          setAlertMsg({
            message: `Information of ${person.name} has already been removed from server`,
            success: false,
          });

          setPersons(persons.filter((p) => p.id !== person.id));
        });
    }
  };

  const personsToShow = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification status={alertMsg} />
      <Filter handleChange={setFilter} />
      <h2>Add a new</h2>
      <PersonForm
        onSubmit={addPerson}
        handleName={setNewName}
        handleNumber={setNewNumber}
        name={newName}
        number={newNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  );
}

export default App;
