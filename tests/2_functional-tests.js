/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var Issue = require('../models/issue');


chai.use(chaiHttp);

// injection of test issue in the database
let test_id; 
var issue = new Issue(
    {
        project_name: 'test',
        issue_title: 'test title',
        issue_text: 'test text',
        created_by: 'pako'
    });
issue.save((err, doc) => {
  if (err) {
    console.log(err);
  } else {
    test_id = doc._id;
  }
}); 


suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'pako',
          assigned_to: 'Chait',
          status_text: 'In'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'pako');
          assert.equal(res.body.assigned_to, 'Chait');
          assert.equal(res.body.status_text, 'In');                   
          done();
        }); 
      });
      
      test('Required fields filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'pako'
        }) 
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'pako');            
          done();  
        });
      });
      
      test('Missing required fields', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_text: 'text',
          created_by: 'Functional'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(Object.keys(res.body).length, 0);
          done();
        });
      }); 
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(Object.keys(res.body).length, 0);
          done();
        });
      });
      
      let randomTxt = Math.random() + 'abc';
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: test_id,
          created_by: randomTxt
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.created_by, randomTxt);
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: test_id,
          status_text: randomTxt + 'efg',
          issue_text: randomTxt + 'hij'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.status_text, randomTxt+ 'efg');
          assert.equal(res.body.issue_text, randomTxt+ 'hij');
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({open: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          for (let i = 0 ; i < res.body.length ; i++) {
            assert.equal(res.body[i].open, true);            
          }
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          open: true,
          created_by: 'pako'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          for (let i = 0 ; i < res.body.length ; i++) {
            assert.equal(res.body[i].open, true);
            assert.equal(res.body[i].created_by, 'pako'); 
          }
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(Object.keys(res.body).length, 0);
          done();
        });
      }); 
     
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({ _id: test_id})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body._id, test_id);
          done();
        });
      });
     
    });
});
