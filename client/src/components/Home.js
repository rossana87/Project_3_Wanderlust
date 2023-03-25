import { useState, useRef, useEffect } from 'react'
import Nav from './common/Nav'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const Home = () => {
  
  // ! State
  // State for the Modal to either show or not show
  const modalRef = useRef(null)
  
  // State for the Form Fields
  const [ formFields, setFormFields ] = useState({
    email: '',
    password: '',
  })
  const [ error, setError ] = useState('')

  const [ destination, setDestination ] = useState([])
  const [ filteredDestination, setFilteredDestination ] = useState([])

  // ! On Mount
  useEffect(() => {
    // This function will get our bread data and save it to the bread state
    const getDestinations = async () => {
      try {
        const { data } = await axios.get('/api/')
        console.log('This is the data from Home.js', data)
        setDestination(data)
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

  return (
    <>
      <Nav openModal={openModal}/>

      <main>
        {/* <!-- BUTTONS (input/labels) --> */}
        <input type="radio" name="slider" id="slide-1-trigger" className="trigger" />
        <label className="btn" htmlFor="slide-1-trigger"></label>
        <input type="radio" name="slider" id="slide-2-trigger" className="trigger" />
        <label className="btn" htmlFor="slide-2-trigger"></label>
        <input type="radio" name="slider" id="slide-3-trigger" className="trigger" />
        <label className="btn" htmlFor="slide-3-trigger"></label>
        <input type="radio" name="slider" id="slide-4-trigger" className="trigger" />
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
            <Link to={'/destinations'}>
              <button id="btn-explore">Explore!</button> 
            </Link>
          </div>
        </div>

        {/* <!-- LOGIN MODAL --> */}
        <dialog className="modal" id="modal" ref={modalRef}>
          <h2>Log into Wanderlust</h2>
          <button className="close-button" onClick={closeModal}>X</button>
          <form className="form" method="dialog" onSubmit={handleSubmit}>
            <label>Email:<input type="email" name="email" placeholder='Email' onChange={handleChange} value={formFields.email}/></label>
            <label>Password:<input type="password" name="password" placeholder='Password' onChange={handleChange} value={formFields.password}/></label>
            <button className="button" type="submit">Submit form</button>
            {error && <p className='text-danger'>{error}</p>}
          </form>
        </dialog>
      </main>
    </>
  )

}

export default Home