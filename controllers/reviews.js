import Destination from '../models/destinations.js'
import { NotFound, Unauthorized, sendError } from '../config/errors.js'

// * POST Review
// Endpoint: /destinations/:id/
export const addReview = async (req, res) => {
  console.log('REVIEW REQ BODY', req.body)
  try {
    const { destinationId } = req.params
    const destination = await Destination.findById(destinationId)

    if (!destination) throw new NotFound('Destination Not Found')

    const reviewToAdd = { ...req.body, owner: req.loggedInUser._id }
    
    destination.reviews.push(reviewToAdd)
    
    await destination.save()

    return res.status(201).json(destination)
  } catch (err) {
    return sendError(err, res)
  }
}

// * DELETE Review
export const deleteReview = async (req, res) => {
  console.log('REQ BODY', req.body)
  try {
    const { id, destinationId } = req.body
    const loggedInUserId = req.loggedInUser._id

    const destination = await Destination.findById(destinationId)
    if (!destination) throw new NotFound('Destination not found')

    const reviewToDelete = destination.reviews.id(id)
    if (!reviewToDelete) throw new NotFound('Review not found')

    if (!reviewToDelete.owner.equals(loggedInUserId)) {
      throw new Unauthorized()
    }
    await reviewToDelete.deleteOne()
    await destination.save()
    return res.sendStatus(204)
  } catch (err) {
    return sendError(err, res)
  }
}

// * UPDATE Review
export const updateteReview = async (req, res) => {
  try {
    console.log('REQ BODY ->', req.body)
    const { destinationId } = req.params
    const { title, text, rating, id } = req.body
    console.log('REVIEW ID ->', id)
    console.log('DESTINADTION ID ->', destinationId)
    const loggedInUserId = req.loggedInUser._id

    const destination = await Destination.findById(destinationId)
    if (!destination) throw new NotFound('Destination not found')

    const reviewToUpdate = destination.reviews.id(id)
    if (!reviewToUpdate) throw new NotFound('Review not found')

    if (!reviewToUpdate.owner.equals(loggedInUserId)) {
      throw new Unauthorized()
    }

    Object.assign(reviewToUpdate, { title: title }, { text: text }, { rating: rating })

    await destination.save()

    return res.json(reviewToUpdate)
  } catch (err) {
    return sendError(err, res)
  }
}
