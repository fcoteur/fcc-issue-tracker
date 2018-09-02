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
  
  Issue.find({project_name: project},(err,docs) => {
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
  Issue.findByIdAndUpdate({_id: req.body._id}, (err,doc) => {
    if (err) console.log(err);
    console.log(doc);
    doc.open = req.body.open;
    doc.save((err)=> { if (err) console.log(err)});
  });
});
    
router.delete('/api/issues/:project', function (req, res){
  var project = req.params.project;
});
    

module.exports = router;