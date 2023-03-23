import Destination from '../models/destinations.js'

// GET all
export const displayDestination = async (req, res) => {
  try {
    const destinations = await Destination.find()
    // .populate('owner')
    console.log(destinations)
    return res.json(destinations)
  } catch (err) {
    console.log(err)
  }
}