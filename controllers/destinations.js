import Destination from '../models/destinations.js'
import { sendError } from '../config/errors.js'

// GET all
export const displayAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find()
    // .populate('owner')
    console.log(destinations)
    return res.json(destinations)
  } catch (err) {
    console.log(err)
  }
}

// Get Single Destination
//'/destinations/:id'
export const displaySingleDestination = async (req, res) => {
  try {
    const { id } = req.params
    console.log(id)
    const destination = await Destination.findById(id).populate('owner').populate('reviews.owner')
    console.log('THIS CONSOLE LOG!!!!', destination)

    // If record returns null, we want to throw a 404
    if (!destination) throw new Error('Record not found')

    // Return the found record to the client
    return res.json(destination)
  } catch (err) {
    return sendError(err, res)
  }
}

// Update Destination
//'/admin'
export const updateDestination = async () => {

}

// Delete Destination
//'/admin'
export const deleteDestination = async (req, res) => {
  // try {
  //   const { id } = req.params
  //   console.log(id)
  //   const deleteDestination = await Destination.findByIdAndDelete(id)
  //   if (!deleteDestination) throw new Error('Destination not found')
  //   return res.sendStatus(204)
  // } catch (err) {
  //   return sendError(err, res)
  // }
}


// Add Destination
//'/admin'
export const addDestination = async (req, res) => {
  try {
    req.body.owner = req.loggedInUser._id
    const createdDestination = await Destination.create(req.body)
    return res.status(201).json(createdDestination)
  } catch (err) {
    return sendError(err, res)
  }
}
