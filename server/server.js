var express = require('express');
var bodyParser = require('body-parser');


var {Todo} = require ('./../models/todo');
var {User} = require('./../models/user');
var {mongoose} = require('./../db/mongoose');

//var {Todo} = require ('./models/Todo');
//var {User} = require('./models/User');


var app = express();

app.use(bodyParser.json());

// routes

app.post('/todos', (req,res) => {
	console.log(req.body);
	var todo = new Todo({
		text : req.body.text
	});
	
	todo.save().then((doc) => {
		  console.log('Saved: ', doc)
		  res.send(doc);
		
	}, (e) => {
		console.log('Failed:', e)
		res.status(400).send(e);
	})
});

app.listen(3000, () => {
	console.log('Started on port 3000');
})




// create models



//var newTodo = new Todo({
//	text: 'Cook dinner'
//});
/*
var newTodo = new Todo({
	text: 'Cook another dinner',
	completed: false,
	completedAt: 21.30
});
*/
/*
var newTodo = new Todo({
	text: '  Check validators   '
});


newTodo.save().then((doc) => {
	console.log('Saved ', doc)
}, (e) => {
	console.log('Failed: ', e)
});

*/

/*
var newUser = new User({
	email: 'angri@outlook.com'
});

newUser.save().then((doc) => {
	console.log(JSON.stringify(doc, undefined, 4));
}, (e) => {
	console.log('Error: ', e)
});

*/