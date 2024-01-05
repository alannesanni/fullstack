import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Person = (props) => 
    (<p>{props.name} {props.number}</p>)

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addPerson }) =>
  ( <form onSubmit={addPerson}>
    <div>
      name: <input name="nameInput" value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input name="numberInput" value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>)

const Persons = ({ filteredPersons, setPersons, persons, setErrorMessage, setErrorColor }) => (
  <div>
    {filteredPersons.map(person => (
      <div key={person.name}>
      <Person name={person.name} number={person.number} />
      <button onClick={() => {
        DeletePerson({person, setPersons, persons, setErrorMessage, setErrorColor})
        }}> delete</button>
      </div>
    ))}
  </div>
)
const DeletePerson = ({person, setPersons, persons, setErrorMessage, setErrorColor  }) => {
  if (window.confirm(`Delete ${person.name}`)) {
    personService.deletePerson(person.id).then(() => setPersons(persons.filter(p => p.id !== person.id)))
    setErrorMessage(`Deleted ${person.name}`)
    setErrorColor('green')
    setTimeout(() => {
      setErrorMessage(null)
      setErrorColor(null)
    }, 5000)
  }
}

const Filter = ({ filterText, handleFilterChange }) => (
  <div>
    filter shown with <input name="filterInput" value={filterText} onChange={handleFilterChange} />
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilter] = useState('')
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filterText))
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorColor, setErrorColor] = useState(null)

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.map(person => person.name).includes(newName)) {
    
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const i = persons.findIndex(person => person.name === newName)
        const updatedPerson = {
          id: persons[i].id,
          name: persons[i].name,
          number: newNumber
        }
        personService.update(persons[i].id, updatedPerson)
        .then(() => {
          setPersons((prevPersons) =>
          prevPersons.map((person) =>
            person.id === updatedPerson.id ? updatedPerson : person
          ))
        })
          .catch(error => {
            if (error.response.data.error) {
              setErrorMessage(error.response.data.error)
              setErrorColor('red')
              setTimeout(() => {
                setErrorMessage(null)
                setErrorColor(null)
              }, 5000)}
            else {
            setErrorMessage(`${newName} was already removed from server`
            )
            setErrorColor('red')
            setTimeout(() => {
              setErrorMessage(null)
              setErrorColor(null)
            }, 5000)}
          })
          setErrorMessage(`Changed ${newName}'s number`)
          setErrorColor('green')
          setTimeout(() => {
            setErrorMessage(null)
            setErrorColor(null)
          }, 5000)
          setNewName('')
          setNewNumber('')
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      personService
          .create(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setErrorMessage(`Added ${newName}`)
            setErrorColor('green')
            setTimeout(() => {
              setErrorMessage(null)
              setErrorColor(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            console.log(error.response.data)
            setErrorMessage(error.response.data.error)
            setErrorColor('red')
            setTimeout(() => {
              setErrorMessage(null)
              setErrorColor(null)
            }, 5000)
          })
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} color={errorColor}/>
      <Filter filterText={filterText} handleFilterChange={handleFilterChange} />
    
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} setPersons={setPersons} persons={persons} setErrorMessage={setErrorMessage} setErrorColor={setErrorColor}/>
    </div>
  )

}

const Notification = ({ message, color }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={color}>
      {message}
    </div>
  )
}

export default App