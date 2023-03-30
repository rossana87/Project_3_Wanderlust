import Nav from '../common/Nav'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getToken } from '../../helpers/auth'
import profilePicture from '../images/profile_picture.png'

const Profile = () => {

  const [error, setError] = useState('')
  const [profileData, setProfileData] = useState(null)

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
        console.log(err)
        setError(err.message)
      }
    }
    getProfile()
  }, [])

  useEffect(() => {
    console.log(profileData)
  }, [profileData])

  const displayReviews = () => {
    return profileData.Reviews.map((destination, i) => {
      const myReview = destination.reviews.filter(review => review.owner === profileData._id)[0]
      return (
        <div key={i}>
          <h3>Your review of {destination.name}, {destination.country}</h3>
          <div className="individual-review" >
            <h3 className="first-info">{myReview.title}</h3>
            <p className="reviewText">{myReview.text}</p>
            <div><span className="rating">{'⭐️'.repeat(myReview.rating)}</span></div>
            <hr />
          </div>
        </div>
      )
    })
  }

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