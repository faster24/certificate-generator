const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to the Database')
    } catch (error) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB
