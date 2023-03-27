import User from '../models/users.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const loginOrRegister = async (req, res) => {
  try {
    if (!Object.keys(req.body).includes('passwordConfirmation')) {
      // Login Route
      console.log('login attempt')
      const { email, password } = req.body
      const userToLogin = await User.findOne({ email: email })
      const userIsValidated = await userToLogin.validatePassword(password)
      if (!userToLogin || !userIsValidated) {
        console.log('access denied')
        throw new Error()
      }
      console.log(req.body.email, ' was logged in')
      console.log(userToLogin._id, ' was logged in')

      const token = jwt.sign({ sub: userToLogin._id }, process.env.SECRET, { expiresIn: '7d' })
      return res.json({ message: `Welcome ${userToLogin.username}`, token: token })
    } else {
      // Register
      console.log('registration attempt')
      const newUser = await User.create(req.body)
      console.log(req.body.username, ' was registered')
      return res.json({ message: `Welcome ${newUser.username}` })
    }
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Unauthorised' })
  }
}