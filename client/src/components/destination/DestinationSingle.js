import Nav from '../common/Nav'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEarthAmericas, faWallet, faCoins, faCommentDots, faMapLocationDot, faPersonHiking, faMountainSun, faUtensils } from '@fortawesome/free-solid-svg-icons'
import mapboxgl from 'mapbox-gl'

// mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNndWxsYW5kIiwiYSI6ImNsZnM1dTBsbzAzNGczcW1ocThldWt5bDkifQ.W8F3EzE7Ap170SOD3_VRDg'
// const map = new mapboxgl.Map({
//   container: 'map',
//   style: 'mapbox://styles/mapbox/streets-v12',
//   center: [-74.5, 40],
//   zoom: 9,
// })

const DestinationIndex = () => {

  const [error, setError] = useState('')
  const [destination, setDestination] = useState(null)

  const { id } = useParams()

  // ! On Mount
  useEffect(() => {
    // This function will get our bread data and save it to the bread state
    const getDestination = async () => {
      try {
        const { data } = await axios.get(`/api/destinations/${id}`)
        setDestination(data)
        console.log(data)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getDestination()
  }, [id])

  useEffect(() => {
    // This function will get our bread data and save it to the bread state
    const getMap = async () => {
      try {
        mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNndWxsYW5kIiwiYSI6ImNsZnM1dTBsbzAzNGczcW1ocThldWt5bDkifQ.W8F3EzE7Ap170SOD3_VRDg'
        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v12',
          // center: [-74.5, 40],
          center: [destination.longitude, destination.latitude],
          zoom: 10,
        })
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getMap()
  })

  // const updateMap = () => {

  //   const long = destination.longitude
  //   const map = new mapboxgl.Map({
  //         container: 'map',
  //         style: 'mapbox://styles/mapbox/streets-v12',
  //         // center: [-74.5, 40],
  //         center: [, 40],
  //         zoom: 9,
  //   })
  // }
  

  return (
    <>
      <Nav />
      <main>
        {destination &&
          <>
            <section id="hero" style={{ backgroundImage: `url("${destination.images.length === 0 ? 'https://maketimetoseetheworld.com/wp-content/uploads/2018/01/Off-the-beaten-path-places-in-2018-720x540.jpg' : destination.images[0]}")` }}>
              <h1>{destination.name}</h1>
              <p>{destination.description}</p>
            </section>
            <section id="common">
              <div id="common-container">
                <div className="info">
                  <h3 className="first-info">Country</h3>
                  <div className="icon-container">
                    <div className="icon"><FontAwesomeIcon icon={faEarthAmericas} /></div><div>{destination.country}, {destination.continent}</div>
                  </div>
                </div>
                <div className="info">
                  <div>
                    <h3>Currency</h3>
                    <div className="icon-container">
                      <div className="icon"><FontAwesomeIcon icon={faWallet} /></div><div>{destination.currency}</div>
                    </div>
                  </div>
                </div>
                <div className="info">
                  <div>
                    <h3>Price</h3>
                    <div className="icon-container">
                      <div className="icon"><FontAwesomeIcon icon={faCoins} /></div><div>{destination.price} $$$</div>
                    </div>
                  </div>
                </div>
                {destination.averageRating &&
                  <div className="info">
                    <div>
                      <h3>Average Rating</h3>
                      <div className="icon-container">
                        <div className="icon"><FontAwesomeIcon icon={faCommentDots} /></div><div>{destination.averageRating}</div>
                      </div>
                    </div>
                  </div>
                }
              </div>
              {/* <div id="forecast-container">Forecast data goes here</div> */}
              <div id="map"></div>
            </section>
            <section id="attractions">
              <div id="attraction-container">
                <h3 className="first-info">Attractions</h3>
                {/* <ul className="fa-ul">
                  <li><span className="fa-li"><i className="restaurants"></i></span>{destination.features[0]}</li>
                  <li><span className="fa-li"><i className="activites"></i></span>{destination.features[1]}</li>
                  <li><span className="fa-li"><i className="sightseeing"></i></span>{destination.features[2]}</li>
                </ul> */}
                <div className="icon-container first-info">
                  <div className="icon sightseeing"><FontAwesomeIcon icon={faMapLocationDot} /></div><div>{destination.features[2]}Sightseeing goes here...  </div>
                </div>
                <div className="icon-container">
                  <div className="icon activities"><FontAwesomeIcon icon={faPersonHiking} /></div><div>{destination.features[1]}Activities goes here...</div>
                </div>
                <div className="icon-container">
                  <div className="icon restaurants"><FontAwesomeIcon icon={faUtensils} /></div><div>{destination.features[0]}Restaurants goes here...</div>
                </div>
              </div>
              {/* <div id="map"></div> */}
              <div id="forecast-container">Forecast data goes here</div>
            </section>
            <section className="map">
              This should be the map
              {/* <div id="map"></div> */}
            </section>
            <section className="reviews">
              {destination.reviews.length > 0 ?
                destination.reviews.map((review, i) => {
                  return (
                    <div key={i}>
                      <h5>{review.title}</h5>
                      <p className="reviewText">{review.text}</p>
                      <div><span className="reviewOwner">{review.owner.username}</span><span className="rating">{'⭐️'.repeat(review.rating)}</span></div>
                    </div>
                  )
                })
                :
                'Not yet reviewed'
              }
            </section>
          </>
        }
      </main>
    </>
  )

}

export default DestinationIndex