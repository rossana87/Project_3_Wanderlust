import mongoose from 'mongoose'
import 'dotenv/config'

import Destination from '../models/destinations.js'

import destinationData from './data/destinations.js'

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('🚀 Database connection established')

    await mongoose.connection.db.dropDatabase()
    console.log('🫳 Database dropped')

    // const createUsers = await User.create(userData)
    // console.log(`${createUsers.length} users added`)

    // const pokemonWithOwner = destinationData.map(record => {
    //   const randomUser = createUsers[Math.floor(Math.random() * createUsers.length)]
    //   console.log(randomUser)
    //   return { ...record, owner: randomUser._id }
    // })
    // console.log('reacords with an owner field ->', pokemonWithOwner)

    const createDestinations = await Destination.create(destinationData)
    console.log(`${createDestinations.length} destinations added`)

    await mongoose.connection.close()
    console.log('❌ Connection closed')

  } catch (err) {
    console.log(err)
    await mongoose.connection.close()
  }
}

seedDatabase()