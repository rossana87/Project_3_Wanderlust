import mongoose from 'mongoose'

// ! Review schema
const { Schema } = mongoose
const reviewSchema = new Schema({
  title: { type: String, required: true, maxlength: 100 },
  text: { type: String, required: true, maxlength: 300 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  // destinationId: { type: String, required: true },
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
  highTemps: {
    type: [Number],
    required: true,
    validate: {
      validator: function(highTemps) {
        return highTemps.length === 12 && highTemps.every(Number.isInteger)
      },
      message: 'highTemps must be an array of 12 integers',
    },
  },
  lowTemps: {
    type: [Number],
    required: true,
    validate: {
      validator: function(lowTemps) {
        return lowTemps.length === 12 && lowTemps.every(Number.isInteger)
      },
      message: 'lowTemps must be an array of 12 integers',
    },
  },
  valueForMoney: { type: Number, required: true },
  // lowTemps: [{ type: Number, required: true }],
  owner: { type: Schema.ObjectId, ref: 'User', required: true },
  reviews: [reviewSchema],
})

// ! Average Rating Virtual Field
destinationSchema.virtual('averageRating')
  .get(function () {
    if (!this.reviews.length) return 'Not yet rated'
    // Create a sum, then average it by dividing by the length
    const sum = this.reviews.reduce((acc, review) => {
      return acc + review.rating
    }, 0)
    return parseFloat((sum / this.reviews.length).toFixed(0))
  })

destinationSchema.set('toJSON', { virtuals: true })

// ! Model
const { model } = mongoose

export default model('Destination', destinationSchema)