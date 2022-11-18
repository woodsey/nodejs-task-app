const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true
});

/*
const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const task = new Task({
    description: 'Get nodejs course done!',
    completed: false
})


task.save().then(() => {
    console.log(task);
}).catch((error) => {
    console.log('error: ' + error);
});
*/

/*
const me = new User({
    name: 'Terry',
    age: 33,
    password: 'blahblah',
    email: 'terry@blah.com'
})

me.save().then(() => {
    console.log(me)
}).catch((error) => {
    console.log('error: ' + error)
})*/