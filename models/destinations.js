import mongoose from 'mongoose'

// ! Review schema
const { Schema } = mongoose

const reviewSchema = new Schema({
  title: { type: String, required: true, maxlength: 30 },
  text: { type: String, required: true, maxlength: 300 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  owner: { type: Schema.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
})

// ! Schema

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
  owner: { type: Schema.ObjectId, ref: 'User', required: true },
  reviews: [reviewSchema],
})

// ! Model
const { model } = mongoose

export default model('Destination', destinationSchema)