var env = process.env.NODE_ENV || 'development';

// console.log('ENV ++++++++++', env);

if (env === 'development') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
//	console.log('development', process.env.MONGODB_URI);
} else if (env === 'test') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
//	console.log('test', process.env.MONGODB_URI);	
} else {
	process.env.MONGODB_URI = process.env.MONGOLAB_URI;
//	console.log('production', process.env.MONGODB_URI);	
}

// console.log(process.env.MONGODB_URI);