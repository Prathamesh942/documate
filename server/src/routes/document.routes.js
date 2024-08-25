import { Router } from "express";
import { createDoc, getDoc } from "../controllers/doc.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createDoc);
router.route("/:id").get(getDoc);
// router.route("/update/:id").put();
// router.route("/delete/:id").delete();

export default router;
