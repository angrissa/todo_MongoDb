const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {Todo} = require('./../models/todo');
const {app} = require('./../server/server');

const todos = [{
	_id : new ObjectID(),
	text: 'First test case'
}, {
	_id : new ObjectID(),
	text : 'second test case',
	completed: true,
	completedAt: 12345
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

describe('GET /todos/:id', () => {
	it('Should return todo doc', (done) => {
		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(todos[0].text)
		}).end(done);
	});
	
	it('should return 404 if todo not found', (done) => {
	  var hexId = new ObjectID().toHexString();
	  request(app)
	  .get(`/todos/${hexId}`)
	  .expect(404)
	  .end(done);
	});
	
	it('should return 400 if todo id is invalid', (done) => {
		request(app).get('/todos/123')
		.expect(400)
		.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('Should remove a todo', (done) => {
		var hexId = todos[1]._id.toHexString();
		
		request(app)
		.delete(`/todos/${hexId}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo._id).toBe(hexId)
		}).end((err, res) => {
			if (err) { return done(err)};
			
			Todo.findById(hexId).then((todo) => {
				expect(todo).toNotExist();
				done();
			}).catch((e) => done(e));
			
		});
	});

	it('Should returm 404 if todo not found', (done) => {
		var hexId = new ObjectID().toHexString();
		
		request(app)
		.delete(`/todos/${hexId}`)
		.expect(404)
		.end(done);
	});
	
	it('Should return 404 if object id is invalid', (done) => {
		request(app)
		.delete('/todos/1234')
		.expect(404)
		.end(done);		
	});
	
});

describe('PATCH /todos/:id', () => {
	it('Should set Completed to TRUE', (done) => {
		var hexId = todos[0]._id.toHexString();
		var text = 'New patched text';
		request(app)
		.patch(`/todos/${hexId}`)
		.send({
			completed: true,
			text
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(true);
			expect(res.body.todo.completedAt).toBeA('number');
		})
		.end(done);
	});
	
	it('Should set completed to FALSE and completedAt to null', (done) => {
		var hexId = todos[1]._id.toHexString();
		var text = 'anothe text';
		request(app)
		.patch(`/todos/${hexId}`)
		.send({
			completed : false,
			text
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.completed).toBe(false);
			expect(res.body.todo.completedAt).toNotExist();
			expect(res.body.todo.text).toBe(text);
		})
		.end(done);
	})
}); 