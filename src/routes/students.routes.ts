import { getAllStudents } from "@/controllers/student.controller";
import { isAuth, isTeacher } from "@/middlewares/isAuth.middleware";
import { Router } from "express";

const router = Router()

router.get("/", isAuth, isTeacher, getAllStudents)

export default router