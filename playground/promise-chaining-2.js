require('../src/db/mongoose');
const Task = require('../src/models/task');

/*
Task.findByIdAndDelete('6372bb154d6622cd59b3a734').then((task) => {
    if (task) {
        console.log('found and deleted one');
    } else {
        console.log('did not find this one to delete');
    }
    return Task.countDocuments({ completed: false });
}).then((result) => {
    console.log('total docs: ' + result);
    //    Task.countDocuments({ completed: false }, (err, result) => {
    //        console.log('total docs: ' + result);
    //    });
}).catch((error) => {
    console.log(error);
});
*/

const deleteTaskAndCount = async (id) => {
    const removeTask = await Task.findByIdAndDelete(id);
    const countTasks = await Task.countDocuments({ completed: false });
    return countTasks;
}

deleteTaskAndCount('6372bd6b87cda0c519fa945f').then((result) => {
    console.log("Results remaining: " + result);
}).catch((error) => {
    console.log("error in deleteTaskAndCount: " + error)
});
