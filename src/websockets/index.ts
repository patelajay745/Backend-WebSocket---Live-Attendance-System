import { Server } from "http";
import { authenicateWebSocket } from "./middlewares/auth.middleware";
import { WebSocketServer, WebSocket } from "ws"
import { handleAttendaceMarked, handleMyAttendance } from "./handlers/attendace.handler";
import { handleEndSession } from "./handlers/session.handler";
import { handleTodaySession } from "./handlers/summary.handler";

export const setupWebSocket = (server: Server) => {

    const wss = new WebSocketServer({ server })

    wss.on('connection', (ws: WebSocket, req: Request) => {

        const authenticateedWs = authenicateWebSocket(ws, req)

        if (!authenticateedWs) {
            ws.send("401 unAuthorized")
            ws.close()
            return
        }

        ws.on("message", (message) => {
            try {

                const { event, data } = JSON.parse(message.toString())

                if (event === "ATTENDANCE_MARKED") handleAttendaceMarked(ws, data, wss, authenticateedWs)

                if (event === "DONE") {
                    handleEndSession(ws, data, wss, authenticateedWs)
                }

                if (event === "TODAY_SUMMARY") {
                    handleTodaySession(ws, data, wss, authenticateedWs)
                }

                if (event === "MY_ATTENDANCE") {
                    handleMyAttendance(ws, data, wss, authenticateedWs)
                }

            } catch (error) {

            }
        })

    })

    return wss

}