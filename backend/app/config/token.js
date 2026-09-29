import jwt from "jsonwebtoken"

export const encodeToken = (email, user_id) => {
    const key = process.env.JWT_SECRET
    const options = {expiresIn: "30d", algorithm: "HS256"}
    const payLoad = {"email" : email, "user_id" : user_id}
    return jwt.sign(payLoad, key, options)
}


export const decodeToken = (token) => {
    const key = process.env.JWT_SECRET
    try {
        return jwt.verify(token, key, {algorithms: ["HS256"]})
    }
    catch(error) {
        return null
    }
}