import "dotenv/config"

import app from "@/app"
import { createServer } from "http"
import { config } from "./config"

const httpServer = createServer(app)
const PORT = config.PORT ?? 8000

httpServer.listen(PORT, () => {
    console.log(`App is running on : ${PORT}`)
})

