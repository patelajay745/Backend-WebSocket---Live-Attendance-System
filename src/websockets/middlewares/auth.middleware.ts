import { WebSocket } from "ws"
import { config } from "@/config"
import url from "url"
import jwt from "jsonwebtoken"
import { AuthenticatedWebSocket } from "@/types/websocket"

export const authenicateWebSocket = (ws: WebSocket, req: Request) => {
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

    return authenticatedWs
}