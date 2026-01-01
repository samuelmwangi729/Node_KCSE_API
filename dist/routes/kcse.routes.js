"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kcse_controller_1 = require("../controllers/kcse.controller");
const router = (0, express_1.Router)();
router.post("/kcse", kcse_controller_1.KCSE);
exports.default = router;
