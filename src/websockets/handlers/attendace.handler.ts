import { activeSession } from "@/controllers/attendance.controller"
import { AuthenticatedWebSocket } from "@/types/websocket"
import { checkStatus } from "@/utils/websocket/helper"
import { WebSocket, WebSocketServer } from "ws"

export const handleAttendaceMarked = (ws: WebSocket, data: any, wss: WebSocketServer, authenticatedWs: AuthenticatedWebSocket) => {
    if (!checkStatus(authenticatedWs, ws)) return

    const { studentId, status } = data
    activeSession!.attendace[studentId] = status

    const broadcastMessage = JSON.stringify({
        event: 'ATTENDANCE_MARKED',
        data: { studentId, status }
    })

    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(broadcastMessage)
        }
    })
}

export const handleMyAttendance = (ws: WebSocket, data: any, wss: WebSocketServer, authenticatedWs: AuthenticatedWebSocket) => {

    if (authenticatedWs.user?.role !== "student") {
        ws.send(JSON.stringify({
            event: "ERROR",
            message: "Only student can ask for own attendance"
        }))

        return
    }

    if (!activeSession) return;

    const status = activeSession.attendace[authenticatedWs.user.userId]

    if (!status) {
        ws.send(JSON.stringify({
            event: "MY_ATTENDANCE",
            data: {
                status: "not yet updated"
            }
        }))

        return
    }

    ws.send(JSON.stringify({
        event: "MY_ATTENDANCE",
        data: {
            status
        }
    }))

}