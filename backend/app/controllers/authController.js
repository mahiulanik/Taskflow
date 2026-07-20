import { getUserById, loginUser, registerUser, resetUserPassword, updateUserProfile, changeUserPassword, verifyUserEmail, verifyUserOTP, deleteUserAccount } from "../services/authService.js";

export const register = async (req, res) => {
    const {email, firstName, lastName, mobile, password} = req.body

    try {
        const result = await registerUser({email, firstName, lastName, mobile, password})
        res.status(200).json(result)
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body

    try {
        const result = await loginUser({email, password})
        res.status(200).json(result)
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}

export const getProfile = async (req, res) => {
    const user_id = req.user.id
    try {
        const user = await getUserById(user_id)
        res.status(200).json(user)
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}

export const updateProfile = async (req, res) => {
    const user_id = req.user.id
    const {firstName, lastName, mobile} = req.body
    try {
        const user = await updateUserProfile(user_id, {firstName, lastName, mobile})
        res.status(200).json(user)
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}

export const changePassword = async (req, res) => {
    const user_id = req.user.id
    const {currentPassword, newPassword} = req.body
    try {
        const result = await changeUserPassword(user_id, {currentPassword, newPassword})
        res.status(200).json(result)
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}


export const verifyEmail = async (req, res) => {
    const {email} = req.body
    try {
        const result = await verifyUserEmail(email)
        res.status(200).json(result)
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}


export const verifyOTP = async (req, res) => {
    const {email, otp} = req.body
    try {
        const result = await verifyUserOTP({email, otp})
        res.status(200).json(result)
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}


export const resetPassword = async (req, res) => {
    const {email, otp, password} = req.body
    try {
        const result = await resetUserPassword({email, otp, password})
        res.status(200).json(result)
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}

export const deleteAccount = async (req, res) => {
    const user_id = req.user.id
    try {
        const result = await deleteUserAccount(user_id)
        res.status(200).json(result)
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}
