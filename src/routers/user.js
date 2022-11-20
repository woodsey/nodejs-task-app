const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

router.post('/users', async (req, res) => {
    console.log(req.body);

    const user = new User(req.body);

    try {
        await user.save();

        const token = await user.generateAuthToken();

        res.status(201).send({ user, token });
    } catch (error) {
        console.log('Error creating a user: ' + error);
        res.status(400).send(error);
    }

    /*
        user.save().then(() => {
            res.status(201).send(user);
        }).catch((error) => {
            console.log('Error creating a user: ' + error);
            res.status(400).send(error);
        });
    */
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);

        const token = await user.generateAuthToken();

        res.send({ user, token });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            console.log(token.token)
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});


router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);

    /*    try {
            const users = await User.find({});
            res.status(201).send(users)
        } catch (error) {
            console.log('Error getting users: ' + error);
            res.status(500).send(error);
        }
    */
});

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})


router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        const user = await User.findById(req.params.id);
        updates.forEach((update) => {
            user[update] = req.body[update]
        });

        await user.save();

        if (!user) {
            return res.status(404).send();
        }

        res.status(201).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.status(201).send(req.user);
    } catch (error) {
        res.status(500).send(error)
    }
});

module.exports = router;