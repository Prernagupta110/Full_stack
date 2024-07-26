import React, { useState, useEffect } from 'react'
import personService from './models/person';

const Filter = ({ newFilterName, setNewFilterName }) => {
  const handleFilterNameChange =
      (event) => {
          console.log(event.target.value)
          setNewFilterName(event.target.value)
      }

  return (
      <form>
          <div> filter shown with <input value={newFilterName} onChange={handleFilterNameChange} /> </div>
      </form>)
}
const Notification = ({message, type}) => {
  if (message === null) {
    return null;
  }

  const notificationStyle = {
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  );
};
const PersonForm = ({ newName, newPhone, persons, notification, notificationType, setNewName, setNewPhone, setPersons, setNotification, setNotificationType }) => {

  const addPerson = (event) => {
          event.preventDefault()
          const existingPerson = persons.find((person) => person.name === newName);
          if (existingPerson) {
              const confirmed = window.confirm(`${newName} is already added to the phonebook. Do you want to update the phone number?`);

              if (!confirmed) {
                  return;
              }

              personService
                  .update(existingPerson.id, { ...existingPerson, number: newPhone })
                  .then((updatedPerson) => {
                      setPersons(persons.map((person) => (person.id !== existingPerson.id ? person : updatedPerson)));
                      setNewName('');
                      setNewPhone('');

                      setNotification(`Updated ${newName} successfully.`);
                      setNotificationType('success');
                      setTimeout(() => {
                          setNotification(null);
                          setNotificationType(null);
                      }, 3000)
                  })
                  .catch((error) => {
                      console.error(`Error updating person:${error.response.person.error}`);
                      setNotification(`${newName} has already been removed from server`);
                      setNotificationType('error');
                      setTimeout(() => {
                          setNotification(null);
                          setNotificationType(null);
                      }, 3000);
                  })
          } else {

              const personObject = {
                  name: newName,
                  number: newPhone,
              }

              personService.create(personObject).then(response => {
                  setPersons(persons.concat(response))
                  setNewName('')
                  setNewPhone('')

                  setNotification(`Added ${newName} successfully.`);
                  setNotificationType('success');
                  setTimeout(() => {
                      setNotification(null);
                      setNotificationType(null);
                  }, 3000)
              }).catch((error) => {
                  
                  setNotification(`Added ${newName} failed: ${error.response.person.error}`);
                  setNotificationType('error');
                  setTimeout(() => {
                      setNotification(null);
                      setNotificationType(null);
                  }, 3000)
              })
          }
      }

  const handleNameChange =
      (event) => {
          console.log(event.target.value)
          setNewName(event.target.value)
      }

  const handlePhoneChange = (event) => {
      console.log(event.target.value)
      setNewPhone(event.target.value)
  }

  return (
      <form onSubmit={addPerson}>
          <div> name: <input value={newName} onChange={handleNameChange} /> </div>
          <div> number: <input value={newPhone} onChange={handlePhoneChange} /></div>
          <div>
              <button type="submit">add</button>
          </div>
      </form>
  )
}
const Persons = ({ newFilterName, setPersons, persons, notification, notificationType, setNotification, setNotificationType }) => {
  React.useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response);
    });
  }, [setPersons]);

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete this person`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));

          setNotification('Person deleted successfully.');
          setNotificationType('success');
          setTimeout(() => {
            setNotification(null);
            setNotificationType(null);
          }, 3000);
        })
        .catch((error) => {
          setNotification('Delete person failed');
          setNotificationType('error');
          setTimeout(() => {
            setNotification(null);
            setNotificationType(null);
          }, 3000);
        });
    }
  };

  if (newFilterName === '') {
    const result = persons.map((person, i) => (
      <div key={i}>
        <p>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id)}>Delete</button>
        </p>
      </div>
    ));
    return result;
  }

  const result = persons
    .filter((person) => person.name.toLowerCase().includes(newFilterName.toLowerCase()))
    .map((person, i) => (
      <div key={i}>
        <p>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id)}>Delete</button>
        </p>
      </div>
    ));

  return result;
}
const App =
  () => {
    const [persons, setPersons] = useState([
      { name: 'Arto Hellas', number: '040-123456', id: 1 },
      { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
      { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
      { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
    ])
    const [newName, setNewName] = useState('')
    const [newPhone, setNewPhone] = useState('')
    const [newFilterName, setNewFilterName] = useState('')
    const [notification, setNotification] = useState(null);
    const [notificationType, setNotificationType] = useState(null);
    useEffect(() => {
      console.log('effect')
      personService.getAll().then(response => {
        console.log('promise fulfilled')
        setPersons(response)
      })
    }, [])
    return (
      <div>
        <h2>Phonebook</h2>
        <Notification message={notification} type={notificationType} />
        <Filter newFilterName={newFilterName} setNewFilterName={setNewFilterName} />

        <h3>Add a new</h3>
        <PersonForm
          newName={newName} newPhone={newPhone} persons={persons} notification={notification} notificationType={notificationType} setNewName={setNewName} setNewPhone={setNewPhone} setPersons={setPersons} setNotification={setNotification} setNotificationType={setNotificationType}
        />

        <h3>Numbers</h3>
        <Persons newFilterName={newFilterName} persons={persons} setPersons={setPersons} notification={notification} notificationType={notificationType} setNotification={setNotification} setNotificationType={setNotificationType} />
      </div>
    )


  }

export default App
