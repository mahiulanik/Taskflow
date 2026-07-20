import { decodeToken } from "../config/token.js"

export default (req, res, next) => {
    let token = req.headers["authorization"]
    if(!token) {
        return res.status(401).json({error: "No token provided"})
    }
    let decoded = decodeToken(token)
    if(!decoded) {
        return res.status(401).json({error: "Invalid token"})
    }
    else {
    req.user = { id: decoded.user_id, email: decoded.email }
    next()
    }
}