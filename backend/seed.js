const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const User = require('./models/User')

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  await User.deleteOne({ email: 'admin@gmail.com' })
  const hashed = await bcrypt.hash('admin123', 10)
  await User.create({
    name: 'Admin',
    email: 'admin@gmail.com',
    password: hashed,
    role: 'admin',
    isDeleted: false
  })
  console.log('Admin created successfully')
  process.exit()
}

seedAdmin()