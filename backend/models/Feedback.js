const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  comments: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Feedback', feedbackSchema)
