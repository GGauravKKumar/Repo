const Batch = require('../models/Batch')
const Enrolment = require('../models/Enrolment')

exports.getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find({ isDeleted: false }).populate('course', 'name courseCode').lean()
    for (let batch of batches) {
      batch.joinedCount = await Enrolment.countDocuments({ batch: batch._id, isDeleted: false, status: { $ne: 'rejected' } })
    }
    res.json(batches)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.createBatch = async (req, res) => {
  try {
    const { batchId, name, course, startDate, endDate, capacity, startTime, endTime, mode } = req.body
    const batch = await Batch.create({ batchId, name, course, startDate, endDate, capacity, startTime, endTime, mode })
    res.status(201).json(batch)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(batch)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteBatch = async (req, res) => {
  try {
    await Batch.findByIdAndUpdate(req.params.id, { isDeleted: true })
    res.json({ message: 'Batch deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}