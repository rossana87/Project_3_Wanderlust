import User from '../models/users.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

// Register Route
export const registerUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body)
    return res.json({ message: `Welcome ${newUser.username}` })
  } catch (err) {
    return res.status(422).json(err)
  }
}

// Login Route
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const userToLogin = await User.findOne({ email: email })
    const userIsValidated = await userToLogin.validatePassword(password)
    if (!userToLogin || !userIsValidated) {
      throw new Error()
    }
    const token = jwt.sign({ sub: userToLogin._id }, process.env.SECRET, { expiresIn: '7d' })
    return res.json({ message: `Welcome ${userToLogin.username}`, token: token  })
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Unauthorised' })
  }
}