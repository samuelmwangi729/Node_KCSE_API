import { Router } from "express";
import { KCSE } from "../controllers/kcse.controller";

const router = Router();

router.post("/kcse", KCSE);

export default router;
