const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const generateCertificate = async (userName, amount , donationId , createdAt ) => {
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
    ctx.fillStyle = '#2049E1'; // Text color
    ctx.textAlign = 'center';

    // Draw user name and donation amount onto the certificate
    const userText = `${userName}`;
    const amountText = `${amount} MMK`;
    const donationIdText = `${donationId}`;
    const createdAtText = `${createdAt}`;

    // Define the positions to draw the text
    const userX = canvas.width / 2;
    const userY = canvas.height / 2 + 143; // Adjust to fit on the image
    const amountX = canvas.width / 2;
    const amountY = canvas.height / 2 - 5;
    const donationIdX = canvas.width / 7 + 95;
    const donationIdY = canvas.height / 10 - 22;
    const createdAtX = canvas.width - 150;
    const createdAtY = canvas.height / 10 - 22;

    // Draw text on the image
    ctx.fillText(userText, userX, userY);
    ctx.fillText(amountText, amountX, amountY);
    ctx.fillText(donationIdText , donationIdX , donationIdY);
    ctx.fillText(createdAtText , createdAtX , createdAtY);

    // Generate output path with unique file name
    const outputPath = path.join(rootDir, 'public', 'storage', `donation-certificate-${Date.now()}.png`);

    // Ensure the storage directory exists, otherwise create it
    const storageDir = path.join(rootDir, 'public', 'storage');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });  // Ensure the directory is created
    }

    // Write the buffer to a file
    const buffer = canvas.toBuffer('image/png');
    await fs.promises.writeFile(outputPath, buffer);

    return outputPath;  // Return the path to the saved certificate
  } catch (error) {
    throw new Error(`Error generating certificate: ${error.message}`);
  }
};

module.exports = { generateCertificate };
