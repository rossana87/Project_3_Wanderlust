import { useState, useRef, useEffect } from 'react'
import React from 'react'
import axios from 'axios'
import Nav from '../common/Nav'
import { useNavigate, Link } from 'react-router-dom'

const Register = ({ openModal, closeModal }) => {

  // const modalRef = useRef(null)
  const navigate = useNavigate()

  const [formFields, setFormFields] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    isAdmin: false,
  })
  const [error, setError] = useState('')

  // ! Executions
  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    console.log(e.target.name)
    setError('')
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/', formFields)
      // Save the token to local storage for later use
      // localStorage.setItem('WANDERLUST-TOKEN', data.token)
      // closeModal()
      navigate('/') // need this to trigger the 'register' button to show
    } catch (err) {
      console.log('error', err)
      setError(err.response.data.message)
    }
  }

  // function openModal() {
  //   modalRef.current.showModal()
  // }

  // function closeModal() {
  //   modalRef.current.close()
  // }

  // ! JSX
  return (
    <>
      <Nav openModal={openModal} />
      {/* <!-- REGISTER MODAL --> */}
      <dialog className="modal" id="modal" >
        <h2>Register into Wanderlust</h2>
        <button className="close-button" onClick={closeModal}>X</button>
        <form className="form" method="dialog" onSubmit={handleRegister}>
          <label>Username:<input type="text" name="username" placeholder='Username' onChange={handleChange} value={formFields.username} /></label>
          <label>Email:<input type="email" name="email" placeholder='Email' onChange={handleChange} value={formFields.email} /></label>
          <label>Password:<input type="password" name="password" placeholder='Password' onChange={handleChange} value={formFields.password} /></label>
          <label>Password Confirmation:<input type="password" name="passwordConfirmation" placeholder='Password Confirmation' onChange={handleChange} value={formFields.passwordConfirmation} /></label>
          <button className="button" type="submit">Register</button>
          {error && <p className='text-danger'>{error}</p>}
        </form>
      </dialog>
    </>
  )
}

export default Register