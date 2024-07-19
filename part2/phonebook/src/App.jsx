import React, { useState } from 'react';
import styles from './index.css';
import personService from './services/data';

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  const notificationClass =
    type === 'error' ? styles.error : styles.success;

  return (
    <div className={`${styles.notification} ${notificationClass}`}>
      {message}
    </div>
  );
};

const Filter = () => {
    const [filterName, setFilterName] = useState('');

    const handleFilterNameChange = (event) => {
        setFilterName(event.target.value);
    };

    return (
        <form>
            <div>
                Filter shown with 
                <input 
                    value={filterName} 
                    onChange={handleFilterNameChange} 
                />
            </div>
        </form>
    );
};

const PersonForm = ({ newName, newPhone, persons, notification, notificationType, setNewName, setNewPhone, setPersons, setNotification, setNotificationType }) => {

  const addPerson =
      (event) => {
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
                      console.error(`Error updating person:${error.response.data.error}`);
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
                  
                  setNotification(`Added ${newName} failed: ${error.response.data.error}`);
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

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete this person`)) {
      personService
        .delete_p(id)
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

  if (filterName === '') {
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
    .filter((person) => person.name.toLowerCase().includes(filterName))
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
export default App