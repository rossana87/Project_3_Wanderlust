import mongoose from 'mongoose'

// ! Schema
const { Schema } = mongoose

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

// ! Model
const { Model } = mongoose

export default Model('User', userSchema)