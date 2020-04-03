const express = require('express');
const router = express.Router();
var User = require('../models/User');
var responData;
router.use((req,res,next) => {
    responData = {
        code:0,
        message:""
    }
    next();
});
//注册
router.post('/user/register',(req,res,next) =>{
    let username = req.body.username;
    let password = req.body.password;
    if(username === ''){
        responData.code = 1;
        responData.message = "用户名为空";
        res.json(responData);
        return;
    }
    if(password === ''){
        responData.code = 2;
        responData.message = "密码不能为空";
        res.json(responData);
        return;
    }
    if(req.body.password !== req.body.repassword){
        responData.code = 3;
        responData.message = "两次密码不一致";
        res.json(responData);
        return;
    }

    User.findOne({
        username:username
    }).then(userInfo =>{
        if( userInfo ){
            responData.code = 4;
            responData.message = "该用户名已经被注册了";
            res.json(responData);
            return;
        }
        // 保存用户信息
        var user = new User({
            username:username,
            password:password,
        });
        return user.save();
    }).then(newUserInfo =>{
        responData.message = '注册成功';
        res.json(responData);
    })
})
 
//登陆
router.post('/user/logIn',(req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    if(username === '' || password === ''){
        responData.code = 1;
        responData.message = "用户名和密码不能为空";
        res.json(responData);
        return;
    }
    User.findOne({
        username:username
    }).then(userInfo => {
        if(!userInfo){
            responData.code = 2;
            responData.message = "该用户不存在请注册后登陆";
            res.json(responData);
        }
        if(password !== userInfo.password){
            responData.code = 3;
            responData.message = "密码错误请重新输入";
            res.json(responData);
            return;
        }
        // 把信息存在cookies
        req.cookies.set('userInfo',JSON.stringify({
            username:userInfo.username,
            username_id:userInfo._id,
            username_createTime:userInfo.createTime
        }),{maxAge: 200});
        responData.message = "登陆成功正在跳转...";
        responData.userInfo = {
            username:userInfo.username,
            username_id:userInfo._id,
            username_createTime:userInfo.createTime
        }
        res.json(responData);
    });

})

// 退出
router.get('/user/logOut',(req,res,next) =>{
    console.log(req.query)
    // 把cookies信息存为null
    req.cookies.set('userInfo',null);
    responData.message = "退出";
    res.json(responData);
});

// 阅读全文

module.exports = router;