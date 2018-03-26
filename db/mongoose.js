var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //use build-in js promises

mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};