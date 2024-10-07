const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

app.post('/submit-issue', (req, res) => {
    const { email, issue } = req.body;
    console.log('Received request:', { email, issue });

    if (!email || !issue) {
        console.log('Missing required fields');
        return res.status(400).json({ message: 'Email and issue are required fields.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.SUPPORT_EMAIL,
        subject: 'New Support Issue',
        text: `From: ${email}\n\nIssue: ${issue}`
    };

    console.log('Attempting to send email with options:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({
                message: 'An error occurred while submitting your issue.',
                error: error.message
            });
        }
        
        console.log('Email sent successfully:', info.response);
        res.status(200).json({
            message: 'Your issue has been submitted successfully.',
            info: info.response
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});