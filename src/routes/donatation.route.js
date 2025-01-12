const express = require('express');
const Donation = require('../models/donations');
const router = express.Router();
const { generateCertificate } = require('../service/certificateService')
const { nanoid } = require('nanoid');
const authenticateJWT = require('../middleware/auth.middleware'); 

// POST - Create a new donation
router.post('/donation', async (req, res) => {
  try {
    const { donator, email, amount, payment_type } = req.body;

    const donation_id = `${nanoid(5)}-${Date.now()}`;
    const createdAt = new Date().toLocaleDateString('en-GB');

    const certificatePath = await generateCertificate(donator , amount , donation_id , createdAt);

    const newDonation = new Donation({
      donation_id,
      donator,
      email,
      amount,
      certificate_path: certificatePath,
      payment_type
    });

    await newDonation.save();

    res.status(201).json({ message: 'Donation created successfully', donation: newDonation });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET - Fetch all donations
router.get('/donations', async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET - Fetch a specific donation by ID
router.get('/donations/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    res.status(200).json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Protect donation routes
router.use(authenticateJWT); 

module.exports = router;
