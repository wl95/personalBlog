
const mongoose = require('mongoose');
const moment = require('moment');
// 用户表结构
module.exports = new mongoose.Schema({
    //用户名
    username:String,
    //密码
    password:String,
    createTime:{
        type: Date,  
        default: new Date()
    },
    updateTime: {  
        type: Date,  
        default: new Date()
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
})