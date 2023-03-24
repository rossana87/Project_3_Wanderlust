import { useEffect } from 'react'
import { Buffer } from 'buffer'
import { useLocation, useNavigate } from 'react-router-dom'
const tokenName = 'WANDERLUST-TOKEN'

const Nav = ({ openModal }) => {

  // This function is going to use the payload to check the validity of the token
  // It will do this by checking the expiry date
  const getPayload = () => {
    const token = localStorage.getItem(tokenName) // get full token from localStorage
    if (!token) return
    const splitToken = token.split('.') // split token into 3 parts using split
    const payloadString = splitToken[1] // take the middle payload string and save it to a variable
    return JSON.parse(Buffer.from(payloadString, 'base64'))
  }

  const isAuthenticated = () => {
    const payload = getPayload() // get payload object containing the expiry date under the exp key
    if (!payload) return false // if it's undefined, it doesn't exist and so we return false
    const currentTime = Date.now() / 1000 // we get the current time by using Date.now() but need to convert to seconds from miliseconds so divide by 1000
    return currentTime < payload.exp // finally we check if the expiry is bigger than the current timestamp, if it is, it's valid
  }
  
  const removeToken = () => {
    localStorage.removeItem(tokenName)
  }

  const location = useLocation()
  const navigate = useNavigate()

  const handleLogOut = () => {
    // Remove token from local storage
    removeToken()
    navigate('/')
  }

  useEffect(() => {
    console.log(location)
  }, [location])

  return (
    <header>
      <div id="logo">Wanderlust</div>
      <nav>
        <ul>
          {/* check if authenticated. if true, show logout, otherwise show login and register links */}
          { isAuthenticated() ?
            <li className="" onClick={handleLogOut}>Logout</li>
            :
            <>
              <li to="/" className={location.pathname === '/' ? 'active' : ''} onClick={openModal}>Login</li>
              <li to="/" className={location.pathname === '/' ? 'active' : ''}>Register</li>
            </>
          }
        </ul>
      </nav>
    </header>
  )

}

export default Nav