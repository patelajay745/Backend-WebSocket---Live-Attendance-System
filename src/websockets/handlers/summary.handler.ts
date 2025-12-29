
import { activeSession } from "@/controllers/attendance.controller";
import { AuthenticatedWebSocket } from "@/types/websocket"
import { checkStatus } from "@/utils/websocket/helper";
import { WebSocket, WebSocketServer } from "ws"

export const handleTodaySession = async (ws: WebSocket, data: any, wss: WebSocketServer, authenticatedWs: AuthenticatedWebSocket) => {

    if (!checkStatus(authenticatedWs, ws)) return;

    if (!activeSession) return;

    const attendanceSheet = Object.values(activeSession.attendace)
    const present = attendanceSheet.filter(status => status === "present").length
    const absent = attendanceSheet.filter(status => status === "absent").length

    const total = present + absent

    const messageToBroadcast = JSON.stringify({
        event: "TODAY_SUMMARY",
        data: {
            present,
            absent,
            total
        }
    })

    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(messageToBroadcast)
        }
    })

}