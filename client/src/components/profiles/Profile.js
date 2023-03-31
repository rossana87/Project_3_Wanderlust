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
  const [userReviews, setUserReviews] = useState([])
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
        setUserReviews(data.Reviews)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getProfile()
  }, [editedReviews])

  useEffect(() => {
    console.log(profileData)
  }, [profileData])

  const handleDelete = (value) => {
    console.log(value)
    setDeleteID(value)
  }

  useEffect(() => {
    const deleteReview = async () => {
      const destinationId = profileData.Reviews.filter(destination => destination.reviews[0]._id === deleteId)[0].id
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
        const updatedReviews = userReviews.filter(review => review.id !== deleteId)
        setUserReviews(updatedReviews)
        setEditedReviews(updatedReviews)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
      // displayDetinations()
    }
    deleteReview()
  }, [deleteId])

  const displayReviews = () => {
    return profileData.Reviews.map((destination, i) => {
      const myReview = destination.reviews.filter(review => review.owner === profileData._id)[0]
      return (
        <div key={i}>
          <h3>Your review of {destination.name}, {destination.country}</h3>
          <div className="individual-review" >
            <h3 className="first-info">{myReview.title}</h3>
            <button className='delete' onClick={(e) => handleDelete(e.target.value)} value={myReview._id}>Delete</button>
            <p className="reviewText">{myReview.text}</p>
            <div><span className="rating">{'⭐️'.repeat(myReview.rating)}</span></div>
            <hr />
          </div>
        </div>
      )
    })
  }

  // useEffect(() => {
  //   displayReviews()
  // }, [profileData, userReviews])

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
                  <h3 className="profile-name">{profileData.username}</h3>
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
                  <h3>Your reviews:</h3>
                  <div id="reviews-container">
                    {profileData.Reviews.length > 0 ?
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