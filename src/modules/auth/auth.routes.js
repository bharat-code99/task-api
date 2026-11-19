import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { registerBody, loginBody, refreshBody } from "./auth.schemas.js";
import { register, login, refresh, logout, logoutAll, me } from "./auth.controller.js";

const router = Router();

router.post("/register", validate({ body: registerBody }), register);
router.post("/login", validate({ body: loginBody }), login);
router.post("/refresh", validate({ body: refreshBody }), refresh);
router.post("/logout", validate({ body: refreshBody }), logout);
router.post("/logout-all", authenticate, logoutAll);
router.get("/me", authenticate, me);

export default router;
