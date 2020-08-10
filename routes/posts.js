var express = require('express');  // express 모듈을 불러와서 변수에 담는다
var router = express.Router(); 
var Post = require('../models/Post');

router.get('/',function(req,res) {  // 서버에 get요청이 있는 경우에 실행한다
    Post.find({}).sort('-createdAt').exec(function(err,posts) {
        if(err)
            return res.json(err);
        res.render('posts/index',{posts:posts});
    });
});

router.get('/new',function(req,res) {
    res.render("posts/new");
});

router.post('/',function(req,res) {
    Post.create(req.body,function(err,post) {
        if(err)
            return res.json(err);
        res.redirect('/posts');
    });
});

router.get("/:id",function(req,res) {
    Post.findOne({_id:req.params.id},function(err,post) {
        if(err)
            return res.json(err);
        res.render("posts/show",{post:post});
    })
})

router.get("/:id/edit",function(req,res) {
    Post.findeOne({_id:req.params.id},function(err,post) {
        if(err)
            return res.json(err);
        res.render("posts/edit",{post:post});
    });
});

router.put("/:id",function(req,res) {
    req.body.updateAt = Date.now();
    Post.findOneAndUpdate({_id:req.param.id}, req.body, function(err,post) {
        if(err)
            return res.json(err);
        res.redirect("/posts/"+req.params.id);
    });
});

router.delete("/:id",function(req,res) {
    Post.deleteOne({_id:req.params.id},function(err) {
        if(err)
            return res.json(err);
        res.redirect("/posts");
    });
});

module.exports = router;