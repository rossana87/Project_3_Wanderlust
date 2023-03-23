import express from 'express'
import { displayDestination } from '../controllers/destinations.js'
const router = express.Router()

router.route('/')
  .get(displayDestination)

export default router