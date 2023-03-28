import { sendError } from '../config/errors.js'

// * Admin View
export const adminProfileView = async (req, res) => {
  try {
    const profile = await req.loggedInUser.populate('Destinations')
    return res.json(profile)
  } catch (err) {
    return sendError(err, res)
  }
}

// * Profile View
export const profileView = async (req, res) => {
  try {
    const profile = await req.loggedInUser.populate('Reviews')
    return res.json(profile)
  } catch (err) {
    return sendError(err, res)
  }
}