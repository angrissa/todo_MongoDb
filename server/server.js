var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


var {Todo} = require ('./../models/todo');
var {User} = require('./../models/user');
var {mongoose} = require('./../db/mongoose');

//var {Todo} = require ('./models/Todo');
//var {User} = require('./models/User');


var app = express();
// to be used by Heroku
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// routes

app.post('/todos', (req,res) => {
	//console.log(req.body);
	var todo = new Todo({
		text : req.body.text
	});
	
	todo.save().then((doc) => {
		  //console.log('Saved: ', doc)
		  res.send(doc);
		
	}, (e) => {
		// console.log('Failed:', e)
		res.status(400).send(e);
	})
});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos/:id', (req, res) => {
	//res.send(req.params);
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		//console.log('Invalid ID');
		return res.status(400).send('Invalid ID');
	};
	Todo.findById(id).then((todo) => {
		if (todo) {
		  return res.send({todo});
		 };
		 return res.status(404).send();
	}, (e) => {
		res.status(404).send(e);
	}).catch((e) => {
		res.status(404).send();
	});
});

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	};
	
	Todo.findByIdAndRemove(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		};
		res.status(200).send({todo});
	}, (e) => {
		res.status(400).send();
	}).catch((e) => {
		res.status(400).send();
	});
});

/*
app.listen(3000, () => {
	console.log('Started on port 3000');
})
*/

app.listen(port, () => {
	console.log(`Started on port ${port}`);
})

// For tests
module.exports = {app};



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