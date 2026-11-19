import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { registerBody, loginBody } from "./auth.schemas.js";
import { register, login, me } from "./auth.controller.js";

const router = Router();

router.post("/register", validate({ body: registerBody }), register);
router.post("/login", validate({ body: loginBody }), login);
router.get("/me", authenticate, me);

export default router;
