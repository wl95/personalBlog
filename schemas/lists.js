
const mongoose = require('mongoose');
const moment = require('moment');

// 列表结构
module.exports = new mongoose.Schema({
    //列表名
    listname:String,
    updateTime: {  
        type: Date,  
        default: new Date()
    }
})