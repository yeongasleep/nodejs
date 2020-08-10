var mongoose = require('mongoose');

// DB에 정보를 어떠한 형식으로 저장할지 정한다
var postSchema = mongoose.Schema({
    title : {type:String,required:true},
    body : {type:String,required:true},
    createdAt : {type:Date,default:Date.now},
    updatedAt : {type:Date}
});

// 스키마의 모델을 생성한다
var Post = mongoose.model('post', postSchema);
module.exports = Post;