import { createTask, deleteTask, getTasksByUserId, updateTask } from "../services/taskService.js"

export const createMyTask = async (req, res) => {
    const {title, description, status} = req.body
    const user_id = req.user.id
    try {
        const task = await createTask({user_id, title, description, status})
        res.status(200).json(task)
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}


export const getMyTask = async (req, res) => {
    const user_id = req.user.id
    try {
        const tasks = await getTasksByUserId(user_id)
        res.status(200).json(tasks)
    }
        catch(error) {
        res.status(400).json({error: error.message})
    }
}


export const updateMyTask = async (req, res) => {
    const {title, description, status} = req.body
    const task_id = req.params.id
    const user_id = req.user.id
    try {
        const updatedTask = await updateTask({task_id, user_id, title, description, status})
        res.status(200).json(updatedTask)
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}


export const deleteMyTask = async (req, res) => {
    const task_id = req.params.id
    const user_id = req.user.id
    try {
        const result = await deleteTask(task_id, user_id)
        res.status(200).json(result)
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}