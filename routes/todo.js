var mongoose = require('mongoose'),
    Todo = mongoose.model('Todo');

var sanitize = require('mongo-sanitize');

module.exports = {
    all: function(req, res){
        Todo.find({}, function(err, todos){
            if(err) res.render('error', { error: 'Could not fetch items from database'});
            res.render('todos', { todos: todos });
        });
    },
    viewOne: function(req, res){
        Todo.find({ _id: sanitize(req.params.id) }, function(err, todo){
            res.render('todo', { todo: todo[0] })
        });
    },
    create: function(req, res){
        var todoContent = sanitize(req.body.content);
        // create todo
        Todo.create({ content: todoContent }, function(err, todo){
            if(err) res.render('error', { error: 'Error creating your todo'})
            // reload collection
            res.redirect('/todos');
        });
    },
    destroy: function(req, res){
        var id = sanitize(req.params.id);

        Todo.findByIdAndRemove(id, function(err, todo){
            if(err) res.render('error', { error: 'Error deleting todo'});
            res.redirect('/todos');
        });
    },
    markCompleted: function(req, res){
      Todo.findOneAndUpdate({ _id: sanitize(req.params.id) }, {completed: true}, function(err, todo){
          res.redirect('/todos');
      });
    },
    edit: function(req, res){
        Todo.findOneAndUpdate({ _id: sanitize(req.params.id) }, {content: sanitize(req.body.content)}, function(err, todo){
            res.redirect('/todos');
        });
    }

};
