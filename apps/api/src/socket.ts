import { Server as HttpServer } from "http"
import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import type { AuthPayload } from "@diaspora/shared"
import * as messagingService from "./services/messaging"

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production"

export function setupSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
      credentials: true,
    },
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth.token ?? socket.handshake.query.token
    if (!token) return next(new Error("Authentication required"))
    try {
      const user = jwt.verify(token as string, JWT_SECRET) as AuthPayload
      ;(socket as any).user = user
      next()
    } catch {
      next(new Error("Invalid token"))
    }
  })

  io.on("connection", (socket) => {
    const user = (socket as any).user as AuthPayload
    console.log(`[WS] ${user.role} ${user.userId} connected`)

    socket.on("join:booking", (bookingId: string) => {
      socket.join(`booking:${bookingId}`)
      console.log(`[WS] ${user.userId} joined booking:${bookingId}`)
    })

    socket.on("leave:booking", (bookingId: string) => {
      socket.leave(`booking:${bookingId}`)
    })

    socket.on("message:send", async (data: { bookingId: string; content: string }) => {
      try {
        const message = await messagingService.sendMessage({
          bookingId: data.bookingId,
          senderId: user.userId,
          content: data.content,
        })
        io.to(`booking:${data.bookingId}`).emit("message:new", message)
      } catch (err) {
        socket.emit("error", { message: "Failed to send message" })
      }
    })

    socket.on("disconnect", () => {
      console.log(`[WS] ${user.userId} disconnected`)
    })
  })

  return io
}
