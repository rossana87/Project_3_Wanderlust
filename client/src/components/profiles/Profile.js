import Nav from '../common/Nav'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getToken } from '../../helpers/auth'


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

  const isAdmin = () => {
    if (profileData.isAdmin)
      return (
        <>
          <Link to="/admin" as={Link}>Admin</Link>
        </>
      )
  }

  useEffect(() => {
    console.log(profileData)
  }, [profileData])

  return (
    <>
      <Nav />
      <main>
        <div id="grid-header">
          <h1>Profile</h1>
          <div id="grid-container">
            <div id="filters">
              {profileData &&
                <>
                  <h2>{profileData.username}</h2>
                  <Link to="/profile" as={Link}>Profile</Link>
                  <Link to="/admin" as={Link}>{profileData.isAdmin ? 'Admin' : ''}</Link>
                </>
              }
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Profile