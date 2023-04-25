import express from 'express'
import mongoose from 'mongoose'
import router from './config/router.js'
import 'dotenv/config'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

    app.use(express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })

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