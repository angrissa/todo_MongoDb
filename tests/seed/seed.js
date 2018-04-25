const { ObjectID } = require('mongoDB');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
        _id: userOneId,
        email: 'angri@outlook.com',
        password: 'userOnePsw',
        tokens: [{
            access: 'auth',
            token: jwt.sign({ _id: userOneId, access: 'auth' }, '123qwerty').toString()
        }]
    },
    { // this user does not have tokens - to test
        _id: userTwoId,
        email: 'angri123@outlook.com',
        password: 'userTwoPsw',
    }
];

const todos = [{
    _id: new ObjectID(),
    text: 'First test case'
}, {
    _id: new ObjectID(),
    text: 'second test case',
    completed: true,
    completedAt: 12345
}];

const populateTodos = (done) => {
    //Todo.remove({}).then(() => {
    //		done();
    // need predefined set of data
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}) // clear all
        .then(() => {
            var userOne = new User(users[0]).save(); // psw will be hashed
            var userTwo = new User(users[1]).save(); // psw will be hashed

            return Promise.all([userOne, userTwo]);
        }).then(() => {
            done();
        });
};

module.exports = { todos, populateTodos, users, populateUsers };