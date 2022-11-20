const express = require('express');
const router = new express.Router();
const Task = require('../models/task');


router.patch('/tasks/:id', async (req, res) => {
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

        const task = await Task.findById(req.params.id);
        updates.forEach((update) => {
            task[update] = req.body[update]
        });

        await task.save();

        if (!task) {
            return res.status(404).send();
        }

        res.status(201).send(task);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        console.log('Error creating a task: ' + error);
        res.status(400).send(error);
    }
});


router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(201).send(tasks);
    } catch (error) {
        console.log('Error getting all tasks: ' + error);
        res.send(500).send(error);
    }
});

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send();
        }
        res.status(201).send(task);
    } catch (error) {
        console.log('Error finding task: ' + error);
        res.status(500).send(error);
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send();
        }
        res.status(201).send(task);
    } catch (error) {

        res.status(500).send(error);
    }
});

module.exports = router;