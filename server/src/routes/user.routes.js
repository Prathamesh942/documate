import { Router } from "express";
import { getDocs } from "../controllers/doc.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/docs").get(verifyJWT, getDocs);

export default router;
