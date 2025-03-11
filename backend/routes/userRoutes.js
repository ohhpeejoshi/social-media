import express from "express"
import { myProfile, userProfile } from "../controllers/userControllers.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.get('/me', isAuth, myProfile);
router.get('/:id', isAuth, userProfile);

export default router;