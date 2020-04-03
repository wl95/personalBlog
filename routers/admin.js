const express = require('express');
const router = express.Router();
const User = require('../models/User');
const List = require('../models/List');
const Content = require('../models/Content');
const bodyParser = require('body-parser');
const urlencodedExtended = bodyParser.urlencoded({extended:true});

router.use((req,res,next) => {
    if(!req.userInfo.isAdmin){
        res.send('对不起，只有管理员才能进入管理');
        return;
    }
    next();
})

router.get('/',(req,res) => {
    res.render('admin/index',{
        userInfo:req.userInfo,
    });
})

// 获取数据库内容
router.get('/user',(req,res) => {
    const userUrl = require('path').parse(req.url).base.split('?')[0];
    pagePrvNext(req,res,userUrl,4,User,'istration');
})

// 分类首页

router.get('/featured',(req,res) => {
    const userUrl = require('path').parse(req.url).base.split('?')[0];
    //获取数据limit 是获取几条数据  skip() 忽略数据的条数 
    pagePrvNext(req,res,userUrl,8,List,'featured');
});

function pagePrvNext(req,res,userUrl,num,List,rot){
    let limit = num;
    List.count().then(count => {
        // 总页数
        let fewPages = Math.ceil(count / limit);
        // 当前页
        let page = Number(req.query.page || 1);
        page = Math.min(page,fewPages);
        page = Math.max(page,1);
        let skip = (page - 1) * limit;
        List.find().sort({_id:-1}).limit(limit).skip(skip).then((users) => {
            res.render('admin/'+ rot,{
                userInfo:req.userInfo,
                count:count,
                limit:limit,
                fewPages:fewPages,
                page:page,
                users:users,
                pageUrl:userUrl
            });
        })
    });
}

// 分类添加
router.get('/addclassify',(req,res) => {
    res.render('admin/addclassify',{
        userInfo:req.userInfo
    });
});

router.post('/addclassify',urlencodedExtended,(req,res) => {
    const stcname = req.body.stcname;
    if(!stcname){
        res.render('admin/error',{
            userInfo:req.userInfo,
            code:1,
            msg: "输入的分类不能为空"
        });
        return;
    }

    List.findOne({
        listname:stcname
    }).then(lists => { 
        if(lists){
            res.render('admin/error',{
                userInfo:req.userInfo,
                code:2,
                msg: "该分类已存在"
            });
        } else {
            var list = new List({
                listname:stcname
            })
            list.save();
            res.render('admin/success',{
                code:0,
                msg: stcname,
                userInfo:req.userInfo
            });
        }
    })
    
});

// 分类修改

router.get('/amend',(req,res) => {
    const amendId = req.query.id || '';
     List.findOne({
        _id:amendId
     }).then(lists => {
        if(!lists){
            res.render('admin/error',{
                userInfo:req.userInfo,
                msg: "分类信息不存在"
            });
        } else {
            res.render('admin/amend',{
                userInfo:req.userInfo,
                lists:lists
            });
        }
    })
})

// 分类修改保存
router.post('/amend',urlencodedExtended,(req,res) => {
    let id = req.query.id || '';
    let name = req.body.stcname || '';
    // 在数据库中查找的当前提交过来的ID
    List.findOne({
        _id:id
     }).then(lists => {
        if(!lists){
            res.render('admin/error',{
                userInfo:req.userInfo,
                msg: "分类信息不存在"
            });
            return Promise.reject();
        } else {
            // 如果直接提交没有更改则输出保存成功
            if(lists.listname === name){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    msg: "你的信息保存成功"
                });
                return Promise.reject();
            } else {
                // 查看数据库是否有当前的名字并且与当前id不一样
                return List.findOne({
                    _id:{$ne:id},
                    listname:name
                })
            }
        }
    }).then(find => {
        if(find) {
            res.render('admin/error',{
                userInfo:req.userInfo,
                msg: "分类已存在"
            });
            return Promise.reject();
        } else {
            // 修改_id为id的分类名字
            return List.update({
                _id:id
            },{
                listname:name
            })
        }
    }).then(() => {
        res.render('admin/success',{
            userInfo:req.userInfo,
            msg: "你的信息保存成功"
        });
    })
})

// 分类删除

router.get('/delete',(req,res) => {
    const deleteId = req.query.id;
    List.remove({
        _id:deleteId
    }).then(lists => {
        res.render('admin/success',{
            userInfo:req.userInfo,
            msg:'删除成功'
        });
    })
})

// 文章首页

router.get('/article',(req,res) => {
    
    let limit = 4;
    Content.count().then(count => {
        // 总页数
        let fewPages = Math.ceil(count / limit);
        // 当前页
        let page = Number(req.query.page || 1);
        page = Math.min(page,fewPages);
        page = Math.max(page,1);
        let skip = (page - 1) * limit;
        Content.find().sort({_id:-1}).limit(limit).skip(skip).populate(['category','user']).then(content => {
            res.render('admin/article',{
                userInfo:req.userInfo,
                content:content,
                limit:limit,
                fewPages:fewPages,
                page:page,
                count:count
            });
        })
    });

});

// 文章添加
router.get('/addarticle',(req,res) => {

    List.find().sort({_id:-1}).then(data => {
        res.render('admin/addarticle',{
            userInfo:req.userInfo,
            lists:data
        });
    })

});
// 文章添加到数据库
router.post('/addarticle',urlencodedExtended,(req,res) => {
    if(!req.body.headline){
        res.render('admin/error',{
            userInfo:req.userInfo,
            msg: "文章标题不能为空"
        });
        return;
    }

    if(!req.body.content){
        res.render('admin/error',{
            userInfo:req.userInfo,
            msg: "文件简介不能为空"
        });
        return;
    }

    if(!req.body.content){
        res.render('admin/error',{
            userInfo:req.userInfo,
            msg: "文章内容不能为空"
        });
        return;
    }
    // 保存文章内容
    new Content({
        user:req.userInfo.username_id,
        category:req.body.category,
        headline:req.body.headline,
        intro:req.body.intro,
        content:req.body.content
    }).save().then(content => {
        res.render('admin/success',{
            userInfo:req.userInfo,
            msg: "文章添加成功"
        });
    })

})

// 文章修改
router.get('/article_amend',(req,res) => {
    let id = req.query.id || '';
    Content.findOne({
        _id:id
    }).then(content => {
        if(!content){
            res.render('admin/error',{
                userInfo:req.userInfo,
                msg: "文章不存在"
            });
            return Promise.reject();
        } 
        List.find().sort({_id:1}).then( list =>{
            res.render('admin/article_amend',{
                userInfo:req.userInfo,
                lists:list,
                content:content
            })
        } )
    })
})

// 提交修改完的
router.post('/article_amend',urlencodedExtended,(req,res) => {

    var id = req.query.id || '';
    Content.findOne({
        _id:id
    }).then(contents => {

        if(!contents){
            res.render('admin/error',{
                userInfo:req.userInfo,
                msg: "文章不存在不能修改"
            });
        }
        Content.update({
            _id:id
        },{
            category:req.body.category,
            headline:req.body.headline,
            intro:req.body.intro,
            content:req.body.content
        }).then(file => {
            res.render('admin/success',{
                userInfo:req.userInfo,
                msg: "文章添加成功"
            });
        })
    })
})

// 删除
router.get('/article_delete',(req,res) => {
    const deleteId = req.query.id;
    Content.remove({
        _id:deleteId
    }).then(contents => {
        res.render('admin/success',{
            userInfo:req.userInfo,
            msg:'删除成功'
        });
    })
})

module.exports = router;