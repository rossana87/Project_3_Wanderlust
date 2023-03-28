import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import DestinationIndex from './components/destination/DestinationIndex'
import DestinationSingle from './components/destination/DestinationSingle'

const App = () => {

  return (
    <div id="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<DestinationIndex />} />
          <Route path="/destinations/:id" element={<DestinationSingle />} />
          {/* <Route path="*" element={<PageNotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
