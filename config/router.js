import express from 'express'
import { loginOrRegister } from '../controllers/auth.js'
import { addDestination, deleteDestination, displayAllDestinations, displaySingleDestination, updateDestination } from '../controllers/destinations.js'
import { addReview, deleteReview } from '../controllers/reviews.js'
import { secureRoute } from './secureRouter.js'

const router = express.Router()

router.route('/')
  .get(displayAllDestinations)
  .post(loginOrRegister)

router.route('/destinations/:id')
  .get(displaySingleDestination)
  .post(secureRoute, addReview)
  .delete(secureRoute, deleteReview)

router.route('/admin')
  .put(secureRoute, updateDestination)
  .post(secureRoute, addDestination)
  .delete(secureRoute, deleteDestination)

router.route('/profile')
  .delete(secureRoute, deleteReview)

// router.route('/destinations/:id/reviews')
//   .post(secureRoute, addReview)

// router.route('/destinations/:destinationId/reviews/:reviewId')
//   .delete(secureRoute, deleteReview)

export default router