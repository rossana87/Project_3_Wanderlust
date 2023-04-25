import Nav from '../common/Nav'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Dialog from '../common/Dialog'
import RegisterDialog from '../common/RegisterDialog'

const DestinationIndex = () => {
  const location = useLocation()
  const modalRef = useRef(null)
  const navigate = useNavigate()
  const registerRef = useRef(null)

  const [error, setError] = useState('')
  const [filteredContinents, setFilteredContinents] = useState([])
  const [destinations, setDestinations] = useState([])
  const [filteredDestinations, setFilteredDestinations] = useState([])
  const [filters, setFilters] = useState({
    temperature: location.state ? location.state.temperature : '2',
    month: new Date().getMonth(),
    country: 'All',
    continent: 'All',
    rating: 'All',
  })

  // State for the Form Fields
  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
  })

  const [registerFormFields, setRegisterFormFields] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    isAdmin: false,
  })

  function openModal() {
    modalRef.current.showModal()
  }

  function closeModal() {
    modalRef.current.close()
  }

  const handleLogin = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    setError('')
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/', formFields)
      // Save the token to local storage for later use
      localStorage.setItem('WANDERLUST-TOKEN', data.token)
      closeModal()
      navigate(location) // need this to trigger the 'logout' button to show
    } catch (err) {
      setError(err.response.data.message)
    }
  }

  function openRegisterModal() {
    registerRef.current.showModal()
  }

  function closeRegisterModal() {
    registerRef.current.close()
  }

  const handleChangeRegister = (e) => {
    setRegisterFormFields({ ...registerFormFields, [e.target.name]: e.target.value })
    setError('')
  }

  const submitRegistration = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/', registerFormFields)
      // Save the token to local storage for later use
      // localStorage.setItem('WANDERLUST-TOKEN', data.token)
      closeRegisterModal()
      navigate(location.pathname) // needs this to trigger the 'register' button to show
    } catch (err) {
      setError(err.response.data.message)
    }
  }

  // ! On Mount
  useEffect(() => {
    if (!location.state) {
      const getDestinations = async () => {
        try {
          const { data } = await axios.get('/api/')
          setDestinations(data)
          setFilteredDestinations(data)
          setFilters({ ...filters })
        } catch (err) {
          setError(err.message)
        }
      }
      getDestinations()
    } else {
      setDestinations(location.state.unfiltered)
      setFilteredDestinations(location.state.filtered)
      setFilters({ ...filters, temperature: location.state.temperature })
    }
  }, [])

  const handleChange = (e) => {
    let newFilters
    if (e.target.name === 'continent') {
      newFilters = { ...filters, [e.target.name]: e.target.value, newFilters, country: 'All' }
    } else {
      newFilters = { ...filters, [e.target.name]: e.target.value }
    }
    setFilters(newFilters)
  }

  const handleDateChange = (e) => {
    const newDate = new Date(e.$d)
    const newFilters = { ...filters, month: newDate.getMonth() }
    setFilters(newFilters)
  }

  useEffect(() => {
  }, [filters])

  useEffect(() => {
    const searchMonth = filters.month
    let minTemp
    let maxTemp
    if (filters.temperature === '0') {
      minTemp = Math.min(...destinations.map(destination => destination.highTemps[searchMonth]))
      maxTemp = 10
    } else if (filters.temperature === '1') {
      minTemp = 11
      maxTemp = 19
    } else if (filters.temperature === '2') {
      minTemp = 20
      maxTemp = 29
    } else {
      minTemp = 30
      maxTemp = Math.max(...destinations.map(destination => destination.highTemps[searchMonth]))
    }
    const continents = destinations.filter(destination => {
      return (minTemp <= destination.highTemps[searchMonth] && destination.highTemps[searchMonth] <= maxTemp)
    })
    setFilteredContinents(continents)
    const updatedDestinations = destinations.filter(destination => {
      return (destination.country === filters.country || filters.country === 'All') && (destination.continent === filters.continent || filters.continent === 'All')
        && minTemp <= destination.highTemps[searchMonth] && destination.highTemps[searchMonth] <= maxTemp
        && (destination.averageRating === filters.rating || filters.rating === 'All')
    }).sort((a, b) => a.name > b.name ? 1 : -1)
    setFilteredDestinations(updatedDestinations)
  }, [filters])

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Nav openModal={openModal} openRegisterModal={openRegisterModal} />
        <main>
          <Dialog modalRef={modalRef} closeModal={closeModal} handleLogin={handleLogin} handleSubmit={handleSubmit} formFields={formFields} />
          <RegisterDialog registerRef={registerRef} closeRegisterModal={closeRegisterModal} handleChangeRegister={handleChangeRegister} submitRegistration={submitRegistration} registerFormFields={registerFormFields} />
          <div id="grid-header">
            <h1>Select your destination...</h1>
          </div>
          <div id="grid-container">
            <div id="filters">
              <h2>Filters</h2>
              <div id="filter-temp">
                <div>
                  <label htmlFor="temperature">Temperature</label>
                  <input type="range" name="temperature" id="temperature" list="values" onChange={handleChange} min="0" max="3" defaultValue={location.state ? location.state.temperature : '2'} step="1" />
                  <datalist id="values">
                    <option value="cold" label="❄️"></option>
                    <option value="mild" label="⛅️"></option>
                    <option value="warm" label="☀️"></option>
                    <option value="hot" label="🔥"></option>
                  </datalist>
                  <hr />
                </div>
              </div>
              <div>Date</div>
              <div><DatePicker id="date-picker" inputFormat="DD/MM/YYYY" format="DD/MM/YYYY" name="month" onChange={handleDateChange} /></div>
              <hr />
              <div id="continent-selector">
                <label htmlFor="continent">Continent:</label>
                <select name="continent" id="continent" onChange={handleChange}>
                  <option value="All">All</option>
                  {destinations.length > 0 &&
                    [...new Set(filteredContinents.map(destination => destination.continent))].sort().map(continent => {
                      return <option key={continent} value={continent}>{continent}</option>
                    })}
                </select>
              </div>
              <hr />
              <div id="country-selector">
                <label htmlFor="country">Country:</label>
                <select name="country" id="country" onChange={handleChange}>
                  <option value="All">All</option>
                  {filteredDestinations.length > 0 &&
                    [...new Set(filteredContinents.filter(destination => destination.continent === filters.continent || filters.continent === 'All')
                      .map(destination => destination.country))].sort().map(country => <option key={country} value={country}>{country}</option>)}
                </select>
              </div>
              <hr />
              <div id="rating-selector">
                <label htmlFor="rating">Average rating:</label>
                <select name="rating" id="" onChange={handleChange}>
                  <option value="All">All</option>
                  <option value="1">⭐️</option>
                  <option value="2">⭐️⭐️</option>
                  <option value="3">⭐️⭐️⭐️</option>
                  <option value="4">⭐️⭐️⭐️⭐️</option>
                  <option value="5">⭐️⭐️⭐️⭐️⭐️</option>
                </select>
              </div>
            </div>

            <div id="grid">
              {filteredDestinations.length > 0 ?
                filteredDestinations.map(destination => {
                  const currentMonth = new Date().getMonth()
                  const { _id, name, country, highTemps } = destination
                  // const avgRating = destination.averageRating ? destination.averageRating : '-'
                  const avgRating = ('Not yet rated' === destination.averageRating) ? 'Not yet rated' : '⭐️'.repeat(destination.averageRating)
                  const background = destination.images.length === 0 ? 'https://maketimetoseetheworld.com/wp-content/uploads/2018/01/Off-the-beaten-path-places-in-2018-720x540.jpg' : destination.images[filters.temperature]
                  return (
                    // <div key={_id} className="card" style={{ backgroundImage: `url(${background})` }} >
                    <div key={_id} className="card" >
                      <Link to={`/destinations/${_id}`}>
                        <div id="card-header">
                          <div id="destination-image"><img src={background} alt={name} /></div>
                          <div id="destination-name">{name} <br /><div id="country-name">{country}</div></div>
                          {/* <div id="country-name">{country}</div> */}
                        </div>
                        <div id="card-content">
                          <div id="avg-weather">Average temp: {highTemps[currentMonth]}</div>
                          <div id="avg-review">Average rating: {avgRating}</div>
                        </div>
                      </Link>
                    </div>
                  )
                })
                :
                <>
                </>
              }
            </div>
          </div>
        </main>
      </LocalizationProvider>
    </>
  )

}

export default DestinationIndex