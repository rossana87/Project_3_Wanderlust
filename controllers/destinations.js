import Destination from '../models/destinations.js'
import { NotFound, Unauthorized, sendError } from '../config/errors.js'

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
    const { destinationId } = req.params
    console.log(destinationId)
    const destination = await Destination.findById(destinationId).populate('owner').populate('reviews.owner')
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
export const updateDestination = async (req, res) => {
  try {
    const { name, country, continent, currency, latitude, longitude, description
      , images, features, highTemps, lowTemps, destinationId } = req.body
    console.log('DESTINADTION ID ->', destinationId)
    const loggedInUserId = req.loggedInUser._id

    const destinationToUpdate = await Destination.findById(destinationId)
    if (!destinationToUpdate) throw new NotFound('Destination not found')

    if (!destinationToUpdate.owner.equals(loggedInUserId)) {
      throw new Unauthorized()
    }

    Object.assign(destinationToUpdate, { name: name }, { country: country }, { continent: continent }, { currency: currency }, { latitude: latitude }, { longitude: longitude },
      { description: description }, { images: images }, { features: features }, { highTemps: highTemps }, { lowTemps: lowTemps } )

    await destinationToUpdate.save()

    return res.json(destinationToUpdate)
  } catch (err) {
    return sendError(err, res)
  }
}

// Delete Destination
//'/admin'
export const deleteDestination = async (req, res) => {
  try {
    const { destinationId } = req.body
    console.log('DESTINATION ID ->', destinationId)
    const loggedInUserId = req.loggedInUser._id

    const destinationToDelete = await Destination.findById(destinationId)
    if (!destinationToDelete) throw new NotFound('Destination not found')

    if (!destinationToDelete.owner.equals(loggedInUserId)) {
      throw new Unauthorized()
    }
    await destinationToDelete.deleteOne()
    return res.sendStatus(204)
  } catch (err) {
    return sendError(err, res)
  }
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
