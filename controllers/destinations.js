import Destination from '../models/destinations.js'
import { NotFound, Unauthorized, sendError } from '../config/errors.js'

// GET all
export const displayAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find()
    return res.json(destinations)
  } catch (err) {
    console.log(err)
  }
}

// Get Single Destination
//'/destinations/:id'
export const displaySingleDestination = async (req, res) => {
  try {
    // console.log(req)
    const { destinationId } = req.params
    const destination = await Destination.findById(destinationId).populate('owner').populate('reviews.owner')

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
  console.log('UPDATE REQBODY ->', req.body)
  try {
    const { name, country, continent, currency, latitude, longitude, description
      , images, features, highTemps, lowTemps, id } = req.body
    const loggedInUserId = req.loggedInUser._id

    const destinationToUpdate = await Destination.findById(id)
    if (!destinationToUpdate) throw new NotFound('Destination not found')

    if (!destinationToUpdate.owner.equals(loggedInUserId)) {
      throw new Unauthorized()
    }

    const formattedHighTemps = highTemps.split(',').map(num => parseInt(num.trim()))
    const formattedLowTemps = lowTemps.split(',').map(num => parseInt(num.trim()))
    const formattedFeatures = features.split(',')
    const formattedimages = images.split(',').map(image => image.trim())

    Object.assign(destinationToUpdate, { name: name }, { country: country }, { continent: continent }, { currency: currency }, { latitude: latitude }, { longitude: longitude },
      { description: description }, { images: formattedimages }, { features: formattedFeatures }, { highTemps: formattedHighTemps }, { lowTemps: formattedLowTemps })

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
    const { id } = req.body
    console.log('DESTINATION ID ->', id)
    const loggedInUserId = req.loggedInUser._id

    const destinationToDelete = await Destination.findById(id)
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
    const { images, features, highTemps, lowTemps } = req.body

    req.body.owner = req.loggedInUser._id

    const formattedHighTemps = highTemps.split(',').map(num => parseInt(num.trim()))
    const formattedLowTemps = lowTemps.split(',').map(num => parseInt(num.trim()))
    const formattedFeatures = features.split(',')
    const formattedimages = images.split(',').map(image => image.trim())

    const createdDestination = await Destination.create({ ...req.body, highTemps: formattedHighTemps,
      lowTemps: formattedLowTemps, images: formattedimages, features: formattedFeatures })


    return res.status(201).json(createdDestination)
  } catch (err) {
    return sendError(err, res)
  }
}
