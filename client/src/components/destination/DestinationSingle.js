import Nav from '../common/Nav'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

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

  return (
    <>
      <Nav />
      <main>
        {destination &&
          <>
            <section id="hero" style={{ backgroundImage: `url(${destination.images.length === 0 ? 'https://maketimetoseetheworld.com/wp-content/uploads/2018/01/Off-the-beaten-path-places-in-2018-720x540.jpg' : destination.images[0]})` }}>
              <h1>{destination.name}</h1>
              <p>{destination.description}</p>
            </section>
            <section id="common">
              <div className='info'>
                <div><img src="" alt="countryIcon" /></div>
                <div>
                  <h3>Country</h3>
                  {destination.country}
                </div>
              </div>
              <div className='info'>
                <div><img src="" alt="continentIcon" /></div>
                <div>
                  <h3>Continent</h3>
                  {destination.continent}
                </div>
              </div>
              <div className='info'>
                <div><img src="" alt="currencyIcon" /></div>
                <div>
                  <h3>Currency</h3>
                  {destination.currency}
                </div>
              </div>
              <div className='info'>
                <div><img src="" alt="currencyIcon" /></div>
                <div>
                  <h3>Price</h3>
                  {destination.price}
                </div>
              </div>
              {destination.averageRating &&
                <div className='info'>
                  <div><img src="" alt="ratingIcon" /></div>
                  <div>
                    <h3>Average Rating</h3>
                    {destination.averageRating}
                  </div>
                </div>
              }
              <div id="forecast"></div>
            </section>
            <section id="ftAndMap">
              <div>
                <ul className="fa-ul">
                  <li><span className="fa-li"><i className="restaurants"></i></span>{destination.features[0]}</li>
                  <li><span className="fa-li"><i className="activites"></i></span>{destination.features[1]}</li>
                  <li><span className="fa-li"><i className="sightseeing"></i></span>{destination.features[2]}</li>
                </ul>
              </div>
              <div id="map">
                MAP
              </div>
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