import mongoose from 'mongoose'
import 'dotenv/config'

import Destination from '../models/destinations.js'
import User from '../models/users.js'

import destinationData from './data/destinations.js'
import userData from './data/users.js'

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { keepAlive: true, keepAliveInitialDelay: 300000 })
    console.log('🚀 Database connection established')

    await Promise.all(Object.values(mongoose.connection.collections).map(async collection => await collection.deleteMany()))
    console.log('🫳 Database dropped')

    const createUsers = await User.create(userData)
    console.log(`${createUsers.length} users added`)

    const destinationWithOwner = destinationData.map(destination => {
      const filteredUsers = createUsers.filter(user => user.isAdmin === true)
      const randomUser = filteredUsers[Math.floor(Math.random() * filteredUsers.length)]
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