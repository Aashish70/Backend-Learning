import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';  


const register = asyncHandler(async (req, res) => {
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

export { register };