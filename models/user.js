const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// we need a schema if we want to add instance methods.
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// Instance method. Note: error function can not be used, since err functions do not have access
// to the current object (means this). So it should be standard function()
UserSchema.methods.generateAuthToken = function() {
    var user = this; // current object
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, '123qwerty').toString();

    //user.tokens.push({access, token}); -- depending on MongoDB version it can work or not
    user.tokens = user.tokens.concat([{ access, token }]);
    // we returning value that will be used in chain as a success value
    // note: it is NOT promise, it is VALUE
    return user.save().then(() => {
        return token;
    })

};

// Instance method 
UserSchema.methods.removeToken = function(token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {
                token: token
            }

        }
    });
};

// Override - so we will send only open parts of the object
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

// override for class methods
UserSchema.statics.findByToken = function(token) {
    var User = this; // it is model, not instance!
    var decoded;

    try {
        decoded = jwt.verify(token, '123qwerty');

    } catch (e) {
        //return new Promise((resolve, reject) => {
        //    reject();
        return Promise.reject(); // the same as above
    };

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        // bcrypt does not support promises, it uses callbacks. S we need to return
        // a new Promise, where we will be able to use bcrypt
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }

            });
        });
    });
};

UserSchema.pre('save', function(next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
});

User = mongoose.model('User', UserSchema);

module.exports = { User };