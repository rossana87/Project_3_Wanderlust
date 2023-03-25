import { useState, useRef, useEffect } from 'react'
import React from 'react'
import Nav from './common/Nav'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const Home = () => {

  // ! State
  // State for the Modal to either show or not show
  const modalRef = useRef(null)

  // State for the Form Fields
  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [destinations, setDestinations] = useState([])
  const [filteredDestinations, setFilteredDestinations] = useState([])
  const [temperature, setTemperature] = useState('warm')
  // const [test, setTest] = useState(['reactjs', 'react-router-dom'])

  // ! On Mount
  useEffect(() => {
    // This function will get our bread data and save it to the bread state
    const getDestinations = async () => {
      try {
        const { data } = await axios.get('/api/')
        console.log('This is the data from Home.js', data)
        setDestinations(data)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getDestinations()
  }, [])

  // ! Executions
  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    // console.log('This is the login debug:', formFields, e.target.name)
    setError('')
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
      console.log('error', err)
      setError(err.response.data.message)
    }
  }

  function openModal() {
    modalRef.current.showModal()
  }

  function closeModal() {
    modalRef.current.close()
  }

  const handleFilter = (value) => {
    console.log(value)
    setTemperature(value)
  }

  const applyFilter = () => {
    const currentMonth = new Date().getMonth()
    let minTemp
    let maxTemp
    if (temperature === 'cold') {
      minTemp = Math.min(...destinations.map(destination => destination.highTemps[currentMonth]))
      maxTemp = 10
    } else if (temperature === 'mild') {
      minTemp = 11
      maxTemp = 19
    } else if (temperature === 'warm') {
      minTemp = 20
      maxTemp = 29
    } else {
      minTemp = 30
      maxTemp = Math.max(...destinations.map(destination => destination.highTemps[currentMonth]))
    }
    const temp = destinations.filter(destination => {
      console.log(destination.highTemps[currentMonth])
      return minTemp <= destination.highTemps[currentMonth] && destination.highTemps[currentMonth] <= maxTemp
    })
    setFilteredDestinations(temp)
    console.log('minTemp =', minTemp)
    console.log('maxTemp =', maxTemp)
    console.log(temp)
  }

  useEffect(() => {
    applyFilter()
  }, [temperature])

  return (
    <>
      <Nav openModal={openModal} />

      <main>
        {/* <!-- BUTTONS (input/labels) --> */}
        <input type="radio" name="slider" id="slide-1-trigger" className="trigger" value="cold" onChange={(e) => handleFilter(e.target.value)} />
        <label className="btn" htmlFor="slide-1-trigger"></label>
        <input type="radio" name="slider" id="slide-2-trigger" className="trigger" value="mild" onChange={(e) => handleFilter(e.target.value)} />
        <label className="btn" htmlFor="slide-2-trigger"></label>
        <input type="radio" name="slider" id="slide-3-trigger" className="trigger" value="warm" onChange={(e) => handleFilter(e.target.value)} />
        <label className="btn" htmlFor="slide-3-trigger"></label>
        <input type="radio" name="slider" id="slide-4-trigger" className="trigger" value="hot" onChange={(e) => handleFilter(e.target.value)} />
        <label className="btn" htmlFor="slide-4-trigger"></label>

        {/* <!-- SLIDES --> */}
        <div className="slide-wrapper">
          <div id="slide-role">
            <div className="slide slide-1"></div>
            <div className="slide slide-2"></div>
            <div className="slide slide-3"></div>
            <div className="slide slide-4"></div>
          </div>
          <div id="explore">
            <Link to='/destinations' state={{ filtered: filteredDestinations, unfiltered: destinations }}>
              <button id="btn-explore" >Explore!</button>
            </Link>
          </div>
        </div>

        {/* <!-- LOGIN MODAL --> */}
        <dialog className="modal" id="modal" ref={modalRef}>
          <h2>Log into Wanderlust</h2>
          <button className="close-button" onClick={closeModal}>X</button>
          <form className="form" method="dialog" onSubmit={handleSubmit}>
            <label>Email:<input type="email" name="email" placeholder='Email' onChange={handleChange} value={formFields.email} /></label>
            <label>Password:<input type="password" name="password" placeholder='Password' onChange={handleChange} value={formFields.password} /></label>
            <button className="button" type="submit">Submit form</button>
            {error && <p className='text-danger'>{error}</p>}
          </form>
        </dialog>
      </main>
    </>
  )

}

export default Home