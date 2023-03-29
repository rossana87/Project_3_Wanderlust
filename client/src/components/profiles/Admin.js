import Nav from '../common/Nav'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getToken, getUserID } from '../../helpers/auth'

const Profile = () => {

  const [error, setError] = useState('')
  const [adminDestinations, setAdminDestinations] = useState([])
  const [destinationId, setDestinationID] = useState({
    destinationId: '',
  })

  // ! On Mount

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.get('/api/admin', {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        const { Destinations } = data
        setAdminDestinations(Destinations)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getProfile()
  }, [])

  useEffect(() => {
    console.log(destinationId)
    const deleteDestination = async () => {
      try {
        await axios.delete('/api/admin', {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          data: {
            destinationId: destinationId,
          },
        })
        const updatedDestinations = adminDestinations.filter(destination => destination.id !== destinationId)
        setAdminDestinations(updatedDestinations)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
      displayDetinations()
    }
    deleteDestination()
  }, [destinationId])

  const handleDelete = (value) => {
    setDestinationID(value)
  }

  const handleedit = () => {
    console.log('CLICKED ADMIN DESTINATIONS ->', adminDestinations)
  }

  const displayDetinations = () => {
    return (
      adminDestinations &&
      adminDestinations.map((destination, i) => {
        return (
          <div key={i}>
            <div className="individualDestination" >
              <h3>{destination.name}, {destination.country}</h3>
              <div className='destinationDetails'>
                <div className='destinationImageDiv'><img src={destination.images[3]} alt={destination.name} className='destinationImage' /></div>
                <div className='destinationBtns'>
                  <button className='edit' onClick={handleedit}>Edit</button>
                  <button className='delete' onClick={(e) => handleDelete(e.target.value)} value={destination.id}>Delete</button>
                </div>
              </div>
              <hr />
            </div>
          </div>
        )
      })
    )
  }

  useEffect(() => {
    displayDetinations()
  }, [adminDestinations])

  return (
    <>
      <Nav />
      <main>
        <div id="grid-header">
          <section id='adminHeader'>
            <Link to={`/profile/${getUserID()}`} as={Link} className='backToProfile'>← Back to profile</Link>
            <h1 id='adminH1'>Admin</h1>
          </section>
          <div id="grid-container">
            {adminDestinations &&
              <>
                <section id="destinationsOwned">
                  <div id='yourDestinationsHeader'>
                    <h3>Your destinations:</h3>
                    <input type="text" placeholder='Search destinations...' />
                  </div>
                  <div id="destinations-container">
                    {adminDestinations.length > 0 ?
                      displayDetinations()
                      :
                      <div>You don&#39;t own any destinations yet.</div>}
                  </div>
                </section>
              </>
            }
          </div>
        </div>
      </main >
    </>
  )
}

export default Profile