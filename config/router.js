import express from 'express'
import { loginOrRegister } from '../controllers/auth.js'
import { displayDestination } from '../controllers/destinations.js'
import { addReview, deleteReview } from '../controllers/reviews.js'
import { secureRoute } from './secureRouter.js'

const router = express.Router()

router.route('/')
  .get(displayDestination)
  .post(loginOrRegister)
<<<<<<< HEAD
=======

router.route('/destinations/:id/reviews')
  .post(secureRoute, addReview)

router.route('/destinations/:destinationId/reviews/:reviewId')
  .delete(secureRoute, deleteReview)
>>>>>>> development

export default router