var mongoose = require('mongoose');

var todoSchema = mongoose.Schema({
    content: {String},
    completed: { type: Boolean, default: false },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Todo', todoSchema);
