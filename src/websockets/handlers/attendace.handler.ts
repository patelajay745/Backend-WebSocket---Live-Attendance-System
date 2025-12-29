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
        if (client.readyState === WebSocket.OPEN) {
            client.send(broadcastMessage)
        }
    })
}