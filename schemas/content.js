const mongoose = require('mongoose');
const moment = require('moment');

// 列表结构
module.exports = new mongoose.Schema({
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"List"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    //文章标题
    headline:String,
    // 文章简介
    intro:{
        type:String,
        default:''
    },
    // 文章创建时间
    updateTime: {  
        type: Date,  
        default: new Date()
    },
    //文章阅读量
    views:{
        type:Number,
        default:0
    },
    // 文章内容
    content:{
        type:String,
        default:''
    }
})
