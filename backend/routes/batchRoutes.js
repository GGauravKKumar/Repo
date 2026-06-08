const express = require('express')
const router = express.Router()
const { getAllBatches, createBatch, updateBatch, deleteBatch } = require('../controllers/batchController')
const { protect, authorise } = require('../middleware/authMiddleware')

router.get('/', protect, getAllBatches)
router.post('/', protect, authorise('admin'), createBatch)
router.put('/:id', protect, authorise('admin'), updateBatch)
router.delete('/:id', protect, authorise('admin'), deleteBatch)

module.exports = router