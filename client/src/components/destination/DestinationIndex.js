import Nav from '../common/Nav'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

const DestinationIndex = () => {

  const [error, setError] = useState('')
  const [destinations, setDestinations] = useState([])
  const [filteredDestinations, setFilteredDestinations] = useState([])

  const location = useLocation()

  // const passedData = location.state?.data
  // console.log(location.state)

  // ! On Mount
  useEffect(() => {
    // This function will get our bread data and save it to the bread state
    if (!location.state) {
      const getDestinations = async () => {
        try {
          const { data } = await axios.get('/api/')
          console.log('This is the data from Home.js', data)
          setDestinations(data)
          setFilteredDestinations(data)
        } catch (err) {
          console.log(err)
          setError(err.message)
        }
      }
      getDestinations()
    } else {
      setDestinations(location.state.unfiltered)
      setFilteredDestinations(location.state.filtered)
    }
  }, [])



  return (
    <>
      <Nav />
      <main>
        <h1>Hello World</h1>
        <div id="grid-container">
          <div id="filters">Filters</div>
          <div id="grid">
            {filteredDestinations.length > 0 ?
              filteredDestinations.map(destination => {
                const { _id, name, highTemps } = destination
                const avgRating = destination.averageRating ? destination.averageRating : '-'
                const background = destination.images.length === 0 ? 'https://maketimetoseetheworld.com/wp-content/uploads/2018/01/Off-the-beaten-path-places-in-2018-720x540.jpg' : ''
                return (
                  <div key={_id} className="card" style={{ backgroundImage: `url(${background})` }} >
                    <div id="destination-name">{name}</div>
                    <div id="avg-weather">{highTemps[1]}</div>
                    <div id="avg-review">Average rating: {avgRating}</div>
                  </div>
                )
              })
              :
              <>
                {console.log(error)}
              </>
            }
          </div>
        </div>
      </main>
    </>
  )

}

export default DestinationIndex