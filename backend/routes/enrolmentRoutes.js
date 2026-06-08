const express = require('express')
const router = express.Router()
const { getAllEnrolments, createEnrolment, updateEnrolment, deleteEnrolment, submitFeedback, getAllFeedback } = require('../controllers/enrolmentController')
const { protect, authorise } = require('../middleware/authMiddleware')

router.get('/', protect, getAllEnrolments)
router.post('/', protect, createEnrolment)
router.post('/feedback', protect, submitFeedback)
router.get('/feedback', protect, getAllFeedback)
router.put('/:id', protect, authorise('admin', 'manager'), updateEnrolment)
router.delete('/:id', protect, authorise('admin'), deleteEnrolment)

module.exports = router