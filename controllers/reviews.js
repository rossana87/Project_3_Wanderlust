import Destination from '../models/destinations.js'
import { NotFound, Unauthorized, sendError } from '../config/errors.js'

// * POST Review
// Endpoint: /destinations/:id/reviews
export const addReview = async (req, res) => {
  try {
    const { id } = req.params
    console.log('Logged in user', req.loggedInUser)
    const destination = await Destination.findById(id)

    if (!destination) throw new NotFound('Record Not Found')

    const reviewToAdd = { ...req.body, owner: req.loggedInUser._id }

    destination.reviews.push(reviewToAdd)

    await destination.save()

    return res.status(201).json(destination)
  } catch (err) {
    return sendError(err, res)
  }
}

// * DELETE Review
// Endpoint: /destinations/:destinationId/reviews/:reviewId
export const deleteReview = async (req, res) => {
  try {
    const { destinationId, reviewId } = req.params
    const loggedInUserId = req.loggedInUser._id

    const destination = await Destination.findById(destinationId)
    if (!destination) throw new NotFound('Record not found')

    const reviewToDelete = destination.reviews.id(reviewId)
    if (!reviewToDelete) throw new NotFound('Review not found')

    if (!reviewToDelete.owner.equals(loggedInUserId)) {
      //console.log('NOT THE OWNER')
      throw new Unauthorized()
    }

    await reviewToDelete.deleteOne()
    //console.log(destination)

    await destination.save()

    return res.sendStatus(204)
  } catch (err) {
    return sendError(err, res)
  }
}