var mongoose = require('mongoose');

var todoSchema = mongoose.Schema({
    content: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
      },
    updated_at: {
      type: Date,
      default: Date.now }
});

module.exports = mongoose.model('Todo', todoSchema);
