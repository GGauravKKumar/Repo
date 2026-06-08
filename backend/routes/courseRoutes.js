const express = require('express')
const router = express.Router()
const { getAllCourses, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController')
const { protect, authorise } = require('../middleware/authMiddleware')

router.get('/', protect, getAllCourses)
router.post('/', protect, authorise('admin'), createCourse)
router.put('/:id', protect, authorise('admin'), updateCourse)
router.delete('/:id', protect, authorise('admin'), deleteCourse)

module.exports = router