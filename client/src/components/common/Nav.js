import { useLocation, useNavigate, Link } from 'react-router-dom'
import { authenticated, getUserID, isAuthenticated, removeToken } from '../../helpers/auth'
import { useState, useEffect, useRef } from 'react'


const Nav = ({ openModal, openRegisterModal }) => {

  const location = useLocation()
  const navigate = useNavigate()

  const handleLogOut = () => {
    (location.pathname === '/admin' || location.pathname === `/profile/${getUserID()}`) ? navigate('/') : navigate(location)
    removeToken()
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
              <Link className="profile" to={`/profile/${getUserID()}`} as={Link}>Profile</Link>
              {/* <li className="" onClick={handleLogOut}>Profile</li> */}
              <li className="logout" onClick={handleLogOut}>Logout</li>
            </>
            :
            <>
              <li to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => openModal('login')}>Login</li>
              <li to="/" id="register" className={location.pathname === '/' ? 'active' : ''} onClick={() => openRegisterModal('register')}>Register</li>

            </>
          }
        </ul>
      </nav>
    </header >
  )

}

export default Nav