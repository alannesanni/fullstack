import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    find countries <input name="filterInput" value={filter} onChange={handleFilterChange} />
  </div>
)

const ShowCountries = ({ filteredCountries, showCountry, showCountryInfo, setShowCountry, setShowCountryInfo }) => {
  if (filteredCountries.length>10){
    return(
    <div>
    Too many matches, specify another filter
  </div>)
  }

  else if (filteredCountries.length===1){
    return (
      <ShowCountryInfo country={filteredCountries[0]} />
    )
  }

  else {
    const handleShowButtonClick = (country) => (
      setShowCountryInfo(true),
      setShowCountry(country)
    )
    if (showCountryInfo) {
      return (<ShowCountryInfo country={showCountry} />)
    }
    return (
    filteredCountries.map(country => (
      <div key={country}>
      {country}
      <button onClick={() => handleShowButtonClick(country)}>show</button>
      </div>
    ))
  )}
}

const ShowCountryInfo = ({ country }) => {
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
      .then(response => {
        setCountryData(response.data)
        console.log(response.data)
      })}, [country])
  if (!countryData) {
        return <p>Loading...</p>;
      }

  const commonName = countryData.name.common
  const capital = countryData.capital
  const area = countryData.area
  const languages = Object.keys(countryData.languages).map(key => countryData.languages[key]);
  const flag = countryData.flags.png

  return (
    <div>
      <h1>{commonName}</h1>
      <p>capital {capital}</p>
      <p>area {area}</p>
      languages: 
      <ul>
      {languages.map((language, index) => (
              <li key={index}>{language}</li>
            ))}
      </ul>
      <img src={flag} />
    </div>
  )
}

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const filteredCountries = countries.filter(country => country.toLowerCase().includes(filter))
  const [showCountryInfo, setShowCountryInfo] = useState(false)
  const [showCountry, setShowCountry] = useState('')

  useEffect(() => {

    console.log('fetching countries...')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        const countriesData = response.data.map(country => country.name.common);
        setCountries(countriesData)
        console.log('done')
      })}, [])

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
    setShowCountryInfo(false)
  }

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <ShowCountries filteredCountries={filteredCountries} showCountry={showCountry} showCountryInfo={showCountryInfo} setShowCountry={setShowCountry} setShowCountryInfo={setShowCountryInfo}/>
  </div>)
  }
export default App
