const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
	if (err) {
		return console.log('Unable to connect to the server');
	};
	console.log('Connected to MongoDB server');

  db.collection('Todos').findOneAndUpdate(
		  {_id: new ObjectID('5a8d24353c8c906af6930d32')}, {
		$set: {
			completed : true
		}},
		{
		  returnOriginal : false	
		}).then((result) => {
			console.log(result);
		})
  // 5a798ab06d37084a88494c22
		
	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('5a798ab06d37084a88494c22')
	}, {
		$set : {name : 'Gribanov'},
		$inc : {age : -4}
	},
	{returnOriginal: false}).then((result) => {
		console.log(result);
	});
	
	db.close();
	
});