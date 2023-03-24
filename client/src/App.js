import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import Home from './components/Home'

const App = () => {

  useEffect(() => {
    
    const getData = async () => {
      const { data } = await axios.get('/api/') // * <-- replace with your endpoint
      console.log('This is the data', data)
    }
    getData()

  })

  return (
    <div id="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/destinations" element={<DestinationIndex />} />
          <Route path="/'/destinations/:id/" element={<DestinationSingle />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
