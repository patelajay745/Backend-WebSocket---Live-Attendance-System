import "dotenv/config"

import app from "@/app"
import { createServer } from "http"
import { config } from "./config"
import mongoose from "mongoose"
import url from "url"
import jwt from "jsonwebtoken"
import { AuthenticatedWebSocket } from "@/types/websocket"
import { WebSocketServer, WebSocket } from "ws"
import { activeSession, clearActiveSession } from "./controllers/attendance.controller"
import { checkStatus } from "./utils/websocket/helper"
import { ClassModel } from "./models/class.model"
import { Attendance } from "./models/attendance.model"

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

    ws.on('message', async (message) => {

        try {
            const { event, data } = JSON.parse(message.toString())

            if (event === "ATTENDANCE_MARKED") {

                if (!checkStatus(authenticatedWs, ws)) return

                const { studentId, status } = data
                activeSession!.attendace[studentId] = status

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

            if (event === "DONE") {

                if (!checkStatus(authenticatedWs, ws)) return;

                if (!activeSession) return

                const classData = await ClassModel.findById(activeSession?.classId)

                if (!classData) {
                    ws.send(JSON.stringify({
                        event: "ERROR",
                        message: "Class not found"
                    }))
                    return
                }

                for (const studentId of classData.studentIds) {
                    const studentIdstr = studentId.toString()

                    if (!activeSession.attendace[studentIdstr]) {
                        activeSession!.attendace[studentIdstr] = "absent"
                    }
                }

                const allAttendance = Object.entries(activeSession.attendace).map((studnetId, status) => ({
                    classId: activeSession?.classId,
                    staudentId: studnetId,
                    status
                }))

                await Attendance.insertMany(allAttendance)

                const attendanceSheet = Object.values(activeSession.attendace)
                const present = attendanceSheet.filter(status => status === "present").length
                const absent = attendanceSheet.filter(status => status === "absent").length

                const total = present + absent

                clearActiveSession()

                const messageToBroadcast = JSON.stringify({
                    event: "DONE",
                    data: {
                        message: "Attendance persisted",
                        present,
                        absent,
                        total
                    }
                })

                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(messageToBroadcast)
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

