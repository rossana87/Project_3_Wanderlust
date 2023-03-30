

const Dialog = ({ registerRef, closeRegisterModal, handleChangeRegister, registerFormFields, submitRegistration }) => {

  const [error, setError] = ('')

  return (
    <dialog className="modal" id="modal" ref={registerRef}>
      <h2>Register</h2>
      <button className="close-button" onClick={closeRegisterModal}>X</button>
      <form className="form" method="dialog" onSubmit={submitRegistration}>
        <label>Username:<input type="text" name="username" placeholder='Username' onChange={handleChangeRegister} value={registerFormFields.username} /></label>
        <label>Email:<input type="email" name="email" placeholder='Email' onChange={handleChangeRegister} value={registerFormFields.email} /></label>
        <label>Password:<input type="password" name="password" placeholder='Password' onChange={handleChangeRegister} value={registerFormFields.password} /></label>
        <label>Password Confirmation:<input type="password" name="passwordConfirmation" placeholder='Password Confirmation' onChange={handleChangeRegister} value={registerFormFields.passwordConfirmation} /></label>
        <button className="button" type="submit">Register</button>
        {error && <p className='text-danger'>{error}</p>}
      </form>
    </dialog>
  )
}

export default Dialog