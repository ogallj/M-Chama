// server.js

// Import dependencies
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Define the port for the backend server
const PORT = process.env.PORT || 3000;

// STK Push endpoint
app.post('/payment', async (req, res) => {
    const { phoneNumber, amount } = req.body;

    // Here you will connect with M-Pesa's API to initiate the STK Push
    try {
        const response = await initiateSTKPush(phoneNumber, amount);
        res.status(200).json({ success: true, message: 'Payment initiated', response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Payment failed', error: error.message });
    }
});

// A function to initiate the STK Push
async function initiateSTKPush(phoneNumber, amount) {
    // Safaricom's M-Pesa API URL for STK Push
    const url = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    // Safaricom API credentials and details
    const headers = {
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    };

    // The body of the request to initiate STK Push
    const body = {
        Shortcode: process.env.SHORTCODE,
        LipaNaMpesaOnlineShortcode: process.env.SHORTCODE,
        LipaNaMpesaOnlineLipaNaMpesaOnlineKey: process.env.PAYBILL_KEY,
        PhoneNumber: phoneNumber,
        Amount: amount,
        // Any other required fields...
    };

    // Make the HTTP request to M-Pesa
    try {
        const response = await axios.post(url, body, { headers });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to initiate STK Push: ${error.message}`);
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
