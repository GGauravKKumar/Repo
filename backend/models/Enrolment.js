const mongoose = require('mongoose')

const enrolmentSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  status: { type: String, enum: ['requested', 'pending', 'approved', 'rejected'], default: 'requested' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Enrolment', enrolmentSchema)