import express from 'express'
import { loginUser } from '../controllers/auth.js'
import { displayDestination } from '../controllers/destinations.js'
const router = express.Router()

router.route('/')
  .get(displayDestination)
  .post(loginUser)

export default router