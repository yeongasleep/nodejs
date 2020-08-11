var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
    username : {
        type:String,
        required:[true,'Username is required!!'],
        match:[/^.{4,12}$/,'Should be 4-12 characters!'],
        trim:true,
        unique:true
    },
    password : {
        type:String,
        required:[true,'Password is required!!'],
        select:false
    },
    name : {
        type:String,
        required:[true,'Name is required!!'],
        match:[/^.{4,12}$/,'Should be 4-12 characters!'],
        trime:true
    },
    email : {
        type:String,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Should be a vaild email address!'],
        trim:true
    }
}, {
    toObject : {virtuals : true}
});

userSchema.virtual('passwordConfirmation')
    .get(function() {return this._passwordConfirmation;})
    .set(function(value) {this._passwordConfirmation=value});

userSchema.virtual('originalPassword')
    .get(function() {return this._originalPassword;})
    .set(function(Value) {this._originalPassword=value;});

userSchema.virtual('currentPassword')
    .get(function() {return this.currentPassword;})
    .set(function(value) {this.currentPassword=value});

userSchema.virtual('newPassword')
    .get(function() {return this.newPassword;})
    .set(function(Value) {this.newPassword=value;});

var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = 'Should be minimum 8 characters of alphabet and number combination!';


//password를 DB에 생성,수정하기 전에 값이 유효한지 확인한다
userSchema.path('password').validate(function(v) {
    var user = this;

    if(user.isNew) {
        if(!user._passwordConfirmation) {
            user.invalidate('passwordConfirmation','Password Confirmation is required.');
        }
        if(!passwordRegex.test(user.password)) {
            user.invalidate('password',passwordRegexErrorMessage);
        }
        else if(user.password !== user._passwordConfirmation) {
            user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!!');
        }
    }

    if(!user.isNew) {
        if(!user.currentPassword) {
            user.invalidate('currentPassword','Current Password is required!!');
        }
        else if(!bcrypt.compareSync(user.currentPassword, user._originalPassword)) {
            user.invalidate('currentPassword','Current Password is invalid!!');
        }
        if(user.newPassword && !passwordRegex.test(user.newPassword)) {
            user.invalidate("newPassword",passwordRegexErrorMessage);
        }
        else if(user.newPassword !== user._passwordConfirmation) {
            user.invalidate('passwordConfirmation','Password Confirmation does not matched!!');
        }
    }
});

// Schema.pre함수는 첫번째 인수로 설정된 event가 발생전에 먼저
// 콜백함수를 실행한다
// 'save' 이벤트는 Model.create, Model.save함수 실행시 발생 
userSchema.pre('save',function(next) {
    var user = this;
    if(!user.isModified('password')) {
        return next();
    }
    else {
        user.password = bcrypt.hashSync(user.password);
        return next();
    }
});

userSchema.methods.authenticate = function(password) {
    var user = this;
    return bcrypt.compareSync(password,user.password);
};

var User = mongoose.model('user',userSchema);
module.exports = User;