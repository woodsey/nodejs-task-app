const { MongoClient, ObjectID, ObjectId } = require('mongodb');

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

/*
const id = new ObjectID();
console.log(id);
console.log(id.getTimestamp());
*/

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log("Error when connecting to the DB");
    }
    console.log("Connected to DB");

    const db = client.db(databaseName);


    db.collection('tasks').findOne({ _id: new ObjectID('63712d69a25f457b10cb71a8') }, (error, task) => {
        console.log(task)
    });

    db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
        console.log(tasks);
    })

    db.collection('tasks').updateMany({ completed: true }, { $set: { completed: false } }).then((update) => {
        console.log('Updated the values:');
        console.log(update)
    }).catch((error) => {
        console.log(error);
    });


    db.collection('tasks').deleteOne({ description: 'Read books' }).then((update) => {
        console.log('deleted a record');
        console.log(update);
    }).catch((error) => {
        console.log('error in deleteOne');
        console.log(error);
    })

    /*
        db.collection('users').insertMany([{
            name: 'TJ Woods ' + Math.random(), age: 40
        },
        { name: 'John Doe ' + Math.random(), age: 62 }], (error, result) => {
            if (error) {
                return console.log("Unable to insert user");
            } else {
                console.log("callback from adding to db");
                console.log(result);
                console.log(result.insertedIds);
            }
        });
    */
    /*
        db.collection('tasks').insertMany([{
            description: 'Keep doing the nodejs course',
            completed: false
        }, { description: 'Read books', completed: false }], (error, result) => {
            if (error) {
                return console.log("Error inserting to the tasks collection in the db");
            } else {
                console.log(result);
                console.log(result.insertedIds);
            }
        })
        */

})


