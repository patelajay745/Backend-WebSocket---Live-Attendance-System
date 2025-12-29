import { Server } from "http";
import { authenicateWebSocket } from "./middlewares/auth.middleware";
import { WebSocketServer, WebSocket } from "ws"
import { handleAttendaceMarked } from "./handlers/attendace.handler";
import { handleEndSession } from "./handlers/session.handler";

export const setupWebSocket = (server: Server) => {

    const wss = new WebSocketServer({ server })

    wss.on('connection', (ws: WebSocket, req: Request) => {

        const authenticateedWs = authenicateWebSocket(ws, req)

        ws.on("message", (message) => {
            try {

                const { event, data } = JSON.parse(message.toString())

                if (event === "ATTENDANCE_MARKED") handleAttendaceMarked(ws, data, wss, authenticateedWs!)

                if (event === "DONE") {
                    handleEndSession(ws, data, wss, authenticateedWs!)
                }

            } catch (error) {

            }
        })

    })

    return wss

}