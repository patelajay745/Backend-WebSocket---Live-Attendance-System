
import express, { Request, Response } from "express"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req: Request, res: Response) => { return res.status(200).json("Up and Runnig") })

export default app