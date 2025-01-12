const mongoose = require('mongoose')

const PAYMENT = {
    "NUG_PAY": "NUG_PAY",
    "SDC_PAY": "SDC_PAY",
    "WAVE_MONEY": "WAVE_MONEY",
    "KBZ_PAY": "KBZ_PAY",
    "THAI_BANK": "THAI_BANK",
};

const donationSchema = new mongoose.Schema({
    donation_id: { type: String, unique: true, required: true },
    donator: { type: String , required: true },
    email: { type: String  , required: true },
    amount: { type: Number , required: true },
    certificate_path: { type: String , require: true },
    payment_type: {
        type: String,
        enum: Object.values(PAYMENT),
        required: true,
        default: PAYMENT.NUG_PAY
    },
},
    { timestamps: true }
)

module.exports = mongoose.model('Donation', donationSchema)
