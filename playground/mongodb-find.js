const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
	if (err) {
		return console.log('Unable to connect to the server');
	};
	console.log('Connected to MongoDB server');

    // db.collection('Todos').find(); // returns cursor
	// find() returns cursor
	// toArray returns promise
	db.collection('Todos').find().toArray().then((docs) => {
		console.log('TODOs');
		console.log(JSON.stringify(docs, undefined, 4));
	}, (err) => {
		console.log('Cannot fetch todos', err);
	});
	
	db.collection('Todos').find({completed:false}).toArray().then((docs) => {
		console.log('TODOs');
		console.log(JSON.stringify(docs, undefined, 4));
	}, (err) => {
		console.log('Cannot fetch todos', err);
	});	
	
	// by _id
	db.collection('Todos').find({
      _id : new ObjectID('5a76630641cff217682d6ba1')
      }).toArray().then((docs) => {
		console.log('TODOs');
		console.log(JSON.stringify(docs, undefined, 4));
	}, (err) => {
		console.log('Cannot fetch todos', err);
	});	
	
	
	db.collection('Todos').find().count().then((count) => {
		console.log(`TODOs count: ${count}`);
	}, (err) => {
		console.log('Cannot get todos count', err);
	});
		

	db.collection('Users').find({name:'Andrei'}).toArray().then((docs) => {
		console.log('USERS');
		console.log(JSON.stringify(docs, undefined, 4));
	}, (err) => {
		console.log('Cannot fetch todos', err);
	});		
	
	db.close();
	
});