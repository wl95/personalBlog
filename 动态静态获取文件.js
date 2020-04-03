// 加载express模块
const express = require('express');
// 创建app应用
const app = express();

// 设置静态文件托管
app.use('./public',express.static(__dirname + '/public'));

// 加载模板处理模板
var swig = require('swig');

// 定义应用所使用的模板引擎
// 参数： 第一个是模板引擎的名称，同时也是文件的后缀，第二个参数表示
app.engine('html',swig.renderFile);
//设置模板文件存放的目录，第一个参数必须是views 第二个参数是目录
app.set('views','./views');
// 注册所需要使用的模板引擎，第一个参数必须是view engine 第一个参数和app.engine这个方法中定义的模板引擎的名称(第一个参数)是一致的
app.set('view engine','html');
// 在开发过程中，需要取消模板缓存
swig.setDefaults({cache:false});

app.get('/',(req, res, next) => {
    //res.send('<h1>你好小妹妹</h1>');
    /* 
        读取views下的指定文件，解析并返回给客户端
        第一个参数：表示模板的文件，相对于views目录 
        第二个参数：传递给模板使用的数据
    */
    res.render('index'); // 默认解析views/index.html文件
})

/* app.get('/main.css',(req,res,next) => {
    res.setHeader(
        "content-type","text/css"
    )
    res.send("body{background:#f60;}");
}) */

app.listen(8080,function(){
    console.log('loading...');
});
