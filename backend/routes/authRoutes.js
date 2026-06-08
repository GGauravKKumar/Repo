const express = require('express')
const router = express.Router()
const { login, getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/authController')
const { protect, authorise } = require('../middleware/authMiddleware')

router.post('/login', login)
router.get('/users', protect, getAllUsers)
router.post('/users', protect, authorise('admin'), createUser)
router.put('/users/:id', protect, authorise('admin'), updateUser)
router.delete('/users/:id', protect, authorise('admin'), deleteUser)

module.exports = router