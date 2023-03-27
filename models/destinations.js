import mongoose from 'mongoose'

// ! Review schema
const { Schema } = mongoose

const reviewSchema = new Schema({
  title: { type: String, required: true, maxlength: 20 },
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

// ! Average Rating Virtual Field
destinationSchema.virtual('averageRating')
  .get(function () {
    if (!this.reviews.length) return 'Not yet rated'
    // Create a sum, then average it by dividing by the length
    const sum = this.reviews.reduce((acc, review) => {
      return acc + review.rating
    }, 0)
    return parseFloat((sum / this.reviews.length).toFixed(2))
  })

destinationSchema.set('toJSON', { virtuals: true })

// ! Model
const { model } = mongoose

export default model('Destination', destinationSchema)