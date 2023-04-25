import Nav from '../common/Nav'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Dialog from '../common/Dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEarthAmericas, faWallet, faCoins, faCommentDots, faMapLocationDot, faPersonHiking, faMountainSun, faUtensils } from '@fortawesome/free-solid-svg-icons'
import mapboxgl, { accessToken } from 'mapbox-gl'
import RegisterDialog from '../common/RegisterDialog'
import { getToken, getUserID } from '../../helpers/auth'

const DestinationIndex = () => {
  const { id } = useParams()
  const location = useLocation()
  const modalRef = useRef(null)
  const navigate = useNavigate()
  const registerRef = useRef(null)
  const [error, setError] = useState('')
  const [destination, setDestination] = useState(null)
  const [reviews, setReviews] = useState([])
  const [sliderValue, setSliderValue] = useState(4)
  const [editSliderValue, setEditSliderValue] = useState(4)
  const [weatherData, setWeatherData] = useState([])
  const [currentImage, setCurrentImage] = useState(0)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [previousDisabled, setPreviousDisabled] = useState(true)
  const [reviewStatus, setReviewStatus] = useState(false)
  const [inputStatus, setInputStatus] = useState(true)

  
  // State for the Login Form Fields
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
  
  const [reviewFields, setReviewFields] = useState({
    title: '',
    text: '',
    rating: 4,
  })
  
  const [editReviewFields, setEditReviewFields] = useState({
    title: '',
    text: '',
    rating: 4,
    id: '',
  })
  
  
  // ! On Mount
  useEffect(() => {
    const getDestination = async () => {
      try {
        const { data } = await axios.get(`/api/destinations/${id}`)
        setDestination(data)
      } catch (err) {
        setError(err.message)
      }
    }
    getDestination()
  }, [id, reviews])
  
  // ! Get Map
  useEffect(() => {
    const getMap = async () => {
      if (!destination) return
      try {
        mapboxgl.accessToken = process.env.REACT_APP_API_KEY
        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v12',
          // center: [-74.5, 40],
          center: [destination.longitude, destination.latitude],
          zoom: 10,
        })
      } catch (err) {
        setError(err.message)
      }
    }
    getMap()
  }, [destination])

  // ! Login Modal
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
      // Save the token to local storage for latecfr use
      localStorage.setItem('WANDERLUST-TOKEN', data.token)
      closeModal()
      navigate(location) // need this to trigger the 'logout' button to show
    } catch (err) {
      setError(err.response.data.message)
    }
  }

  // ! Registration Modal
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

  // ! On Mount get the weather data
  useEffect(() => {
    const getWeather = async () => {
      if (!destination) return
      try {
        const { data } = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${destination.latitude}&longitude=${destination.latitude}&timezone=auto&forecast_days=7&daily=temperature_2m_max`)
        setWeatherData(data.daily.temperature_2m_max)
      } catch (err) {
        setError(err.message)
      }
    }
    getWeather()
  }, [destination])

  // ! Review Functionality
  const handleReview = (e) => {
    setReviewFields({ ...reviewFields, [e.target.name]: e.target.value })
    if (e.target.name === 'rating') setSliderValue(e.target.value)
    setError('')
  }

  const addReview = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`/api/destinations/${id}`, reviewFields,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
      const updatedReviews = [...reviews, reviewFields]
      setEditReviewFields(reviewFields)
      setInputStatus(true)
      setReviews(updatedReviews)
    } catch (err) {
      setError(err.response.data.message)
    }
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
    if (temp <= 10) {
      return '❄️'
    } else if (temp > 10 && temp <= 20) {
      return '⛅️'
    } else if (temp > 20 && temp <= 30) {
      return '☀️'
    } else {
      return '🔥'
    }
  }

  const handleImageChange = (value) => {
    setCurrentImage(currentImage + parseInt(value))
  }

  const getValueField = (value) => {
    if (value === 3) {
      return 'Good Value'
    } else if (value === 2) {
      return 'Mid-range'
    } else {
      return 'Luxury'
    }
  }

  useEffect(() => {
    destination && currentImage >= destination.images.length - 1 ? setNextDisabled(true) : setNextDisabled(false)
    destination && currentImage === 0 ? setPreviousDisabled(true) : setPreviousDisabled(false)
  }, [destination, currentImage])

  // Review Button Logic
  useEffect(() => {
    if (!destination) return
    const disableAddBtn = () => {
      const userReview = destination.reviews.find(review => review.owner.id === getUserID())
      !userReview ?
        setReviewStatus(false)
        :
        setReviewStatus(true) &
        setEditReviewFields({
          title: userReview.title,
          text: userReview.text,
          rating: userReview.rating,
          id: userReview._id,
        })
    }
    disableAddBtn()
  }, [destination])

  // Edit Review
  const handleEditReview = (e) => {
    setEditReviewFields({ ...editReviewFields, [e.target.name]: e.target.value })
    if (e.target.name === 'rating') setEditSliderValue(e.target.value)
    setError('')
  }

  const editReview = (e) => {
    e.preventDefault()
    inputStatus ?
      setInputStatus(!inputStatus)
      :
      submitEdit()
  }

  const submitEdit = async () => {
    try {
      await axios.put(`/api/destinations/${id}`, editReviewFields,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
      const updatedReviews = [...reviews, editReviewFields]
      setEditReviewFields(editReviewFields)
      setInputStatus(true)
      setReviews(updatedReviews)
    } catch (err) {
      setError(err.response.data.message)
    }
  }

  useEffect(() => {
    setEditSliderValue(editReviewFields.rating)
  }, [editReviewFields])


  return (
    <>
      <Nav openModal={openModal} openRegisterModal={openRegisterModal} />
      <main>
        <Dialog modalRef={modalRef} closeModal={closeModal} handleLogin={handleLogin} handleSubmit={handleSubmit} formFields={formFields} />
        <RegisterDialog registerRef={registerRef} closeRegisterModal={closeRegisterModal} handleChangeRegister={handleChangeRegister} submitRegistration={submitRegistration} registerFormFields={registerFormFields} />
        {destination &&
          <>
            <section id="hero" style={{ backgroundImage: `url("${destination.images[currentImage]}")` }}>
              <h1>{destination.name}</h1>
              <p>{destination.description}</p>
              <div id="destination-prev-next-controls">
                <button id="destination-btn-previous" className="prev-next" value='-1' onClick={(e) => handleImageChange(e.target.value)} disabled={previousDisabled}>&#60;</button>
                <button id="destination-btn-next" className="prev-next" value='1' onClick={(e) => handleImageChange(e.target.value)} disabled={nextDisabled}>&#62;</button>
              </div>
            </section>
            <section id="common">
              <div id="common-container">
                <div className="info">
                  <h3>Country</h3>
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
                <div className="info">
                  <div>
                    <h3>Value</h3>
                    <div className="icon-container">
                      <div className="icon"><FontAwesomeIcon icon={faCoins} /></div><div>{getValueField(destination.valueForMoney)}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="forecast-container">
                {weatherData &&
                  weatherData.map((weatherDay, i) => {
                    return (
                      <div key={i}>
                        <div>{getDate(i)}</div>
                        <div className="weather-emoji">{getWeatherEmoji(weatherDay)}</div>
                        <div id="weather-data">{weatherData[i]}</div>
                      </div>
                    )
                  })
                }
              </div>
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
              <div id="map"></div>
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
              {!reviewStatus ?
                <div id="add-review-container">
                  <h3 className="first-info">Add a review...</h3>
                  <form onSubmit={addReview}>
                    <label htmlFor="title" name="title">Summary:</label>
                    <input type="text" id="title" name="title" onChange={handleReview} placeholder={`Summary of ${destination.name} (max 100 chars)`} />
                    <label htmlFor="review">Review:</label>
                    {/* <input type="textarea" id="review-textarea" name="text" onChange={handleReview} placeholder={`Post your review of ${destination.name}`} /> */}
                    <textarea id="review-textarea" name="text" onChange={handleReview} placeholder={`Post your review of ${destination.name}`} />
                    <label htmlFor="rating" name="rating">Rating: {sliderValue}</label>
                    <input type="range" name="rating" id="slider" min="1" max="5" step="1" defaultValue="4" onChange={handleReview} />
                    <button className="site-button" type="submit" id="add-review" >Add</button>
                  </form>
                </div>
                :
                <div id="add-review-container">
                  <h3 className="first-info">Your review:</h3>
                  <form>
                    <label htmlFor="title" name="title">Summary:</label>
                    <input type="text" id="title" name="title" onChange={handleEditReview} value={editReviewFields.title} disabled={inputStatus} />
                    <label htmlFor="review">Review:</label>
                    <textarea id="review-textarea" name="text" onChange={handleEditReview} value={editReviewFields.text} disabled={inputStatus} />
                    <label htmlFor="rating" name="rating">Rating: {editSliderValue}</label>
                    <input type="range" name="rating" id="slider" min="1" max="5" step="1" value={editReviewFields.rating} onChange={handleEditReview} disabled={inputStatus} />
                    <button className="site-button" type="submit" id="edit-review" onClick={editReview}>{inputStatus ? 'Edit Review' : 'Submit Edit'}</button>
                  </form>
                </div>
              }
            </section>
          </>
        }
      </main>
    </>
  )

}

export default DestinationIndex