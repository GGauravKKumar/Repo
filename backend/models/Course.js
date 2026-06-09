const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courseCode: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  category: { type: String, enum: ['Technical', 'Non-Technical'], required: true },
  trainingMode: { type: String, required: true },
  trainerName: { type: String, default: '' },
  status: { type: String, required: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Course', courseSchema)