const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password can\'t contain the word password')
            }

        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        //Getting binary file
        type: Buffer
    }
},{
    //Adding an argument for supporting timestamps - when it created and when it was updated  
    timestamps: true
})

//Methods used for specific instance (user)
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

/*
* Remove privait info from the user object we return
* By using the name toJSON we don't need to specify the use
* of this function any time we call user, the model do it
* automaticly
*/
userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//Remove privait info from the user object we return
// userSchema.methods.getPublicProfile = function (){
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens

//     return userObject
// }

//Statics for the module (User)
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

// Hash the plain text psassword before saving 
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//Delete user's tasks when user is deleted
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({owner: user._id})

    next()

})

// Create a virtual property - relationship between two entities
userSchema.virtual('tasks', {
    //Reference to other model
    ref:'Task',
    //where the local data is store - what is the key from the user side - and its id
    localField: '_id',
    //The name of the field in the other model that has this relation with, 
    //in our case its owner in task
    foreignField: 'owner'
})

const User = mongoose.model('User', userSchema)

module.exports = User;