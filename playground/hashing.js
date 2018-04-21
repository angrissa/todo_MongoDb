const {SHA256} = require('crypto-js');
/*
var message = 'User number 3';
var hash = SHA256(message).toString();

console.log(`String: ${message}`);
console.log(`Hash: ${hash}`);

var data = {
		id : 4
};

var token = {
		data,
		hash: SHA256(JSON.stringify(data) + 'someSalt').toString()
};

var resultHash = SHA256(JSON.stringify(token.data) + 'someSalt').toString();

if (resultHash === token.hash) {
	console.log('Data was not changed');
} else {
	console.log('Data was changed');
}
*/

const jwt = require('jsonwebtoken');

var data = {
		id : 10
};

var token = jwt.sign(data, '123qwe');

console.log(token);

var decoded = jwt.verify(token, '123qwe');
console.log('Decoded :', decoded);