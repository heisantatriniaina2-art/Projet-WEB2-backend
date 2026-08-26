import { Router } from "express";

import {
    listStudents,
    createStudentController,
    updateStudentController,
    resetStudentPasswordController,
    disableStudentController
} from "../controllers/studentController.js";

import { authenticate } from "../security/authMiddleware.js";

import {
    requireAdmin
} from "../security/middleware.js";

const router = Router();

router.get(
    "/",
    authenticate,
    requireAdmin,
    listStudents
);

router.post(
    "/",
    authenticate,
    requireAdmin,
    createStudentController
);

router.put(
    "/:id",
    authenticate,
    requireAdmin,
    updateStudentController
);

router.post(
    "/:id/reset-password",
    authenticate,
    requireAdmin,
    resetStudentPasswordController
);

router.patch(
    "/:id/disable",
    authenticate,
    requireAdmin,
    disableStudentController
);

export default router;