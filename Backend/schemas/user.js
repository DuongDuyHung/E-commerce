let mongoose = require('mongoose')
let bcrypt = require('bcrypt')
let userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username da ton tai"],
        required: [true, "username la truong bat buoc"],
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        default: ""
    },
    avatarUrl: {
        type: String,
        default: ""
    },
    status: {
        type: Boolean,
        default: false
    }, loginCount: {
        type: Number,
        default: 0,
        min: 0
    }, role: {
        type: mongoose.Types.ObjectId,
        ref: 'role',
        required: true
    },
    resetPasswordToken: String,
    resetPasswordTokenExp: Date
}, {
    timestamps: true
})
userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        let salt = bcrypt.genSaltSync(10);
        let encrypted = bcrypt.hashSync(this.password, salt);
        this.password = encrypted;
    }
    next();
})

module.exports = mongoose.model('user', userSchema)
/*
username: string, unique, required
password: string,required
email: string, required, unique
fullName:string, default: ""
avatarUrl:string, default: ""
status: boolean, default: false
role: Role,
loginCount: int, default:0, min=0
timestamp
*/