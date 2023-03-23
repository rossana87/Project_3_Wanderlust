import mongoose from 'mongoose'

// ! Schema
const { Schema } = mongoose

const destinationSchema = new Schema({
  name: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  continent: { type: String, required: true },
  currency: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  features: [{ type: String, required: true }],
  highTemps: [{ type: Number, required: true }],
  lowTemps: [{ type: Number, required: true }],
})

// ! Model
const { model } = mongoose

export default model('Destination', destinationSchema)