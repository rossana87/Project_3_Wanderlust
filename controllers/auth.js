import User from '../models/users.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

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