import { useState, useRef, useEffect } from 'react'
import React from 'react'
import Nav from './common/Nav'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import RegisterDialog from './common/RegisterDialog'

const Home = () => {

  // ! State
  // State for the Modal to either show or not show
  const modalRef = useRef(null)
  const registerRef = useRef(null)

  // State for the Form Fields
  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
  })

  // State for Register
  const [registerFormFields, setRegisterFormFields] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    isAdmin: false,
  })

  const [error, setError] = useState('')
  const [destinations, setDestinations] = useState([])
  const [filteredDestinations, setFilteredDestinations] = useState([])
  const [temperature, setTemperature] = useState('2')
  const [previousDisabled, setPreviousDisabled] = useState(true)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [slide1Destination, setSlide1Destination] = useState(0)
  const [slide2Destination, setSlide2Destination] = useState(0)
  const [slide3Destination, setSlide3Destination] = useState(0)
  const [slide4Destination, setSlide4Destination] = useState(0)
  const [coldDestinations, setColdDestinations] = useState([])
  const [mildDestinations, setMildDestinations] = useState([])
  const [warmDestinations, setWarmDestinations] = useState([])
  const [hotDestinations, setHotDestinations] = useState([])

  // ! On Mount
  useEffect(() => {
    const getDestinations = async () => {
      try {
        const { data } = await axios.get('/api/')
        setDestinations(data)
        setTemperature('2')
        createDestinationArrays()
      } catch (err) {
        setError(err.message)
      }
    }
    getDestinations()
  }, [])

  // ! Executions
  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    setError('')
  }

  const createDestinationArrays = () => {
    if (destinations.length > 0) {
      const currentMonth = new Date().getMonth()
      const cold = destinations.filter(destination => {
        return Math.min(...destinations.map(destination => destination.highTemps[currentMonth])) <= destination.highTemps[currentMonth] && destination.highTemps[currentMonth] <= 10
      })
      const mild = destinations.filter(destination => {
        return 11 <= destination.highTemps[currentMonth] && destination.highTemps[currentMonth] <= 19
      })
      const warm = destinations.filter(destination => {
        return 20 <= destination.highTemps[currentMonth] && destination.highTemps[currentMonth] <= 29
      })
      const hot = destinations.filter(destination => {
        return 30 <= destination.highTemps[currentMonth] && destination.highTemps[currentMonth] <= Math.max(...destinations.map(destination => destination.highTemps[currentMonth]))
      })
      setColdDestinations(cold)
      setMildDestinations(mild)
      setWarmDestinations(warm)
      setHotDestinations(hot)
    }
  }

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/', formFields)
      // Save the token to local storage for later use
      localStorage.setItem('WANDERLUST-TOKEN', data.token)
      closeModal()
      navigate('/') // need this to trigger the 'logout' button to show
    } catch (err) {
      setError(err.response.data.message)
    }
  }

  function openModal() {
    modalRef.current.showModal()
  }

  function closeModal() {
    modalRef.current.close()
  }

  function openRegisterModal() {
    registerRef.current.showModal()
  }

  function closeRegisterModal() {
    registerRef.current.close()
  }

  const handleFilter = (value) => {
    setTemperature(value)
  }

  const applyFilter = () => {
    if (destinations.length > 0) {
      const currentMonth = new Date().getMonth()
      let minTemp
      let maxTemp
      if (temperature === '0') {
        minTemp = Math.min(...destinations.map(destination => destination.highTemps[currentMonth]))
        maxTemp = 10
      } else if (temperature === '1') {
        minTemp = 11
        maxTemp = 19
      } else if (temperature === '2') {
        minTemp = 20
        maxTemp = 29
      } else {
        minTemp = 30
        maxTemp = Math.max(...destinations.map(destination => destination.highTemps[currentMonth]))
      }
      const temp = destinations.filter(destination => {
        return minTemp <= destination.highTemps[currentMonth] && destination.highTemps[currentMonth] <= maxTemp
      })
      setFilteredDestinations(temp)
    }
  }

  useEffect(() => {
    applyFilter()
    createDestinationArrays()
  }, [destinations, temperature])

  const handleImageChange = (value) => {
    if (temperature === '0') {
      setSlide1Destination(slide1Destination + parseInt(value))
    } else if (temperature === '1') {
      setSlide2Destination(slide2Destination + parseInt(value))
    } else if (temperature === '2') {
      setSlide3Destination(slide3Destination + parseInt(value))
    } else {
      setSlide4Destination(slide4Destination + parseInt(value))
    }
  }

  const disableButtons = () => {
    if (temperature === '0' && slide1Destination >= coldDestinations.length - 1) {
      setNextDisabled(true)
    } else if (temperature === '1' && slide2Destination >= mildDestinations.length - 1) {
      setNextDisabled(true)
    } else if (temperature === '2' && slide3Destination >= warmDestinations.length - 1) {
      setNextDisabled(true)
    } else if (temperature === '3' && slide4Destination >= hotDestinations.length - 1) {
      setNextDisabled(true)
    } else setNextDisabled(false)

    if (temperature === '0' && slide1Destination === 0) {
      setPreviousDisabled(true)
    } else if (temperature === '1' && slide2Destination === 0) {
      setPreviousDisabled(true)
    } else if (temperature === '2' && slide3Destination === 0) {
      setPreviousDisabled(true)
    } else if (temperature === '3' && slide4Destination === 0) {
      setPreviousDisabled(true)
    } else setPreviousDisabled(false)
  }

  useEffect(() => {
    disableButtons()
  }, [filteredDestinations, slide1Destination, slide2Destination, slide3Destination, slide4Destination])

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
      setError(err.response.data.message)
    }
  }

  return (
    <>
      <Nav openModal={openModal} openRegisterModal={openRegisterModal} />

      <main>
        <RegisterDialog registerRef={registerRef} closeRegisterModal={closeRegisterModal} handleChangeRegister={handleChangeRegister} submitRegistration={submitRegistration} registerFormFields={registerFormFields} />

        {/* <!-- BUTTONS (input/labels) --> */}
        <input type="radio" name="slider" id="slide-1-trigger" className="trigger" value="0" onChange={(e) => handleFilter(e.target.value)} />
        <label className="btn" htmlFor="slide-1-trigger"></label>
        <input type="radio" name="slider" id="slide-2-trigger" className="trigger" value="1" onChange={(e) => handleFilter(e.target.value)} />
        <label className="btn" htmlFor="slide-2-trigger"></label>
        <input type="radio" name="slider" id="slide-3-trigger" className="trigger" value="2" onChange={(e) => handleFilter(e.target.value)} defaultChecked />
        <label className="btn" htmlFor="slide-3-trigger"></label>
        <input type="radio" name="slider" id="slide-4-trigger" className="trigger" value="3" onChange={(e) => handleFilter(e.target.value)} />
        <label className="btn" htmlFor="slide-4-trigger"></label>
        <div className="emoji" id="emoji-cold">❄️</div>
        <div className="emoji" id="emoji-mild">⛅️</div>
        <div className="emoji" id="emoji-warm">☀️</div>
        <div className="emoji" id="emoji-hot">🔥</div>

        {/* <!-- SLIDES --> */}
        <div className="slide-wrapper">
          <div className="homepage-heading">
            <h1>Explore the world with Wanderlust</h1>
            <h2>Need to get away? Choose your weather mood and let&apos;s go travelling!</h2>
          </div>
          <div id="slide-role">
            {coldDestinations.length > 0 || mildDestinations.length > 0 || warmDestinations.length > 0 || hotDestinations.length > 0 ?
              <>
                <div className="slide slide-1" style={{ backgroundImage: `url("${coldDestinations[slide1Destination].images[0]}")` }}></div>
                <div className="slide slide-2" style={{ backgroundImage: `url("${mildDestinations[slide2Destination].images[1]}")` }}></div>
                <div className="slide slide-3" style={{ backgroundImage: `url("${warmDestinations[slide3Destination].images[2]}")` }}></div>
                <div className="slide slide-4" style={{ backgroundImage: `url("${hotDestinations[slide4Destination].images[3]}")` }}></div>
              </>
              :
              <>
              </>
            }
          </div>
          <div id="prev-next-controls">
            <button id="btn-previous" className="prev-next" value='-1' onClick={(e) => handleImageChange(e.target.value)} disabled={previousDisabled}>&#60;</button>
            <button id="btn-next" className="prev-next" value='1' onClick={(e) => handleImageChange(e.target.value)} disabled={nextDisabled}>&#62;</button>
          </div>
          <div id="explore">
            <div id="explore-button-container">
              <Link to='/destinations' state={{ filtered: filteredDestinations, unfiltered: destinations, temperature: temperature }}>
                <button className="site-button" id="btn-explore" >Explore!</button>
              </Link>
            </div>
          </div>
        </div>

        {/* <!-- LOGIN MODAL --> */}
        <dialog className="modal" id="modal" ref={modalRef}>
          <h2>Log into Wanderlust</h2>
          <button className="close-button" onClick={closeModal}>X</button>
          <form className="form" method="dialog" onSubmit={handleSubmit}>
            <label>Email:<input type="email" name="email" placeholder='Email' onChange={handleChange} value={formFields.email} /></label>
            <label>Password:<input type="password" name="password" placeholder='Password' onChange={handleChange} value={formFields.password} /></label>
            <button className="button" type="submit">Login</button>
            {error && <p className='text-danger'>{error}</p>}
          </form>
        </dialog>
      </main>
    </>
  )

}

export default Home