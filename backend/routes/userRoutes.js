/* 

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user.js'); // Adjust the path to your User model
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');

const router = express.Router(); // Use Router

router.post('/register', 
    [body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')],
    async (req, res) => {

    // check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        res.status(201).send('User created successfully');
    } catch (error) {
        res.status(400).send('Error creating user');
    }
});

// Add a POST route for login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({ error: 'Login failed' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        // User matched, create JWT payload
        const payload = { id: user.id, username: user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
        res.json({ success: true, token: `Bearer ${token}` });
    } else {
        res.status(401).json({ error: 'Password incorrect' });
    }
});


module.exports = router; // Export the router


*/ 