import { createUser, getLogin, userDetails } from "@/controllers/user.controller";
import { isAuth } from "@/middlewares/isAuth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { createUserSchema, loginSchema } from "@/schemas/user.schema";
import { Router } from "express";

const router = Router()

router.post("/signup", validate(createUserSchema), createUser)
router.post("/login", validate(loginSchema), getLogin)
router.get("/me", isAuth, userDetails)

export default router