import mongoose from 'mongoose';
import { Comment } from '../models/comment.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';


const getVideoComments = asyncHandler(async(req, res) => {
    // TODO: get all comment for video
    const {videoId} = req.params;
    const {page = 1, limit = 10} = req.query;
})

const addComment = asyncHandler(async(req.res) = {
    // TODO: add comment to a video
})

const updateComment = asyncHandler(async(req, res) => {
    // TODO: update comment
})

const deleteComment = asyncHandler(async(req, res) => {
    // TODO: delete comment
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}