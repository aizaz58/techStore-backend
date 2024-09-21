import express from "express";
import { login, logOut, register, refresh,getProfile } from "../controllers/authController.js";
//import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/logout", logOut);
router.post("/refresh-token", refresh);
router.get("/profile", getProfile);

export default router;
