import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import DestinationIndex from './components/destination/DestinationIndex'
import DestinationSingle from './components/destination/DestinationSingle'
import Profile from './components/profiles/Profile'
import Admin from './components/profiles/Admin'

import Nav from './components/common/Nav'

const App = () => {

  return (
    <div id="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/destinations" element={<DestinationIndex />} />
          <Route path="/destinations/:id" element={<DestinationSingle />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          {/* <Route path="*" element={<PageNotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
