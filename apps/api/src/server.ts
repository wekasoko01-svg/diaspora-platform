import http from "http"
import app from "./app"
import { setupSocket } from "./socket"

const port = process.env.PORT ?? 4000
const httpServer = http.createServer(app)

setupSocket(httpServer)

httpServer.listen(port, () => {
  console.log(`API server running on port ${port}`)
})
