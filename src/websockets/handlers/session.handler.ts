import { activeSession, clearActiveSession } from "@/controllers/attendance.controller"
import { Attendance } from "@/models/attendance.model"
import { ClassModel } from "@/models/class.model"
import { AuthenticatedWebSocket } from "@/types/websocket"
import { checkStatus } from "@/utils/websocket/helper"
import { WebSocket, WebSocketServer } from "ws"

export const handleEndSession = async (ws: WebSocket, data: any, wss: WebSocketServer, authenticatedWs: AuthenticatedWebSocket) => {
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