import Nav from '../common/Nav'
import { useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

const DestinationIndex = () => {

  const [error, setError] = useState('')
  const [destinations, setDestinations] = useState([])
  const [filteredDestinations, setFilteredDestinations] = useState([])
  // const [pickerDate, setPickerDate] = useState(dayjs())
  const [date, setDate] = useState()
  const [temperature, setTemperature] = useState('cold')
  const [image, setImage] = useState(0)
  const [filters, setFilters] = useState({
    temperature: 'warm',
    month: '',
    country: 'All',
    continent: 'All',
    rating: 'All',
  })

  const location = useLocation()
  console.log(location.state)

  // ! On Mount
  useEffect(() => {
    // This function will get our bread data and save it to the bread state
    if (!location.state) {
      const getDestinations = async () => {
        try {
          const { data } = await axios.get('/api/')
          setDestinations(data)
          setFilteredDestinations(data)
        } catch (err) {
          console.log(err)
          setError(err.message)
        }
      }
      getDestinations()
      // setDatePicker()
    } else {
      console.log('has location.state')
      setDestinations(location.state.unfiltered)
      setFilteredDestinations(location.state.filtered)
      setTemperature(location.state.temperature)
    }
  }, [])

  const handleChange = (e) => {
    const newDate = new Date(e.$d)
    // console.log(newDate.getMonth())
    // const newFilters = { ...filters, [e.target.name]: e.target.value }
    // setFilters(newFilters)
    // console.log(filteredDestinations)
    console.log('TEMP->', e.target.value)
    if (e.target.name === 'temperature') {
      setImage(e.target.value)
    }
  }

  // function setDatePicker() {
  //   const currentDate = new Date()
  //   const todayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
  //   setPickerDate(dayjs(todayDate))
  // }

  useEffect(() => {
    console.log(filteredDestinations)
  }, [filteredDestinations])

  // useEffect(() => {
  //   const updatedDestinations = destinations.filter(destination => {
  //     return (destination.region === filters.region || filters.region === 'All') && (destination)
  //   }).sort((a, b) => a.name > b.name ? 1 : -1)
  //   setFilteredDestinations(updatedDestinations)
  // }, [filters, destinations])

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Nav />
        <main>
          <div id="grid-header">
            <h1>Select your destination...</h1>
          </div>
          <div id="grid-container">
            <div id="filters">
              <h2>Filters</h2>
              <div id="filter-temp">
                <div>
                  <label htmlFor="temperature">Temperature</label>
                  <input type="range" name="temperature" id="temperature" list="values" onChange={handleChange} min="0" max="3" defaultValue="3" step="1" />
                  <datalist id="values">
                    <option value="0" label="❄️"></option>
                    <option value="1" label="⛅️"></option>
                    <option value="2" label="☀️"></option>
                    <option value="3" label="🔥"></option>
                  </datalist>
                  <hr />
                </div>
              </div>Date
              <DatePicker inputFormat="DD/MM/YYYY" format="DD/MM/YYYY" name="month" onChange={handleChange} />
              <hr />
              <div id="country-selector">
                <label htmlFor="country">Country:</label>
                <select name="country" id="">
                  <option value="All">All</option>
                  {filteredDestinations.length > 0 &&
                    [...new Set(filteredDestinations.map(destination => destination.country))].sort().map(country => {
                      return <option key={country} value={country}>{country}</option>
                    })}
                </select>
              </div>
              <hr />
              <div id="continent-selector">
                <label htmlFor="continent">Continent:</label>
                <select name="continent" id="">
                  <option value="All">All</option>
                  {filteredDestinations.length > 0 &&
                    [...new Set(filteredDestinations.map(destination => destination.continent))].sort().map(continent => {
                      return <option key={continent} value={continent}>{continent}</option>
                    })}
                </select>
              </div>
              <hr />
              <div id="rating-selector">
                <label htmlFor="rating">Rating:</label>
                <select name="rating" id="">
                  <option value="">One</option>
                  <option value="">Two</option>
                  <option value="">Three</option>
                  <option value="">Four</option>
                </select>
              </div>
            </div>

            <div id="grid">
              {filteredDestinations.length > 0 ?
                filteredDestinations.map(destination => {
                  const currentMonth = new Date().getMonth()
                  const { _id, name, country, highTemps } = destination
                  const avgRating = destination.averageRating ? destination.averageRating : '-'
                  const background = destination.images.length === 0 ? 'https://maketimetoseetheworld.com/wp-content/uploads/2018/01/Off-the-beaten-path-places-in-2018-720x540.jpg' : destination.images[image]
                  return (
                    // <div key={_id} className="card" style={{ backgroundImage: `url(${background})` }} >
                    <div key={_id} className="card" >
                      <Link to={`/destinations/${_id}`}>
                        <div id="card-header">
                          <div id="destination-image"><img src={background} alt={name} /></div>
                          <div id="destination-name">{name} <br /> {country}</div>
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
                  {console.log('error')}
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