import tasks from "../models/taskModel.js";

export async function createTask({user_id, title, description, status}) {
    try {
        const task = await tasks.create({
            user_id,
            title: title.trim(),
            description: description.trim(),
            status: status.trim()
        })
        return task
    }
    catch(error) {
        throw new Error("Error creating task: " + error.message)
    }
}


export async function updateTask({task_id, user_id, title, description, status}) {
    try {
        const updatedTask = await tasks.findOneAndUpdate(
            {_id: task_id, user_id},
            {
            title: title.trim(),
            description: description.trim(),
            status: status.trim()
            },
            {new: true, runValidators: true}
        );

        if(!updatedTask) {
            throw new Error("Task not found or you don't have permission to update it")
        }
        return updatedTask
    }
    catch(error) {
        throw new Error("Error updating task: " + error.message)
    }
}


export async function deleteTask(task_id, user_id) {
    try {
        const deletedTask = await tasks.findOneAndDelete({_id: task_id, user_id})
        if(!deletedTask) {
            throw new Error("Task not found or you don't have permission to update it")
        }
        return {message: "Task Deleted Successfully"}
    }
    catch(error) {
        throw new Error("Error deleting task: " + error.message)
    }
}


export async function getTasksByUserId(user_id) {
    try {
        const userTasks = await tasks.find({user_id})
        return userTasks
    }
    catch(error) {
        throw new Error("Error fetching tasks: " + error.message)
    }
}