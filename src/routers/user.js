const express = require('express')
//Add support in uploading files 
const multer = require('multer')
//Add support on cropping and eddinting photos
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const {sendWelcomeEmail,sendCCencelationEmail} = require('../email/account')
const router = new express.Router()



router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if (!user) {
            return res.status(404).send()
        }
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send()
    }
})
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)

    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)

    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

//     User.find({}).then((users) => {
//         res.send(users)
//     }).catch((e) => {
//         res.status(500).send(e)
//     })
// })

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     try{
//         const user = await User.findById(_id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch(e){
//         console.log(e)
//         res.status(500).send(e)
//     }
// })
//     User.findById(_id).then((user) => {
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }).catch((e) => {
//         console.log(e)
//         res.status(500).send(e)
//     })
// })

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (e) {

        res.status(400).send(e.message)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCCencelationEmail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

// Define different instences according the file type we want to get 
const upload = multer({
    // //Shortcut for destination - folder where all the file should be
    // // stored(but if we stored it on the file system than we can access it in the endpoint)
    // dest: 'avatars',
    limits: {
        //Limit the size of the file by bytes
        fileSize: 1000000
    },
    //Get req, file and callback
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a jpg, jpeg or png file'))
        }
        cb(undefined, true)

        // //for returning error
        // cb(new Error('File must be a PDF'))
        // //for returning success
        // cb(undefined,true)
        // //silently reject the file
        // cd(undefined,false)
    }
})

//Add profile pic to a user
router.post('/users/me/avatar', auth, upload.single('avatar'/**match the key in postman */), async (req, res) => {
    //Semnd sharp the buffer image from multer and get it as buffer and conver to png format
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer

    // //Can be used only if multer does't use the 'dest' propery
    // req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()

    // We add a callback for errors that connect to the middleware we provide, in this case multer
    // (we need to add the 4 parameters even if we don't use them)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        //Can be used only if multer does't use the 'dest' propery
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//Get profile pic of a user
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }

        //Define the file type by setting a header
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (err) {
        res.status(404).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {

    try {

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (e) {

        res.status(400).send(e.message)
    }
})


// Before adding auth and letting any user delete any user
// router.delete('/users/:id', async (req,res) => {
//     try{
//         const _id = req.params.id
//         const user = await User.findByIdAndDelete(_id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }catch(e){
//         res.status(500).send()
//     }
// })

module.exports = router