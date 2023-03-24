import Destination from '../models/destinations.js'

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
export const displaySingleDestination = async () => {

}

// Update Destination
export const updateDestination = async () => {
  
}

// Delete Destination
export const deleteDestination = async () => {
  
}

// Add Destination
export const addDestination = async () => {
  
}