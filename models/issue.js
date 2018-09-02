var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var IssueSchema = new Schema(
  {
    project_name: {type: String, required: true, max: 100},
    issue_title: {type: String, required: true, max: 100},
    issue_text: {type: String, required: true, max: 1000},
    created_by: {type: String, required: true, max: 100},
    assigned_to: {type: String, default: "", max: 100},
    status_text: {type: String, default: "", max: 100},
    created_on: {type: Date, default: Date.now },
    updated_on: {type: Date, default: Date.now },
    open: {type: Boolean, default: true}
  }
);

module.exports = mongoose.model('Issue', IssueSchema);