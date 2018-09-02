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
  
router.post('/api/issues/:project', function x(req, res){
  var project = req.params.project;  

  if ((req.body.issue_title) && (req.body.issue_text) && (req.body.created_by)) {
    var issue = new Issue(
      {
        project_name: project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by
    });
    if (req.body.assigned_to) {issue.assigned_to = req.body.assigned_to}
    if (req.body.status_text) {issue.status_text = req.body.status_text}

    issue.save(function (err) {
      if (err) {
        console.log(err.name);
        if (err.name == 'ValidationError') {
          console.log(err.name);
        } else {
        return console.log(err);
        }
      }
      res.send(issue);
    });
  } else {
    res.end();
  }
});
    
router.put('/api/issues/:project', function (req, res){
  var project = req.params.project;
  
  if ((req.body) && (req.body._id)) {

    Issue.findById({_id: req.body._id}, (err,doc) => {
      if (err) {
        console.log(err);
        return 'could not find issue '+ doc._id;
      };

      if (req.body.lenght <= 1) {
        return 'no updated field sent';
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
        res.send(doc);
        return 'successfully updated'; 
      }
    });
  } else {
    console.log('request is empty or does not have an id');
    res.end();
  }
});
    
router.delete('/api/issues/:project', function (req, res){
  var project = req.params.project;
  if (!req.body._id) {
    res.end();
    return '_id error';
  } else {
    Issue.findByIdAndDelete({_id: req.body._id}, (err,doc) => {
    if (err) {
      console.log(err);
      res.end();
      return 'could not delete '+ doc._id;
    };
    doc.open = req.body.open;
    doc.save();
    res.send(doc);
    return 'deleted '+ doc._id;
  });
  }
});
    

module.exports = router;