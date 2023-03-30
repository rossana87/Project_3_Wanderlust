

const Dialog = ({ modalRef, closeModal, handleLogin, handleSubmit, formFields }) => {

  const [error, setError] = ('')

  return (
    <dialog className="modal" id="modal" ref={modalRef}>
      <h2>Login into Wanderlust</h2>
      <button className="close-button" onClick={closeModal}>X</button>
      <form className="form" method="dialog" onSubmit={handleSubmit}>
        <label>Email:<input type="email" name="email" placeholder='Email' onChange={handleLogin} value={formFields.email} /></label>
        <label>Password:<input type="password" name="password" placeholder='Password' onChange={handleLogin} value={formFields.password} /></label>
        <button className="button" type="submit">Login</button>
        {error && <p className='text-danger'>{error}</p>}
      </form>
    </dialog>
  )
}

export default Dialog