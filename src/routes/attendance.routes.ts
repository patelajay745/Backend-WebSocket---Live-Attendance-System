import { startSession } from "@/controllers/attendance.controller";
import { isAuth, isTeacher } from "@/middlewares/isAuth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { startClassSchema } from "@/schemas/attendance.schema";
import { Router } from "express";

const router = Router()

router.post("/start", isAuth, isTeacher, validate(startClassSchema), startSession)

export default router