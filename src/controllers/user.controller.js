import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';  
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId)=>{
    try {
       const user = await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

       user.refreshToken = refreshToken
       await user.save({ validateBeforeSave: false })

       return {accessToken, refreshToken} 
    } catch (error) {
       throw new ApiError(500, "something went wrong while generating refresh and access token") 
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from fronted
    // validation user details - not empty, valid email, password length
    // check if user already exists
    // check for image
    // check for avatar
    // upload image to cloudinary, avatar
    // create user object - create entry in db
    // remove password and reference token field from response
    // check for user creation
    // return response

    const {fullName, email, username, password} = req.body
    console.log(fullName, email, username, password)

    if(
        [fullName, email, username, password].some(()=>
        field?.trim() === "" )
    ) {
        throw new ApiError(400, "All field are required")
    }

    const exitedUser = User.findOne({
        $or: [
            {email},
            {username}
        ]
    })

    if(exitedUser) {
        throw new ApiError(409, "User with email and username already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar are required")
    }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar) {
      throw new ApiError(500, "Something went wrong while uploading avatar")
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  })

  const createdUser = User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser) {
      throw new ApiError(500, "Something went wrong while creating user")
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User created successfully")
  )


});

 const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    // find the user
    // password check'
    // access and refresh token
    // send cookies

    const {email, username, password} = req.body
    
    if(!username && !email){
        throw new ApiError(400, "username or email is required")
    }

    //here is alternative of above code based on logic discussion
    // if (!(username || email)) {
    //     throw new ApiError(400, "usename or email is required")
    // }

  const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(404, "user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credientials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
 
   const options = {
    httpOnly: true,
    secure: true
   }

   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
    new ApiResponse(
        200,
        {
            user: loggedInUser, accessToken,
            refreshToken
        },
        "user logged in successfully"
    )
   )

 })

 const logoutUser = asyncHandler(async(req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
       }

       return res
       .status(200)
       .clearCookies("accessToken", options)
       .clearCookies("refreshToken", options)
       .json(new ApiResponse(200, {}, "User loggged out"))
 })

 const refreshAccessToken = asyncHandler(async( req, res) =>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request")
    }

   try {
     const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
     )
 
     const user = User.findById(decodedToken?._id)
 
     if(!user){
         throw new ApiError(401, "Invalid refresh Token")
     }
 
     if(incomingRefreshToken !== user?.refreshToken){
         throw new ApiErro(401, "Refresh token is expired or used")
     }
 
     const options = {
         httpOnly: true,
         secure: true
     }
 
     const {accessToken, newrefreshToken} = await generateAccessAndRefreshToken(user._id)
 
     return res
     .status("accessToken", accessToken, options)
     .cookie("refreshToken", newrefreshToken, options)
     .json(
         new ApiResponse(
             200,
             {
                 accessToken, refreshToken: newrefreshToken
             },
             "Access Token Refreshed"
         )
     )
   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
   }
 })


export { registerUser, loginUser, logoutUser, refreshAccessToken };