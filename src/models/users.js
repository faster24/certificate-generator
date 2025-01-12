const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username: { type: String , required: true , unique: true },
    email: { type: String , unique: true },
    password: { type: String , required: true }
},
    { timestamps: true }
)

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password , 10)
    next()
})

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password , this.password)
}

module.exports = mongoose.model('User', userSchema)