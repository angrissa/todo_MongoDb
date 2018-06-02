var config = require('./config/config');

const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const { authinticate } = require('./midlleware/authinticate');


var { Todo } = require('./../models/todo');
var { User } = require('./../models/user');
var { mongoose } = require('./../db/mongoose');

//var {Todo} = require ('./models/Todo');
//var {User} = require('./models/User');


var app = express();
// to be used by Heroku
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// routes

app.post('/todos', authinticate, (req, res) => {
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        //console.log('Saved: ', doc)
        res.send(doc);

    }, (e) => {
        // console.log('Failed:', e)
        res.status(400).send(e);
    })
});

app.get('/todos', authinticate, (req, res) => {
    //Todo.find().then((todos) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', authinticate, (req, res) => {
    //res.send(req.params);
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        //console.log('Invalid ID');
        return res.status(400).send('Invalid ID');
    };
    //Todo.findById(id).then((todo) => {
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (todo) {
            return res.send({ todo });
        };
        return res.status(404).send();
    }, (e) => {
        res.status(404).send(e);
    }).catch((e) => {
        res.status(404).send();
    });
});

app.delete('/todos/:id', authinticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    };

    //Todo.findByIdAndRemove(id).then((todo) => {
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        };
        res.status(200).send({ todo });
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

/*
app.get('/users/me', (req, res) => {
    var token = req.header('x-auth');

    User.findByToken(token)
        .then((user) => {
            if (!user) {
                //res.status(401).send();
                return Promise.reject();
            };
            res.send(user);

        }).catch((e) => {
            res.status(401).send(); // 401 - auth required
        });
});
*/


app.get('/users/me', authinticate, (req, res) => {
    // authinticate modified req, so...
    res.send(req.user);
});

app.patch('/todos/:id', authinticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    };

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    };


    //Todo.findByIdAndUpdate(id, {
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {
        $set: body
    }, { new: true }).then((todo) => {
        if (!todo) {
            res.status(400).send();
        }
        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    })


});

//------------------USERS
// Loging users/login {email, password}
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    //var user = User.findOne()
    User.findByCredentials(body.email, body.password).then((user) => {
        //
        //res.status(200).send(user);
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
    //res.send(body);

});

// logout - all we need is to delete token for the currently logged in user
app.delete('/users/me/token', authinticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })

});

app.post('/users', (req, res) => {
    //console.log(req.body);
    var body = _.pick(req.body, ['email', 'password']);
    //var user = new User({
    //		email : req.body.email,
    //password: req.body.password
    //});

    var user = new User(body);

    user.save().then(() => { // ((user) => {   we work with the local variable user so...
        // res.send(user);
        return user.generateAuthToken(); // actually returns token

    }, (e) => {
        // console.log('Failed:', e)
        res.status(400).send(e);
    }).then((token) => {
        // headers that starts with "x-" are the custom headers. we create our header for authorisation 
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});


app.listen(port, () => {
    console.log(`Started on port ${port}`);
})

// For tests
module.exports = { app };



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