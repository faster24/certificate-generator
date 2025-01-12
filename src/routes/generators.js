const express = require('express');
const { createCanvas, loadImage } = require('canvas'); // For image manipulation
const path = require('path');
const router = express.Router();
const fs = require('fs');
const authenticateJWT = require('../middleware/auth.middleware'); 

router.get('/generate-certificate', async (req, res) => {
  const userName = req.query.name || 'John Doe';
  const amount = req.query.amount || 100;  // Fixed typo: "ammount" -> "amount"
  
  const rootDir = path.resolve(__dirname, '..');
  const certificateImagePath = path.join(rootDir, 'public', 'image', 'certificate.jpg');  // Ensure certificate.jpg exists

  try {
    const baseImage = await loadImage(certificateImagePath);

    // Create a canvas with the same dimensions as the base image
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext('2d');

    // Draw the base image onto the canvas
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Set text style for user name and donation amount
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = '#2049E1'; // Black text color
    ctx.textAlign = 'center';

    // Draw user name and donation amount onto the certificate
    const userText = `${userName}`;
    const amountText = `${amount} MMK`;

    // Define the positions to draw the text
    const userX = canvas.width / 2;
    const userY = canvas.height / 2 + 143; // Adjust to fit on the image
    const amountX = canvas.width / 2;
    const amountY = canvas.height / 2 - 5;

    // Draw text on the image
    ctx.fillText(userText, userX, userY);
    ctx.fillText(amountText, amountX, amountY);

    const outputPath = path.join(rootDir, 'public', 'storage', `donation-certificate${Date.now()}.png`);  // Ensure the file name is included

    // Ensure the storage directory exists, otherwise create it
    const storageDir = path.join(rootDir, 'public', 'storage');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });  // Ensure the directory is created
    }

    // Write the buffer to a file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFile(outputPath, buffer, (err) => {
      if (err) {
        console.error('Error saving certificate:', err);
        return res.status(500).send('Error saving certificate');
      }

      // Respond with the success message
      res.status(200).send(`Certificate saved successfully at: ${outputPath}`);
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).send('Error generating certificate');
  }
});

router.use(authenticateJWT); 

module.exports = router;
