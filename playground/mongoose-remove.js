const {ObjectID} = require('mongodb');

const {mongoose} = require('./../db/mongoose.js');
const {Todo} = require('./../models/todo.js');

var id = '5abf3d42b4dbedf425553360';
var badId = '6abf3d42b4dbedf425553360';
var invId = '6abf3d42b4dbedf425553360333'; // invalid id
/*
// removes all the data. Call to remove() will not work
// will return status and number of removed records
Todo.remove({}).then((result) => {
	console.log(result);
});
*/
// this call returns removed doc. Works like findOne
// Todo.findOneAndRemove

// works like findById, returns removed doc
Todo.findByIdAndRemove('5ac5886aa99bf9bfd11849d9').then((todo) => {
	console.log(todo);
});


