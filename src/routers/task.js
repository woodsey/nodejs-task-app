const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');


router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        // this is directly updating the db, rather than going through mongoose, so code has been changed to mongoose way
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) { return res.status(404).send(); }

        updates.forEach((update) => {
            task[update] = req.body[update]
        });

        await task.save();



        res.status(201).send(task);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        console.log('Error creating a task: ' + error);
        res.status(400).send(error);
    }

    /*
        const task = new Task(req.body);
        try {
            await task.save();
            res.status(201).send(task);
        } catch (error) {
            console.log('Error creating a task: ' + error);
            res.status(400).send(error);
        }
    */
});


router.get('/tasks', auth, async (req, res) => {
    try {
        const match = {};
        const sort = {};
        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }


        console.log('getting tasks: ' + match.completed)
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort
            }
        });
        res.send(req.user.tasks);
        //        const tasks = await Task.find({ owner: req.user._id });
        //        console.log(tasks);
        //        res.status(201).send(tasks);
    } catch (error) {
        console.log('Error getting all tasks: ' + error);
        res.send(500).send(error);
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send('Task not found (or it is not your task!)');
        }
        res.status(201).send(task);
    } catch (error) {
        console.log('Error finding task: ' + error);
        res.status(500).send(error);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.status(201).send(task);
    } catch (error) {

        res.status(500).send(error);
    }
});

module.exports = router;