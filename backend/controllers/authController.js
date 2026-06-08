const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email, isDeleted: false })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.json({ token, role: user.role, name: user.name })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).select('-password')
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, empId, department, dateOfJoining, age, gender, currentPostingLocation, dateOfCurrentPosting } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'User already exists' })
    const hashed = await bcrypt.hash(password, 10)
    await User.create({ name, email, password: hashed, role, empId, department, dateOfJoining, age, gender, currentPostingLocation, dateOfCurrentPosting, isDeleted: false })
    res.status(201).json({ message: 'User created successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isDeleted: true })
    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}