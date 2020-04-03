// 下载+引入express模块
const express = require('express');
//创建app应用
const app = express();
// 引入fs模块
const fs = require('fs');
// 引入path模块
const path = require('path');
// 加载cookies模块
const cookies = require('cookies');
// 引入body-parser
const bodyParser = require('body-parser');
// 加载数据库模块
const mongoose = require('mongoose');

const User = require('./models/User');

// 应用模板引擎
app.engine('html',require('swig').renderFile);

// 模板引擎存放的目录
app.set('views','./views');
app.set('view engine','html');

//设置静态文件托管
app.use('/public',express.static(path.resolve('public')));
// 设置bodyParser
const urlencodedExtended = bodyParser.urlencoded({ extended: true });

// 设置cookies 
app.use((req,res,next) => {
    req.cookies = new cookies(req,res);
    req.userInfor = {};
    if (req.cookies.get('userInfo')) {
        console.log(req.cookies.get('userInfo'))
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            User.findById(req.userInfo.username_id).then(function(userInfo){
                req.userInfo.isAdmin = userInfo.isAdmin;
                next(); 
            });
        }catch(e){
            next(); 
        }
    }else{
        next(); 
    }
})

app.use('/admin',require('./routers/admin'));
app.use('/api',urlencodedExtended,require('./routers/api'));
app.use('/',require('./routers/main'));

mongoose.connect("mongodb://localhost:27017/items",{useMongoClient: true},err =>{
    if(err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        app.listen('8001', () => console.log('listen this is 8001'));
    }
})
