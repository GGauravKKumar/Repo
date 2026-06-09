const Enrolment = require('../models/Enrolment')
const Feedback = require('../models/Feedback')

exports.getAllEnrolments = async (req, res) => {
  try {
    const enrolments = await Enrolment.find({ isDeleted: false })
      .populate('employee', 'name email role')
      .populate({
        path: 'batch',
        select: 'name batchId course startDate mode',
        populate: { path: 'course', select: 'name' }
      })
    res.json(enrolments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.createEnrolment = async (req, res) => {
  try {
    const { employee, batch, status } = req.body
    const existing = await Enrolment.findOne({ employee, batch, isDeleted: false })
    if (existing) return res.status(400).json({ message: 'Already enrolled' })

    // Get the new batch details
    const newBatch = await require('../models/Batch').findById(batch).populate('course', 'trainingMode')
    if (!newBatch) return res.status(404).json({ message: 'Batch not found' })

    // Get all active enrollments for this employee
    const activeEnrolments = await Enrolment.find({ employee, isDeleted: false })
      .populate({
        path: 'batch',
        populate: { path: 'course', select: 'trainingMode' }
      })

    // Check for date and time conflicts
    for (let enrol of activeEnrolments) {
      const existingBatch = enrol.batch
      const existingStartDate = new Date(existingBatch.startDate)
      const existingEndDate = new Date(existingBatch.endDate)
      const newStartDate = new Date(newBatch.startDate)
      const newEndDate = new Date(newBatch.endDate)

      // Check if dates overlap
      const datesOverlap = newStartDate <= existingEndDate && newEndDate >= existingStartDate

      if (datesOverlap) {
        // Check if training mode (time) is the same
        const sameTime = existingBatch.mode === newBatch.mode

        if (sameTime) {
          return res.status(400).json({
            message: `Cannot enroll: You are already enrolled in "${existingBatch.course.name}" (${existingBatch.name}) during the same time period. Dates overlap from ${existingStartDate.toDateString()} to ${Math.min(existingEndDate, newEndDate).toDateString()}`
          })
        }
      }
    }

    const enrolment = await Enrolment.create({ employee, batch, status: status || 'requested' })
    res.status(201).json(enrolment)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateEnrolment = async (req, res) => {
  try {
    const enrolment = await Enrolment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(enrolment)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteEnrolment = async (req, res) => {
  try {
    await Enrolment.findByIdAndUpdate(req.params.id, { isDeleted: true })
    res.json({ message: 'Enrolment deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.submitFeedback = async (req, res) => {
  try {
    const { employee, batch, comments } = req.body
    const feedback = await Feedback.create({ employee, batch, comments })
    res.status(201).json(feedback)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('employee', 'name email')
      .populate('batch', 'name')
    res.json(feedbacks)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}