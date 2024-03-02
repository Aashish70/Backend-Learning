import mongoose from mongoose;
import {video} from "../models/video.model.js";
import {Subscription} from "../models/subscription.model.js"; 
import {Like} from "../models/like.model.js";   
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 
import { asyncHandler } from "../utils/asyncHandler";



const getChannelStats = asyncHandler(async(req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc
})

const getChannelvideos = asyncHandler(async(req, res) => {
    // TODO: Get all the videos uploaded by the channel
})

export {
    getChannelStats,
    getChannelvideos
}