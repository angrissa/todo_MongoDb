const {ObjectID} = require('mongodb');

const {mongoose} = require('./../db/mongoose.js');
const {Todo} = require('./../models/todo.js');

var id = '5abf3d42b4dbedf425553360';
var badId = '6abf3d42b4dbedf425553360';
var invId = '6abf3d42b4dbedf425553360333'; // invalid id

/*
Todo.find({
	_id: id
}).then((todos) => {
	console.log('Found records:', todos.length);
	console.log(todos)
});

Todo.findOne({
	_id: id
}).then((todo) => {
	console.log('findOne')
	console.log(todo)
});

Todo.findById(id).then((todo) => {
	console.log('Todo by id');
	console.log(todo);
});

*/
// bad id
Todo.find({
	_id: badId
}).then((todos) => {
//	if (todos.lengts == 0) {
	if (todos.length === 0) {	
		return console.log('Id not found');
	}
	console.log('Found records:', todos.length);
	console.log(todos)
});



Todo.findOne({
	_id: badId
}).then((todo) => {
	console.log('findOne')
	if (!todo) {
		return console.log('id not  found');
	}
	console.log(todo)
});

Todo.findById(badId).then((todo) => {
	console.log('Todo by id');
	if (!todo) {
		return console.log('id not  found');
	}	
	console.log(todo);
});

// invalid id
if (!ObjectID.isValid(invId)) {
	console.log('Object Id is not valid');
}

Todo.findById(invId).then((todo) => {
	console.log('Todo by id');
	if (!todo) {
		return console.log('id not  found');
	}	
	console.log(todo);
}).catch((e) => {
	console.log('Ivalid ID');
    console.log(e)
});
