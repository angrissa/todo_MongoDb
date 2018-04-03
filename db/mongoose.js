var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //use build-in js promises

// mongoose.connect('mongodb://localhost:27017/TodoApp');
// to be used in heroku - 
// Created acc on mongolab mlab.com
// created sandbox mongo in it
// set env variable in heroku MONGOLAB_URI
// see https://stackoverflow.com/questions/36321385/deploy-nodejs-mongodb-on-heroku-but-need-verify-credit-card-when-install-add-o_
var URI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/TodoApp';
console.log(URI); 
mongoose.connect(URI);
module.exports = {mongoose};