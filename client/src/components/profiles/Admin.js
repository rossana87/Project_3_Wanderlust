
import Nav from '../common/Nav'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { authenticated } from '../../helpers/auth'

const Admin = () => {
  const [error, setError] = useState('')
  const [profileData, setProfileData] = useState({})

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await authenticated.get('/api/admin')
        setProfileData(data)
      } catch (err) {
        console.log('data')
        console.log(err)
        setError(err.message)
      }
    }
    getProfile()
  }, [])
}

export default Admin