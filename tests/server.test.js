const expect = require('expect');
const request = require('supertest');

const {Todo} = require('./../models/todo');
const {app} = require('./../server/server');

const todos = [{
	text: 'First test case'
}, {
	text : 'second test case'
}];

// we need empty db for testing
beforeEach((done) => {
//Todo.remove({}).then(() => {
//		done();
	// need predefined set of data
	Todo.remove({}).then(() => {
	  return Todo.insertMany(todos)
	}).then(() => done());
});

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
	  var text = 'Test todo text';
	  
	  request(app)
	    .post('/todos')
	    .send({text})
	    .expect(200)
	    .expect((res) => {
	    	expect(res.body.text).toBe(text)
	    })
	    .end((err, res) => {
	      if (err) {
	    	  return done(err);
	      }	
	      
//	      Todo.find().then((todos) => {
	      Todo.find({text}).then((todos) => {  // now we need to look for the first record only	      
	    	  expect(todos.length).toBe(1);
	    	  expect(todos[0].text).toBe(text);
	    	  done();
	      }).catch((e) => done(e));
	    });
	});
	
	it('should not create todo with invalid body daya', (done) => {
		request(app)
		.post('/todos')
		.send({})
		.expect(400)
		.end((err, res) => {
			if (err) {
				return done(err);
			};
			
		   Todo.find().then((todos) => {
			 expect(todos.length).toBe(2); // now it is not 0, it is 2 recs from array
			 done();
		   }).catch((e) => done(e));
		});
	});
});

describe('GET /todos', () => {
	it('should get all (2) todos', (done) => {
		request(app)
		  .get('/todos')
		  .expect(200)
		  .expect((res) => {
			  expect(res.body.todos.length).toBe(2);
		  }).end(done);
	})
});