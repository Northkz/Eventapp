const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../../models/user_model.js')
const Confirmation = require('../../models/confirmation_model.js')

const { get_logger } = require('../../utils/logger.js')

// Get Logger
const logger = get_logger()

// ----------- USER CRUD -----------

// @desc    Get user
// @route   GET /api/admin/user
// @access  Admin
const adminGetUser = asyncHandler(async (req, res) => {
    const { email } = req.query

    // Return all users
    if (!email){
        const users = await User.find({}, {"_id": 0})
        logger.info("/api/admin/user: Successful all users retrieval")
        res.status(200).json({
            users
        })
    }
    else {
        // Check if user exists
        const user = await User.findOne({ email })

        if (!user) {
            logger.error(`/api/admin/user: User with email: ${email} does not exist`)
            res.status(400)
            throw new Error(`User with email: ${email} does not exist`)
        }
        else {
            logger.info("/api/admin/user: Successful user retrieval")
            res.status(200).json(user)
        }
    }
})

// @desc    Create user
// @route   POST /api/admin/user
// @access  Admin
const adminCreateUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Check for all user fields
    if (!email || !password){
        logger.error("/api/admin/user: Please add all user information")
        res.status(400)
        throw new Error("Please add all user information")
    }

    // Check if user with the same email exists
    const userExists = await User.findOne({ email })

    if (userExists) {
        logger.error(`/api/admin/user: User with the email: ${email} already exists`)
        res.status(400)
        throw new Error(`User with the email: ${email} already exists`)
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        email,
        password: hashedPassword,
        isAdmin: false,
        isVerified: false
    })

    if (user) {
        logger.info("/api/admin/user: Successful user registration")
        res.status(201).json(user)
    } 
    else {
        logger.error("/api/admin/user: Invalid user data")
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Update user
// @route   PUT /api/admin/user
// @access  Admin
const adminUpdateUser = asyncHandler(async (req, res) => {
    const email = req.query.email
    const { password } = req.body

    // Check email
    if (!email){
        logger.error("/api/admin/user: Please add email")
        res.status(400)
        throw new Error("Please add email")
    }

    // Check all fields to be parsed
    if (!password){
        logger.error("/api/admin/user: Please add all user information")
        res.status(400)
        throw new Error("Please add all user information")
    }

    // Check if user exists
    const userExists = await User.findOne({ email })

    if (!userExists) {
        logger.error(`/api/admin/user: User with the email: ${email} does not exist`)
        res.status(400)
        throw new Error(`User with the email: ${email} does not exist`)
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Update the user
    const user = await User.findOneAndUpdate({ email }, {
        password: hashedPassword
    })
    
    if (user) {
        logger.info("/api/admin/user: Successful user update")
        res.status(201).json(user)
    }
    else {
        logger.error("/api/admin/user: Invalid user data")
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Delete user
// @route   DELETE /api/admin/user
// @access  Admin
const adminDeleteUser = asyncHandler(async (req, res) => {
    const email = req.query.email
    
    // Check email
    if (!email){
        logger.error("/api/admin/user: Please add email")
        res.status(400)
        throw new Error("Please add email")
    }

    // Check if user exists
    const userExists = await User.findOne({ email })

    if (!userExists) {
        logger.error(`/api/admin/user: User with the email: ${email} does not exist`)
        res.status(400)
        throw new Error(`User with the email: ${email} does not exist`)
    }

    if (userExists.isVerified === true){
        // Delete email confirmation
        const confirmation = await Confirmation.findOneAndDelete({ email })
    
        if (!confirmation) {
            logger.error(`/api/admin/user: Could not delete confirmation link for the user with the email: ${email}`)
            res.status(400)
            throw new Error(`Could not delete confirmation link for the user with the email: ${email}`)
        }
    }
    
    // Delete the user
    const user = await User.findOneAndDelete({ email })
    
    if (user) {
        logger.info("/api/admin/user: Successful user delete")
        res.status(204).json()
    } 
    else {
        logger.error("/api/admin/user: Unsuccessful user delete")
        res.status(400)
        throw new Error('Unsuccessful user delete')
    }
})

module.exports = {
    adminGetUser,
    adminCreateUser,
    adminDeleteUser,
    adminUpdateUser
}