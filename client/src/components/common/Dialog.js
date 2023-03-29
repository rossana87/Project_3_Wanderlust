

const Dialog = ({ modalRef, closeModal, handleLogin, handleSubmit, formFields }) => {
// const Dialog = () => {
  const [error, setError] = ('')
  // // State for the Form Fields
  // const [formFields, setFormFields] = useState({
  //   email: '',
  //   password: '',
  // })

  // function openModal() {
  //   modalRef.current.showModal()
  // }

  // function closeModal() {
  //   modalRef.current.close()
  // }

  // const handleLogin = (e) => {
  //   setFormFields({ ...formFields, [e.target.name]: e.target.value })
  //   setError('')
  // }


  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   try {
  //     const { data } = await axios.post('/api/', formFields)
  //     // Save the token to local storage for later use
  //     localStorage.setItem('WANDERLUST-TOKEN', data.token)
  //     closeModal()
  //     navigate(location) // need this to trigger the 'logout' button to show
  //   } catch (err) {
  //     console.log('error', err)
  //     setError(err.response.data.message)
  //   }
  // }

  return (
    <dialog className="modal" id="modal" ref={modalRef}>
      <h2>Log into Wanderlust</h2>
      <button className="close-button" onClick={closeModal}>X</button>
      <form className="form" method="dialog" onSubmit={handleSubmit}>
        <label>Email:<input type="email" name="email" placeholder='Email' onChange={handleLogin} value={formFields.email} /></label>
        <label>Password:<input type="password" name="password" placeholder='Password' onChange={handleLogin} value={formFields.password} /></label>
        <button className="button" type="submit">Submit form</button>
        {error && <p className='text-danger'>{error}</p>}
      </form>
    </dialog>
  )
}

export default Dialog