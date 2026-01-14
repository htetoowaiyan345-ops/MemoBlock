import { Server } from "colyseus"
import { WebSocketTransport } from "@colyseus/ws-transport"
import type { Server as HttpServer } from "http"
import { GameRoom } from "./rooms/GameRoom"

export function createColyseusServer(httpServer: HttpServer): Server {
  const pingInterval = Number(process.env.PING_INTERVAL ?? 3000)
  const pingMaxRetries = Number(process.env.PING_MAX_RETRIES ?? 2)

  const transport = new WebSocketTransport({
    server: httpServer,
    pingInterval,
    pingMaxRetries,
  })

  const gameServer = new Server({ transport })
  
  gameServer.define("game", GameRoom)
  
  return gameServer
}
