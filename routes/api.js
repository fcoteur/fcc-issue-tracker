'use strict';

var expect = require('chai').expect;
var express = require('express');
var router = express.Router();

var Issue = require('../models/issue');


router.get('/:project/', function (req, res) {
  res.sendFile(process.cwd() + '/views/issue.html');
});


router.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


router.get('/api/issues/:project', function (req, res){
  var project = req.params.project;
  let query = req.query;
  query.project_name = project;
  Issue.find(query,(err,docs) => {
    if (err) console.log(err);
    res.send(docs);
  });
  
});
  
router.post('/api/issues/:project', function (req, res){
  var project = req.params.project;
    
  var issue = new Issue(
    {
      project_name: project,
      issue_title: req.body.issue_title,
      issue_text: req.body.issue_text,
      created_by: req.body.created_by
  });
  issue.save(function (err) {
    if (err) { return console.log(err); }
    res.send(issue);
  });
  
});
    
router.put('/api/issues/:project', function (req, res){
  var project = req.params.project;
  //Returned will be 'successfully updated' or 'could not update '+_id. This should always update updated_on. If no fields are sent return 'no updated field sent'.
  Issue.findById({_id: req.body._id}, (err,doc) => {
    if (err) {
      console.log(err);
      res.send('could not find issue '+ doc._id);
    };
    
    if (req.body.lenght == 0) {
      res.send('no updated field sent');
    } else {
      for (let prop in req.body) {
        try {
          doc[prop] = req.body[prop];
          doc.updated_on = Date.now();
        } catch (err) {
          console.log(err);
        }
      }
      doc.save();
      res.send('successfully updated'); 
    }
  });
});
    
router.delete('/api/issues/:project', function (req, res){
  var project = req.params.project;
  if (!req.body._id) {
    res.send('_id error');
  } else {
    Issue.findByIdAndDelete({_id: req.body._id}, (err,doc) => {
    if (err) {
      console.log(err);
      res.send('could not delete '+ doc._id);
    };
    doc.open = req.body.open;
    doc.save();
    res.send('deleted '+ doc._id);
  });
  }
});
    

module.exports = router;