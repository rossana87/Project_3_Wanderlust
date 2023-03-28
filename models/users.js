import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

// ! Schema
const { Schema } = mongoose

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
})

userSchema.virtual('Destinations', {
  ref: 'Destination',
  localField: '_id',
  foreignField: 'owner',
})

userSchema.virtual('Reviews', {
  ref: 'Destination',
  localField: '_id',
  foreignField: 'reviews.owner',
})

// Removes password whenever a document is password is converted into JSON
userSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    delete ret.password
  },
})

// Creates virtual password confirmation field so it is not stored in the db
userSchema
  .virtual('passwordConfirmation')
  .set(function (userPasswordConfirmation) {
    this._passwordConfirmation = userPasswordConfirmation
  })

// Checks passord matches password confirmation
userSchema.pre('validate', function (next) {
  if (this.isModified('password') && this.password !== this._passwordConfirmation) {
    this.invalidate('passwordConfirmation', 'Passwords do not match.')
  }
  next()
})
// Encrypts password
  .pre('save', function (next) {
    if (this.isModified('password')) {
      const salt = bcrypt.genSaltSync(12)
      this.password = bcrypt.hashSync(this.password, salt)
    }
    next()
  })

// Custom method for password validation
userSchema.methods.validatePassword = function (plainTextPassword) {
  return bcrypt.compare(plainTextPassword, this.password)
}

// ! Model
const { model } = mongoose

export default model('User', userSchema)