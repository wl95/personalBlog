const express = require('express');
const router = express.Router();
const List = require('../models/List');
const Content = require('../models/Content');

var data = {};
router.use('/',(req,res,next) => {
    data = {
        userInfo: req.userInfo,
        lists: [],
        listId: req.query.listId || '',
        count:0,
        info:{}
    }
    
    if(data.listId){
        data.info.category = data.listId;
    }

    Content.where(data.info).count().then( count => {
        data.count = count;
        List.find().sort({updateTime:-1}).then( list => {
            data.lists = list;
            next();
        })
    });
})

router.get('/', (req,res,next) => {
    data.limit = 3;
    data.page = Number(req.query.page || 1);    // 当前页
    data.fewPages = 0;

    data.fewPages = Math.ceil(data.count / data.limit), // 总页数
    data.page = Math.min(data.page,data.fewPages);
    data.page = Math.max(data.page,1);
    let skip = (data.page - 1) * data.limit;

    Content.find().where(data.info).sort({updateTime:-1}).limit(data.limit).skip(skip).populate(['category','user']).then(headline => {
        data.headline = headline;
        res.render('main/index',data);
    })
})

router.get('/views',(req,res,next) => {
    var id = req.query.contentId;
    Content.findOne({
        _id:id
    }).then(content =>{
        data.content = content;
        content.views++;
        content.save();
        res.render('main/views',data);
    })
})

module.exports = router;