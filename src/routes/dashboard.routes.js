import {Router} from 'express';
import { getChannelStats, getChannelvideos } from '../controllers/dashboard.controller';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route('/stats').get(getChannelStats);
router.route('/videos').get(getChannelvideos);

export default router;