import Nav from '../common/Nav'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getToken } from '../../helpers/auth'
import profilePicture from '../images/profile_picture.png'

const Profile = () => {

  const [error, setError] = useState('')
  const [profileData, setProfileData] = useState(null)
  const [deleteId, setDeleteID] = useState('')
  const [userDestinationsReviewed, setUserDestinationsReviewed] = useState([])
  const [editedReviews, setEditedReviews] = useState([])

  const { userId } = useParams()

  // ! On Mount
  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.create({
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
          .get(`/api/profile/${userId}`)
        setProfileData(data)
      } catch (err) {
        setError(err.message)
      }
    }
    getProfile()
  }, [editedReviews])

  useEffect(() => {
    if (profileData) {
      const destinationsReviewed = profileData.Reviews.map(destination => {
        return { ...destination, reviews: destination.reviews.find(review => review.owner === profileData._id) }
      })
      setUserDestinationsReviewed(destinationsReviewed)
    }
  }, [profileData])

  const displayReviews = () => {
    return userDestinationsReviewed.map((destination, i) => {
      const { name, country, reviews: { title, text, rating, _id } } = destination
      return (
        <div key={i}>
          <h3 className="profileh3">{name}, {country}</h3>
          <div className="individual-review" >
            <h3 className="reviewTitle">{title}</h3>
            <p className="reviewText">{text}</p>
            <div><span className="rating">{'⭐️'.repeat(rating)}</span></div>
          </div>
          <div className='deleteBtnDiv'>
            <button className='delete' onClick={(e) => handleDelete(e.target.value)} value={_id}>Delete</button>
          </div>
          <hr />
        </div>
      )
    })
  }

  // Delete review functionality
  const handleDelete = (value) => {
    setDeleteID(value)
  }

  useEffect(() => {
    if (deleteId === '') return
    const deleteReview = async () => {
      let destinationId
      if (profileData) destinationId = userDestinationsReviewed.find(destination => destination.reviews._id === deleteId).id
      try {
        await axios.delete(`/api/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          data: {
            id: deleteId,
            destinationId: destinationId,
          },
        })
        const updatedReviews = userDestinationsReviewed.filter(review => review.id !== deleteId)
        setUserDestinationsReviewed(updatedReviews)
        setEditedReviews(updatedReviews)
      } catch (err) {
        setError(err.message)
      }
    }
    deleteReview()
  }, [deleteId])

  return (
    <>
      <Nav />
      <main>
        <div id="grid-header">
          <section>
            <h1>Profile</h1>
          </section>
          <div id="grid-profile-container">
            <section className="userDetails">
              {profileData &&
                <>
                  <h2 className="profileh2">{profileData.username}</h2>
                  <div>
                    <img className="profile-picture" src={profilePicture} alt="profile" />
                  </div>
                  {profileData.isAdmin ?
                    <Link to="/admin" as={Link}>
                      <div className="button-box">
                        <button className="admin">Admin</button>
                      </div>
                    </Link>
                    :
                    ''}
                </>
              }
            </section>
            {profileData &&
              <>
                <section id="reviewsOwned">
                  <h2 className="profileh2">Your reviews:</h2>
                  <div id="reviews-container">
                    {userDestinationsReviewed.length > 0 ?
                      displayReviews()
                      :
                      <div>You haven&#39;t reviewed anything yet.</div>}
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