import { createUser } from "@/controllers/user.controller";
import { validate } from "@/middlewares/validate.middleware";
import { createUserSchema } from "@/schemas/user.schema";
import { Router } from "express";

const router = Router()

router.post("/signup", validate(createUserSchema), createUser)

export default router