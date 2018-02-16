//const MongoClient = require('mongodb').MongoClient;

/*
// Object destructuring - getting object property into variable
var user = {name : 'John', age: 33};
var {name} = user;  //var in brackets, it takes value from class
console.log(name);
user.name = 'Josh';
console.log(name); // name still John. So it is equal to name = user.name?
console.log(user);
*/

const {MongoClient, ObjectId} = require('mongodb');
/* Manually create objectId
var obj = new ObjectId();

console.log(obj);
*/

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
	if (err) {
		return console.log('Unable to connect to the server');
	};
	console.log('Connected to MongoDB server');
	/*
	db.collection('Todos').insertOne({
		text: 'Something to do',
		completed: false
	}, (err, result) => {
		if (err) {
			return console.log('Unable to insert todo', err);
		}
		
		console.log(JSON.stringify(result.ops, undefined, 4));
	});
	
	*/
	/*
	
	db.collection('Users').insertOne({
		name: 'Andrei',
		age: 64,
		location: 'Pacific Pines'
	}, (err, result) => {
		if (err) {
			return console.log('Unable to insert user', err);
		}
		
		console.log(JSON.stringify(result.ops, undefined, 4));
		console.log(result.ops[0]._id.getTimestamp());
	});
	
		*/
	db.close();
	
});