import express from 'express'
import mongoose from 'mongoose'
import router from './config/router.js'
import 'dotenv/config'

const app = express()


const startServer = async () => {
  try {
    
    // ? Connect to our mongodb database
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Database connected')
    
    app.use(express.json())

    // ? Middleware
    // logger
    app.use((req, res, next) => {
      console.log(`incoming requests: ${req.method} ${req.url}`)
      next()
    })

    // Routes
    app.use('/api', router)

    // 404 catach all middleware
    app.use((req, res) => {
      return res.status(404).json({ message: 'Route not found' })
    })

    app.listen(process.env.PORT, () => console.log(`Server is up and running and listening to port ${process.env.PORT}`))
  } catch (err) {
    console.log('There was an error starting the database')
    console.log(err)
  }
}

startServer()