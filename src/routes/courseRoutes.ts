import { Router } from "express";

import {
    getCoursesController,
    getCourseController,
    createCourseController,
    updateCourseController,
    deleteCourseController
} from "../controllers/courseController.js";

import { authenticate } from "../security/authMiddleware.js";
import { requireAdmin } from "../security/middleware.js";

const router = Router();

router.get(
    "/",
    authenticate,
    getCoursesController
);

router.get(
    "/:id",
    authenticate,
    getCourseController
);

router.post(
    "/",
    authenticate,
    requireAdmin,
    createCourseController
);

router.put(
    "/:id",
    authenticate,
    requireAdmin,
    updateCourseController
);

router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    deleteCourseController
);

export default router;