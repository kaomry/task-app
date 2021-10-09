// // CRUD 

// // const mongodb = require('mongodb')
// // const MongoClient = mongodb.MongoClient

// // //Worke with IDs
// // const ObjectID = mongodb.ObjectId

// const { MongoClient, ObjectId } = require('mongodb')
// const id = new ObjectId()
// console.log(id)
// console.log(id.getTimestamp())


// //Create the connection to the DB
// const connectionURL = 'mongodb://127.0.0.1:27017'
// const databaseName = 'task-manager'

// MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
//     if (error) {
//         return console.log('Unable to connect to database!')
//     }

//     const db = client.db(databaseName)

//     db.collection('users').deleteMany({
//         age: 30
//     }).then((result) => {
//         console.log(result)
//     }).catch((error) => {
//         console.log(error)
//     })
// })

//     // const updatePromise = db.collection('tasks').updateMany({
//     //     complited: true
//     // }, {
//     //     $set: {
//     //         complited: false
//     //     }
//     // })



//     // updatePromise.then((result) => {
//     //     console.log(result)
//     // }).catch((error) => {
//     //     console.log(error)
//     // })
//     //db.collection('users').findOne({name: 'Jen'}, (error, user) =>{
//     // db.collection('users').findOne({_id: new ObjectId("61546dc338e21f8c3567164c")}, (error, user) =>{

//     //     if(error){
//     //         return console.log('Unable to fetch')
//     //     }

//     //     console.log(user)
//     // })

//     // db.collection('users').find({age: 30}).toArray((error, users) => {
//     //     console.log(users)
//     // })

//     // db.collection('users').find({age: 30}).count((error, count) => {
//     //     console.log(count)
//     // })

//     //db.collection('tasks').find({age: 30}).toArray((error, users) => {


//     // db.collection('users').insertOne({
//     //     name: 'Omry',
//     //     age: 30
//     // }, (error, result) => {
//     //     if(error){
//     //         return console.log('Unable to insert user')
//     //     }
//     //     console.log(result.insertedId)
//     // })

//     // const db = client.db(databaseName)
//     // db.collection('users').insertMany([
//     //     {
//     //         name: 'Jen',
//     //         age: 28
//     //     }, {
//     //         name: 'Gunther',
//     //         age: 27
//     //     }
//     // ], (error, result) => {
//     //     if (error) {
//     //         return console.log('Unable to insert socuments!')
//     //     }
//     //     console.log(result.insertedIds)
//     // })

//     // const db = client.db(databaseName)
//     // db.collection('tasks').insertMany([
//     //     {
//     //         description: 'first task',
//     //         complited: true
//     //     },{
//     //         description: 'Second task',
//     //         complited: true
//     //     },{
//     //         description: 'Third task',
//     //         complited: false
//     //     }
//     // ], (error, result) => {
//     //     if (error) {
//     //         return console.log('Unable to insert documents!')
//     //     }
//     //     console.log(result.insertedIds)
//     // })

    
