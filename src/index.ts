import "dotenv/config"

import app from "@/app"
import { createServer } from "http"
import { config } from "./config"
import mongoose from "mongoose"
import { setupWebSocket } from "./websockets"

const httpServer = createServer(app)
const PORT = config.PORT ?? 8000

setupWebSocket(httpServer)

mongoose.connect(config.DB_URl!).then(() => {

    httpServer.listen(PORT, () => {
        console.log(`App is running on : ${PORT}`)
        console.log(`WebSocket  running on ws://localhost:${PORT}`)
    })
}).catch((error) => {
    console.error(error.message)
    process.exit(1)
})

