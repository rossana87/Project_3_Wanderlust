import { useEffect } from 'react'
import axios from 'axios'

const App = () => {
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
        <nav></nav>
      </header>
      <main>
        {/* <h1>Hello World</h1> */}
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
      </main>
    </div>
  )
}

export default App
