const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
	if (err) {
		return console.log('Unable to connect to the server');
	};
	console.log('Connected to MongoDB server');

	// deleteMany
/*	
	db.collection('Todos').deleteMany({text:'Third to do'}).then((result) => {
		console.log(result);
	});
*/	
	/*
	//deleteOne
	db.collection('Todos').deleteOne({text:'Third to do'}).then((result) => {
		console.log(result);
	});	
*/
/*
	// findOneAndDelete
	db.collection('Todos').findOneAndDelete({completed:false}).then((result) => {
		console.log(result);
	});
	
*/
	db.collection('Users').findOneAndDelete({_id: new ObjectID('5a798a7b11145928500b20ec')}).then (
			(result) => {
				console.log(result);
			});
	
	
	db.close();
	
});