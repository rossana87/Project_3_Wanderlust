import jwt from 'jsonwebtoken'
import 'dotenv/config'
import User from '../models/users.js'
import { NotFound, Unauthorized } from './errors.js'

export const secureRoute = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization
    console.log('AUTHORIZATION LOG ->', authorization)
    // 1.Check that the request has an Authorization header
    // 2.If it does, we move onto the next step, otherwise
    if (!authorization) throw new Unauthorized('Missing Authorization header')

    // 3. The token will hit our server as a Bearer token
    const token = authorization.replace('Bearer ', '')

    // 4. Here we use the jwt.verify() method to try to verify the token passed
    const payload = jwt.verify(token, process.env.SECRET)

    // 5. If the request reaches this point, the token is valid
    const loggedInUser = await User.findById(payload.sub)

    if (!loggedInUser) throw new NotFound('User not found')

    if (req.route.path.includes('admin') && !loggedInUser.isAdmin) throw new Unauthorized('User is not an admin')

    // 6. Pass the loggedInUser document above onto the req object by assigning it a key name
    req.loggedInUser = loggedInUser

    // 7. If the token is valid, and the user verified, then pass the request onto the controller
    next()
  } catch (err) {
    console.log(err.status)
    console.log(err.message)
    return res.status(401).json({ message: 'Unauthorized' })
  }
}