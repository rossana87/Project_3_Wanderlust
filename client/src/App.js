import { useEffect, useRef } from 'react'
import axios from 'axios'

const App = () => {

  // const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef(null)

  function openModal() {
    // setIsOpen(true)
    modalRef.current.showModal()
    console.log('Open Modal clicked')
    // console.log(isOpen)
    
  }  

  function closeModal() {
    // setIsOpen(false)
    modalRef.current.close()
  }

  useEffect(() => {
    
    const getData = async () => {
      const { data } = await axios.get('/api/') // * <-- replace with your endpoint
      console.log(data)
    }
    getData()

  })

  return (
    <div id="wrapper">
      <header>
        <div id="logo">Wanderlust</div>
        <nav>
          <ul>
            <li onClick={openModal} className="open-button">Login</li>
            <li>Register</li>
          </ul>
        </nav>
      </header>
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
        </div>

        {/* <!-- LOGIN MODAL --> */}
        <dialog className="modal" id="modal" ref={modalRef}>
          <h2>Log into Wanderlust</h2>
          <button className="button close-button" onClick={closeModal}>close modal</button>
          <form className="form" method="dialog">
            <label>Email:<input type="text" /></label>
            <label>Password:<input type="email" /></label>
            <button className="button" type="submit">submit form</button>
          </form>
        </dialog>
      </main>
    </div>
  )
}

export default App
