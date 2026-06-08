const Batch = require('../models/Batch')

exports.getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find({ isDeleted: false }).populate('course', 'name courseCode')
    res.json(batches)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.createBatch = async (req, res) => {
  try {
    const { batchId, name, course, startDate, endDate, capacity, trainer, startTime, endTime, mode, status } = req.body
    const batch = await Batch.create({ batchId, name, course, startDate, endDate, capacity, trainer, startTime, endTime, mode, status })
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