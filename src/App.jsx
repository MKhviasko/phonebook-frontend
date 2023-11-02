import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm.jsx'
import Persons from './components/Persons'
import { useEffect } from 'react'
import personService from './services/persons'
import RemovePersonForm from './components/RemovePersonForm'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('')
  const [removePersonName, setRemovePersonName] = useState('')
  const [notification, setNotification] = useState({
    message: null,
    style: null
  })

  useEffect(() => {
    personService.getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const handleInputChange = (event, setState) => {
    setState(event.target.value);
  }

  const findPersonByName = () => {
    return persons.find((person) => person.name === newName)
  }

  const showNotification = (message, style) => {
    setNotification({ message, style });
    setTimeout(() => {
      setNotification({ message: null, style: null });
    }, 5000);
  }

  const addNewPerson = (event) => {
    event.preventDefault()
    const foundPerson = findPersonByName()
    if (foundPerson == null) {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      personService.create(newPerson).then(response => {
        setPersons([...persons, response.data])
        setNewName('')
        setNewNumber('')
        showNotification(`${newName} added successfully!`, 'success');
      })
    } else if (foundPerson.number != newNumber && confirm(`${foundPerson.name} is already added to the phoneook, replace the old number with a new one?`)) {
      const updatePerson = {
        ...foundPerson,
        number: newNumber
      }
      personService.update(foundPerson.id, updatePerson)
        .then(response => {
          setPersons(persons.concat(response.data).filter(person => person != foundPerson))
          setNewName('')
          setNewNumber('')
          showNotification(`${newNumber} for ${foundPerson.name} updated successfully!`, 'success')
        }).catch(() => {
          showNotification(`Information of ${foundPerson.name} has already been removed from the server!`, 'error')
          setPersons(persons.filter(person => person.id != foundPerson.id))
        })
    } else if (foundPerson.number == newNumber) {
      return window.alert(`${newName} is already added to phonebook`)
    }
  }

  const removePersonHandler = (event) => {
    event.preventDefault()
    const personToRemove = persons.find(person => removePersonName.toLowerCase() === person.name.toLowerCase())
    if ((personToRemove != null) && confirm(`Delete ${personToRemove.name}?`)) {
      personService.remove(personToRemove.id)
        .then(() => {
          setPersons(persons.filter(person => person.id != personToRemove.id))
          setRemovePersonName('')
        })
    }
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={(event) => handleInputChange(event, setNewFilter)} />
      <Notification message={notification.message} style={notification.style} />
      <h3>add a new</h3>
      <PersonForm addNewPerson={addNewPerson} newName={newName} newNumber={newNumber} handleNameChange={(event) => handleInputChange(event, setNewName)} handleNumberChange={(event) => handleInputChange(event, setNewNumber)} />
      <h3>remove person</h3>
      <RemovePersonForm removePersonHandler={removePersonHandler} personName={removePersonName} handlePersonNameChange={(event) => handleInputChange(event, setRemovePersonName)} />
      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} />
    </div>
  )
}

export default App