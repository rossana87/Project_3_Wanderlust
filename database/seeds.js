import mongoose from 'mongoose'
import 'dotenv/config'

import Destination from '../models/destinations.js'
import User from '../models/users.js'

import destinationData from './data/destinations.js'
import userData from './data/users.js'

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('🚀 Database connection established')

    await mongoose.connection.db.dropDatabase()
    console.log('🫳 Database dropped')

    const createUsers = await User.create(userData)
    console.log(`${createUsers.length} users added`)

    const destinationWithOwner = destinationData.map(destination => {
      const randomUser = createUsers[Math.floor(Math.random() * createUsers.length)]
      return { ...destination, owner: randomUser._id }
    })

    const createDestinations = await Destination.create(destinationWithOwner)
    console.log(`${createDestinations.length} destinations added`)

    await mongoose.connection.close()
    console.log('❌ Connection closed')

  } catch (err) {
    console.log(err)
    await mongoose.connection.close()
  }
}

seedDatabase()