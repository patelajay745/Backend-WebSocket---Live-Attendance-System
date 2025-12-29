import "dotenv/config"

import app from "@/app"
import { createServer } from "http"
import { config } from "./config"
import mongoose from "mongoose"

import url from "url"
import jwt from "jsonwebtoken"
import { AuthenticatedWebSocket } from "@/types/websocket"
import { WebSocketServer, WebSocket } from "ws"
import { activeSession } from "./controllers/attendance.controller"

const httpServer = createServer(app)
const PORT = config.PORT ?? 8000

const wss = new WebSocketServer({ server: httpServer })

wss.on('connection', (ws: WebSocket, req: Request) => {
    const token = url.parse(req.url, true).query["token"] as string

    const decoded = jwt.verify(token, config.JWT_TOKEN_SECRET!) as {
        userId: string,
        role: string
    }

    if (!decoded.userId) {
        ws.send("401 unAuthorized")
        ws.close()
        return
    }

    const authenticatedWs = ws as AuthenticatedWebSocket
    authenticatedWs.user = { userId: decoded.userId, role: decoded.role }

    ws.on('message', (message) => {
        try {
            const { event, data } = JSON.parse(message.toString())

            if (event === "ATTENDANCE_MARKED") {
                if (authenticatedWs.user?.role !== "teacher") {
                    ws.send(JSON.stringify({
                        event: "ERROR",
                        message: "Only teachers can mark attendance"
                    }))

                    return
                }

                if (!activeSession?.classId) {
                    ws.send(JSON.stringify({
                        event: 'ERROR',
                        message: 'No active session. Please start a session first.'
                    }))

                    return
                }

                const { studentId, status } = data
                activeSession.attendace[studentId] = status

                const broadcastMessage = JSON.stringify({
                    event: 'ATTENDANCE_MARKED',
                    data: { studentId, status }
                })

                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(broadcastMessage)
                    }
                })
            }

        } catch (error) {
            ws.send(JSON.stringify({
                event: "ERROR",
                message: "Invalid message format"
            }))
        }

    })

    ws.on('close', () => {
        console.log('WebSocket connection closed')
    })

    ws.on('error', (error) => {
        console.error('WebSocket error:', error)
    })
})

mongoose.connect(config.DB_URl!).then(() => {

    httpServer.listen(PORT, () => {
        console.log(`App is running on : ${PORT}`)
        console.log(`WebSocket  running on ws://localhost:${PORT}`)
    })
}).catch((error) => {
    console.error(error.message)
    process.exit(1)
})

