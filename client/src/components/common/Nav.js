import { useLocation, useNavigate, Link } from 'react-router-dom'
import { authenticated, getUserID, isAuthenticated, removeToken } from '../../helpers/auth'
import { useState, useEffect } from 'react'


const Nav = ({ openModal }) => {
  const [error, setError] = useState('')
  const [profileData, setProfileData] = useState()

  const location = useLocation()
  const navigate = useNavigate()

  const handleLogOut = () => {
    // Remove token from local storage
    removeToken()
    navigate('/')
  }

  return (
    <header>
      <div id="logo">
        <Link to={'/'}>Wanderlust</Link>
      </div>
      <nav>
        <ul>
          {/* check if authenticated. if true, show logout, otherwise show login and register links */}
          {isAuthenticated() ?
            <>
              {/* <Link to="/admin" as={Link}>Admin</Link> */}
              <Link to={`/profile/${getUserID()}`} as={Link}>Profile</Link>
              {/* <li className="" onClick={handleLogOut}>Profile</li> */}
              <li className="" onClick={handleLogOut}>Logout</li>
            </>
            :
            <>
              <li to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => openModal('login')}>Login</li>
              <li to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => openModal('register')}>Register</li>

            </>
          }
        </ul>
      </nav>
    </header >
  )

}

export default Nav