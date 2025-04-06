let mongoose = require('mongoose')
let roleSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true,
    },description:{
        type:String,
        default:""
    }
},{
    timestamps:true
})
module.exports = mongoose.model('role',roleSchema)
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