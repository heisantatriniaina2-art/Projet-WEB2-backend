import { Router } from "express";

import {
    getExamsController,
    getExamController,
    createExamController,
    updateExamController,
    deleteExamController
} from "../controllers/examController.js";

import { authenticate } from "../security/authMiddleware.js";
import { requireAdmin } from "../security/middleware.js";

const router = Router();

router.get(
    "/",
    authenticate,
    getExamsController
);

router.get(
    "/:id",
    authenticate,
    getExamController
);

router.post(
    "/",
    authenticate,
    requireAdmin,
    createExamController
);

router.put(
    "/:id",
    authenticate,
    requireAdmin,
    updateExamController
);

router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    deleteExamController
);

export default router;