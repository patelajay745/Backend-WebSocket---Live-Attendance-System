import { addStudentToClass, createClass, getClassDetails } from "@/controllers/class.controller";
import { isAuth, isPartOf, isTeacher } from "@/middlewares/isAuth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { addStudentSchema, createClassSchema } from "@/schemas/class.schema";
import { Router } from "express";

const router = Router()

router.post("/", isAuth, isTeacher, validate(createClassSchema), createClass)
router.post("/:id/add-student", isAuth, isTeacher, validate(addStudentSchema), addStudentToClass)

router.post("/:id", isAuth, isPartOf, getClassDetails)

export default router