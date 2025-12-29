import { addStudentToClass, createClass, getClassDetails, getMyAttendace } from "@/controllers/class.controller";
import { isAuth, isPartOf, isStudent, isTeacher } from "@/middlewares/isAuth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { addStudentSchema, createClassSchema } from "@/schemas/class.schema";
import { Router } from "express";

const router = Router()

router.post("/", isAuth, isTeacher, validate(createClassSchema), createClass)
router.post("/:id/add-student", isAuth, isTeacher, validate(addStudentSchema), addStudentToClass)

router.post("/:id", isAuth, isPartOf, getClassDetails)
router.get("/:id/my-attendance", isAuth, isStudent, getMyAttendace)

export default router