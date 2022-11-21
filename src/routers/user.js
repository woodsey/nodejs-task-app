const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendCancelAccount } = require('../emails/account');
const sharp = require('sharp');

const multer = require('multer');

//dest: 'avatars',
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|gif|svg|png)$/)) {
            return cb(new Error('Please upload an image type file'));
        }
        cb(undefined, true);
    }
});

router.post('/users', async (req, res) => {
    console.log(req.body);

    const user = new User(req.body);

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
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


router.patch('/users/me', auth, async (req, res) => {
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
        //        const user = await User.findById(req.params.id);
        const user = req.user;
        updates.forEach((update) => {
            user[update] = req.body[update]
        });

        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        console.log("delete user: " + req.user._id + " - " + req.user.name)
        await req.user.deleteOne();
        sendCancelAccount(req.user.email, req.user.name);
        res.status(201).send(req.user);
    } catch (error) {
        console.log('error deleting user: ' + error)
        res.status(500).send(error)
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer
    await req.user.save();
    res.status(200).send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        console.log('calling delete avatar')
        req.user.avatar = undefined;
        await req.user.save(req.user);
        res.status(200).send()
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})

router.get('/users/:id/avatar', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !(await user).avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);

    } catch (error) {
        res.status(404).send(error);
    }
})


module.exports = router;