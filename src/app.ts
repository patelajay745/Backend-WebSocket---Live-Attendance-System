
import express, { Request, Response } from "express"
import userRoutes from "@/routes/user.routes"
import { errorHandler } from "./middlewares/errorHandler.middleware"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req: Request, res: Response) => { return res.status(200).json("Up and Runnig") })

app.use("/api/v1/auth", userRoutes)

app.use(errorHandler)

export default app