const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// we need a schema if we want to add instance methods.
var UserSchema = new mongoose.Schema({
	email : {
		type : String,
		required: true,
		minlength: 1,
		trim: true,
		unique :true,
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
	tokens:[{
		access: {
			type : String,
			required: true
		},
		token: {
			type : String,
			required: true
		}
	}]
});

// Instance method. Note: error function can not be used, since err functions do not have access
// to the current object (means this). So it should be standard function()
UserSchema.methods.generateAuthToken = function () {
	var user = this;   // current object
	var access = 'auth';
	var token = jwt.sign({_id : user._id.toHexString(), access}, '123qwerty').toString();
	
	//user.tokens.push({access, token}); -- depending on MongoDB version it can work or not
	user.tokens = user.tokens.concat([{access, token}]);
	// we returning value that will be used in chain as a success value
	// note: it is NOT promise, it is VALUE
	return user.save().then(() => {
		return token;
	})
	
};

// Override - so we will send only open parts of the object
UserSchema.methods.toJSON = function() {
	var user = this;
	var userObject = user.toObject();
	return _.pick(userObject, ['_id', 'email']);
};

User = mongoose.model('User', UserSchema );

module.exports = {User};