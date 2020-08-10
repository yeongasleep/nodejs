var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express(); // express를 실행하여 app을 초기화한다

mongoose.set('useNewUrlParser',true);
mongoose.set('useFindAndModify',false);
mongoose.set('useCreateIndex',true);
mongoose.set('useUnifiedTopology',true);
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;

db.once('open',function() {
    console.log('DB connected');
});

db.on('error',function() {
    console.log('DB ERROR: ', err);
});

app.set('view engine', 'ejs');  // ejs를 사용하기 위새 ejs를 설정
app.use(express.static(__dirname+'/public'));  // app.get과는 달리 메소드나 route에 상관없이
app.use(bodyParser.json());                    // 서버에 요청이 올 때마다 무조건 콜백함수 실행
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.use("/", require('./routes/home'));
app.use("/posts",require("./routes/posts"));

var port = 3000;
app.listen(port,function() { // app.listen부분은 서버가 실행되는 경우에 실행된다
    console.log('server on ! localhost:'+port);
});