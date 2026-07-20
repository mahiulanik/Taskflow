import { encodeToken } from "../config/token.js"
import users from "../models/userModel.js"
import tasks from "../models/taskModel.js"
import bcrypt from "bcryptjs"
import sendEmail from "../config/emailSending.js"
import crypto from "crypto"
import validator from "validator"



const PASSWORD_OPTIONS = { minLength: 8, minLowercase: 0, minUppercase: 0, minNumbers: 1, minSymbols: 0 }
 
function assertStrongPassword(password) {
    if (typeof password !== "string" || !validator.isStrongPassword(password, PASSWORD_OPTIONS)) {
        throw new Error("Password must be at least 8 characters")
    }
}

export async function registerUser({email, firstName, lastName, mobile, password}) {
    if (typeof email !== "string" || !validator.isEmail(email)) {
        throw new Error("Invalid email address")
    }
    if (typeof mobile !== "string" || !validator.isMobilePhone(mobile.trim(), "any")) {
        throw new Error("Invalid mobile number")
    }
    assertStrongPassword(password)

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedMobile = mobile.trim()

    const existingUser = await users.findOne({
        $or: [
            {email: normalizedEmail},
            {mobile: normalizedMobile}
        ]
    })

    if(existingUser) {
        throw new Error("User already exist!")
    }

    try{
        const passwordHash = await bcrypt.hash(password, 10)
        await users.create({
            email: normalizedEmail,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            mobile: normalizedMobile,
            password: passwordHash
        })
        return {message: "User registerred successfully"}
    }
    catch(error) {
        throw new Error("Error registering user" + error.message)
    }
}

export async function loginUser({email, password}) {
    const normalizedEmail = email.trim().toLowerCase()
    const user = await users.findOne({email: normalizedEmail})

    if(!user) {
        throw new Error("Invalid email or password")
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid) {
        throw new Error("Invalid email or password")
    }

    const token = encodeToken(user.email, user._id)
    return {token}
}

export async function getUserById(user_id) {
    const user = await users.findById(user_id).select("-password")
    if(!user) {
        throw new Error("User not found!")
    }
    return user
}

export async function updateUserProfile(user_id, {firstName, lastName, mobile}) {
    const updateData = {}
    if(firstName) updateData.firstName = firstName.trim()
    if(lastName) updateData.lastName = lastName.trim()
    if(mobile) updateData.mobile = mobile.trim()

    const user = await users.findByIdAndUpdate(
        user_id,
        updateData,
        {new: true, runValidators: true}
    ).select("-password")

    if(!user) {
        throw new Error("User not found!")
    }
    return user
}

export async function changeUserPassword(user_id, {currentPassword, newPassword}) {
    const user = await users.findById(user_id)
    if(!user) {
        throw new Error("User not found!")
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if(!isPasswordValid) {
        throw new Error("Current password is incorrect")
    }

    assertStrongPassword(newPassword)

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await users.updateOne({_id: user_id}, {password: passwordHash})
    return {message: "Password changed successfully"}
}


export async function verifyUserEmail(email) {
    const normalizedEmail = email.trim().toLowerCase()
    const user = await users.findOne({email: normalizedEmail})
    if(!user) {
        throw new Error("Email not found!")
    }

    const otp = crypto.randomInt(100000, 1000000).toString()
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes valid
    await users.updateOne({email: normalizedEmail}, {otp, otpExpiresAt})

    await sendEmail(normalizedEmail, "Your OTP code", `Your OTP code is ${otp}`)
    return {message: "OTP sent to email"}
}


export async function verifyUserOTP({email, otp}) {
    const normalizedEmail = email.trim().toLowerCase()
    const user = await users.findOne({email: normalizedEmail})
    if(!user) {
        throw new Error("Email not found!")
    }
    if(user.otp !== otp) {
        throw new Error("Invalid OTP")
    }
    if(!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
        throw new Error("OTP expired, please request a new one")
    }
    return {message: "OTP verified successfully"}
}


export async function resetUserPassword({email, otp, password}) {
    const normalizedEmail = email.trim().toLowerCase()
    const user = await users.findOne({email: normalizedEmail})
    if(!user) {
        throw new Error("Email not found!")
    }
    if(user.otp !== otp) {
        throw new Error("Invalid OTP")
    }
    if(!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
        throw new Error("OTP expired, please request a new one")
    }

    assertStrongPassword(password)

    const passwordHash = await bcrypt.hash(password, 10)
    await users.updateOne({email: normalizedEmail}, {password: passwordHash, otp: "0", otpExpiresAt: null})
    return {message: "Password reset successfully"}
}

export async function deleteUserAccount(user_id) {
    const user = await users.findById(user_id)
    if(!user) {
        throw new Error("User not found!")
    }

    await tasks.deleteMany({user_id})
    await users.findByIdAndDelete(user_id)
    return {message: "Account deleted successfully"}
}
