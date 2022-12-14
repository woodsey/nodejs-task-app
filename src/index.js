const express = require('express');

require('./db/mongoose');
//require('../playground/promise-chaining-2')

const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

/*const multer = require('multer');
const upload = multer({
    dest: 'images'
});
app.post('/upload', upload.single('upload'), (req, res) => {
    res.send();
});*/


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is running on ' + port);
});


//  PREVIOUS STUFF

// const jwt = require('jsonwebtoken');

// const bcrypt = require('bcryptjs');

/*
const main = async () => {
    const task = await Task.findById('')
}
main();
*/

/*
const main = async () => {
    const user = await User.findById('637a6d6c3973c6f7bda09f9f');
    await user.populate('tasks');
    //console.log('user tasks: ' + user.tasks);
}
main();
*/

/*
const myFunction = async () => {
    const token = jwt.sign({ _id: 'abc123' }, process.env.JWT_SECRET, { expiresIn: '7 days' });
    console.log("json web token: " + token)
    const data = jwt.verify(token, process.env.JWT_SECRET)
    console.log(data)
}
*/

// myFunction();

/*
const myFunction_previous_way = async () => {
    const password = "TJW23112312";
    const hashedPassword = await bcrypt.hash(password, 8);  // 8 rounds of hashing is what the creator of the package recomments

    console.log(hashedPassword)

    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log(isMatch)
}
*/


/*
app.use((req, res, next) => {
    console.log(req.method, req.path)
    next();
})
*/

