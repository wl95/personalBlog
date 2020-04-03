// 加载express模块
const express = require('express');
// 创建app应用
const app = express();

// 设置静态文件托管
app.use('./public',express.static(__dirname + '/public'));

//加载数据库模块
const mongoose = require('mongoose'); 

// 加载模板处理模板
const swig = require('swig');

// 定义应用所使用的模板引擎
// 参数： 第一个是模板引擎的名称，同时也是文件的后缀，第二个参数表示用于解析处理模板内容的方法
app.engine('html',swig.renderFile);
//设置模板文件存放的目录，第一个参数必须是views 第二个参数是目录
app.set('views','./views');
// 注册所需要使用的模板引注册所需要使用的模板引擎，第一个参数必须是view engine 第一个参数和app.engine这个方法中定义的模板引擎的名称(第一个参数)是一致的
app.set('view engine','html');
// 在开发过程中，需要取消模板缓存
swig.setDefaults({cache:false});

// 根据不同的功能划分模块
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
/* app.use('/',require('./public/main')); */

mongoose.connect('mongodb://localhost:27018/items',function(err){
    if(err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
    }
});

app.listen(8080,() => console.log('loading...'));
