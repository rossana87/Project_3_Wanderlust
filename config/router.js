import express from 'express'
import { loginUser, registerUser } from '../controllers/auth.js'
import { displayDestination } from '../controllers/destinations.js'
const router = express.Router()

router.route('/')
  .get(displayDestination)
  .post(loginUser)
  // .post(registerUser)

router.route('/register')
  .post(registerUser)

export default router