const mongoose = require('mongoose')

const batchSchema = new mongoose.Schema({
  batchId: { type: String, required: true },
  name: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  capacity: { type: Number, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'], required: true },
  trainer: { type: String, default: '' },
  status: { type: String, required: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Batch', batchSchema)