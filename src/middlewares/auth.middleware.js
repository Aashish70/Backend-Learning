import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model"


export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
    
        if(!token){
            throw new ApiError(401, "Unathourized request")
        }
        const decodedToken = jwt.verify(token, proccess.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
        .select("-password, -refreshToken")
    
        if(!user){
            // TODO : Discuss about frontend
            throw new ApiError(401, "Invalid access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})