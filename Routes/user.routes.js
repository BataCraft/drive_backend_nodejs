const express = require('express');
const bcrypt = require('bcrypt'); // Fix typo in `bcrypt`
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const userModels = require('../Models/user.model');

// Register route
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register',
    body('email').trim().isEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('username').trim().isLength({ min: 3 }),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, username } = req.body;

        try {
            const psdhash = await bcrypt.hash(password, 10);
            const newUser = await userModels.create({
                email,
                username,
                password: psdhash
            });

            res.json(newUser);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create user', details: err.message });
        }
    }
);

// Login route
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login',
    body('email').trim().isEmail(),
    body('password').trim().isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid data',
            });
        }

        const { email, password } = req.body;

        try {
            const user = await userModels.findOne({ email : email });

            if (!user) {
                return res.status(400).json({
                    message: 'Email or Password is incorrect!',
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    message: ' Password is incorrect!',
                });
            }

            const token = jwt.sign(
                {
                    userId: user._id,
                    email: user.email,
                },
                process.env.JWT_TOKEN, // Ensure JWT_TOKEN is defined in your .env file
                { expiresIn: '1h' } // Optional: Set token expiration
            );

            res.json({
                token,
                message: 'Login successful!',
            });
        } catch (err) {
            res.status(500).json({
                error: 'An error occurred during login',
                details: err.message,
            });
        }
    }
);

module.exports = router;
