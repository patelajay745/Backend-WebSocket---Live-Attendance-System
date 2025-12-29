import { createUser, getLogin } from "@/controllers/user.controller";
import { validate } from "@/middlewares/validate.middleware";
import { createUserSchema, loginSchema } from "@/schemas/user.schema";
import { Router } from "express";

const router = Router()

router.post("/signup", validate(createUserSchema), createUser)
router.post("/login", validate(loginSchema), getLogin)

export default router