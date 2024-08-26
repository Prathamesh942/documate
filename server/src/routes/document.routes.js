import { Router } from "express";
import { createDoc, getDoc, updateDoc } from "../controllers/doc.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createDoc);
router.route("/:id").get(verifyJWT, getDoc);
router.route("/update/:id").put(updateDoc);
// router.route("/delete/:id").delete();

export default router;
