import { asyncHandler } from '../utils/asyncHandler';

const register = asyncHandler(async (req, res) => {
     res.status(200).json({
        message: "OK",
    });
});

export { register };