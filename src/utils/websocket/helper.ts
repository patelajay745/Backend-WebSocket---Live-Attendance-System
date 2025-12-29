import { activeSession } from "@/controllers/attendance.controller"
import { AuthenticatedWebSocket } from "@/types/websocket"
import { WebSocket } from "ws"

export const checkStatus = (authenticatedWs: AuthenticatedWebSocket, ws: WebSocket) => {

    if (authenticatedWs.user?.role !== "teacher") {
        ws.send(JSON.stringify({
            event: "ERROR",
            message: "Only teachers can mark attendance"
        }))

        return false
    }

    if (!activeSession?.classId) {
        ws.send(JSON.stringify({
            event: 'ERROR',
            message: 'No active session. Please start a session first.'
        }))

        return false
    }

    return true
}