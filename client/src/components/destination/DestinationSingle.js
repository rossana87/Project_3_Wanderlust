import Nav from '../common/Nav'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Dialog from '../common/Dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEarthAmericas, faWallet, faCoins, faCommentDots, faMapLocationDot, faPersonHiking, faMountainSun, faUtensils } from '@fortawesome/free-solid-svg-icons'
import mapboxgl from 'mapbox-gl'
import RegisterDialog from '../common/RegisterDialog'

const DestinationIndex = () => {

  const location = useLocation()
  const modalRef = useRef(null)
  const navigate = useNavigate()
  const registerRef = useRef(null)

  const [error, setError] = useState('')
  const [destination, setDestination] = useState(null)
  const [sliderValue, setSliderValue] = useState(4)
  const [weatherData, setWeatherData] = useState([])

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

  const { id } = useParams()

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
      console.log('error', err)
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
      navigate('/') // needs this to trigger the 'register' button to show
    } catch (err) {
      console.log('error', err)
      setError(err.response.data.message)
    }
  }

  // ! On Mount
  useEffect(() => {
    const getDestination = async () => {
      try {
        const { data } = await axios.get(`/api/destinations/${id}`)
        setDestination(data)
        // console.log(data, destination.longitude, destination.latitude)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getDestination()
  }, [id])

  useEffect(() => {
    const getMap = async () => {
      if (!destination) return
      try {
        mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNndWxsYW5kIiwiYSI6ImNsZnM1dTBsbzAzNGczcW1ocThldWt5bDkifQ.W8F3EzE7Ap170SOD3_VRDg'
        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v12',
          // center: [-74.5, 40],
          center: [destination.longitude, destination.latitude],
          zoom: 10,
        })
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getMap()
  }, [destination])

  // ! On Mount get the weather data
  useEffect(() => {
    // This function will get our bread data and save it to the bread state
    const getWeather = async () => {
      if (!destination) return
      try {
        const { data } = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${destination.latitude}&longitude=${destination.latitude}&timezone=auto&forecast_days=7&daily=temperature_2m_max`)
        setWeatherData(data.daily.temperature_2m_max)
        console.log('This is the weather data', data.daily.temperature_2m_max, destination.longitude, destination.latitude)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getWeather()
  }, [destination])

  const handleSliderChange = (e) => {
    setSliderValue(e.target.value)
  }

  const getDate = (i) => {
    const today = new Date()
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + i)
    
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dayOfWeek = daysOfWeek[targetDate.getDay()]
    const date = targetDate.getDate()
    
    return `${dayOfWeek} ${date}`
  }

  const getWeatherEmoji = (temp) => {
    if (temp < 10) {
      return '❄️' 
    } else if (temp > 10 && temp < 20) {
      return '⛅️'
    } else if (temp > 20 && temp < 30) {
      return '☀️' 
    } else {
      return '🔥'
    }
  }

  return (
    <>
      <Nav openModal={openModal} openRegisterModal={openRegisterModal} />
      <main>
        <Dialog modalRef={modalRef} closeModal={closeModal} handleLogin={handleLogin} handleSubmit={handleSubmit} formFields={formFields} />
        <RegisterDialog registerRef={registerRef} closeRegisterModal={closeRegisterModal} handleChangeRegister={handleChangeRegister} submitRegistration={submitRegistration} registerFormFields={registerFormFields} />
        {destination &&
          <>
            <section id="hero" style={{ backgroundImage: `url("${destination.images.length === 0 ? 'https://maketimetoseetheworld.com/wp-content/uploads/2018/01/Off-the-beaten-path-places-in-2018-720x540.jpg' : destination.images[0]}")` }}>
              <h1>{destination.name}</h1>
              <p>{destination.description}</p>
            </section>
            <section id="common">
              <div id="common-container">
                <div className="info">
                  <h3 className="first-info">Country</h3>
                  <div className="icon-container">
                    <div className="icon"><FontAwesomeIcon icon={faEarthAmericas} /></div><div>{destination.country}, {destination.continent}</div>
                  </div>
                </div>
                <div className="info">
                  <div>
                    <h3>Currency</h3>
                    <div className="icon-container">
                      <div className="icon"><FontAwesomeIcon icon={faWallet} /></div><div>{destination.currency}</div>
                    </div>
                  </div>
                </div>
                <div className="info">
                  <div>
                    <h3>Price</h3>
                    <div className="icon-container">
                      <div className="icon"><FontAwesomeIcon icon={faCoins} /></div><div>{destination.price} $$$</div>
                    </div>
                  </div>
                </div>
                {destination.averageRating &&
                  <div className="info">
                    <div>
                      <h3>Average Rating</h3>
                      <div className="icon-container">
                        <div className="icon"><FontAwesomeIcon icon={faCommentDots} /></div><div>{destination.averageRating}</div>
                      </div>
                    </div>
                  </div>
                }
              </div>
              {/* <div id="forecast-container">Forecast data goes here</div> */}
              <div id="map"></div>
            </section>
            <section id="attractions">
              <div id="attraction-container">
                <h3 className="first-info">Attractions</h3>
                <div className="icon-container first-info">
                  <div className="icon sightseeing"><FontAwesomeIcon icon={faMapLocationDot} /></div><div className="attraction">{destination.features[0]}</div>
                </div>
                <div className="icon-container">
                  <div className="icon activities"><FontAwesomeIcon icon={faPersonHiking} /></div><div className="attraction">{destination.features[1]}</div>
                </div>
                <div className="icon-container">
                  <div className="icon restaurants"><FontAwesomeIcon icon={faUtensils} /></div><div className="attraction">{destination.features[2]}</div>
                </div>
              </div>
              <div id="forecast-container">
                {weatherData &&
                  // 
                  // console.log(dailyDate[0])
                  weatherData.map((weatherDay, i) => {
                    return (
                      <div key={i}>
                        <div className="weather-emoji">{getWeatherEmoji(weatherDay)}</div>
                        <div>{weatherData[i]}</div>
                        <div>{getDate(i)}</div>
                      </div>
                    )
                  })
                }
              </div>
            </section>
            <section id="reviews">
              <div id="destination-reviews-container">
                {destination.reviews.length > 0 ?
                  destination.reviews.map((review, i) => {
                    const date = new Date(review.createdAt)
                    const shortDate = date.toLocaleDateString()
                    return (
                      <div className="individual-review" key={i}>
                        <h3 className="first-info">{review.title}</h3>
                        <p className="reviewText">{review.text}</p>
                        <div><span className="reviewOwner">{review.owner.username}</span><span className="rating">{'⭐️'.repeat(review.rating)}</span><span className="created-date">{shortDate}</span></div>
                        {/* <p className="created-date">{shortDate}</p> */}
                        <hr />
                      </div>
                    )
                  })
                  :
                  'Not yet reviewed'
                }
              </div>
              <div id="add-review-container">
                <h3 className="first-info">Add a review...</h3>
                <form>
                  <label htmlFor="title">Summary:</label>
                  <input type="text" id="title" name="title" placeholder={`Summary of ${destination.name}`} />
                  <label htmlFor="review">Review:</label>
                  <input type="textarea" id="review-textarea" name="review" placeholder={`Post your review of ${destination.name}`}/>
                  <label htmlFor="rating">Rating: {sliderValue}</label>
                  <input type="range" name="slider" id="slider" min="1" max="5" step="1" defaultValue="4" onChange={handleSliderChange} />
                </form>
                <button className="site-button" id="add-review">Add</button>
              </div>
            </section>
          </>
        }
      </main>
    </>
  )

}

export default DestinationIndex