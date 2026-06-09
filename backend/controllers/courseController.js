const Course = require('../models/Course')

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isDeleted: false })
    res.json(courses)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.createCourse = async (req, res) => {
  try {
    const { name, courseCode, description, duration, category, trainingMode } = req.body
    const course = await Course.create({ name, courseCode, description, duration, category, trainingMode })
    res.status(201).json(course)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(course)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.params.id, { isDeleted: true })
    res.json({ message: 'Course deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}