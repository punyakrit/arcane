import { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer, Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { Socket } from "net";

export const config = {
    api: {
        bodyParser: false,
    },
}

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        }
    }
}

export default async function ioHandler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if(!res.socket.server.io) {
        const path = "/api/socket/io";
        const httpServer: Server = res.socket.server as any;
        const io = new SocketIOServer(httpServer, {
            path,
            addTrailingSlash: false,
        });

        io.on("connection", (s) => { 
            console.log("🔌 Socket connected:", s.id);
            
            s.on("create-room", (fileId) => {
                console.log("🏠 Joining room:", fileId, "Socket:", s.id);
                s.join(fileId);
            });
            
            s.on("leave-room", (fileId) => {
                console.log("🚪 Leaving room:", fileId, "Socket:", s.id);
                s.leave(fileId);
            });
            
            s.on("send-changes", (deltas: any, fileId: string) => {
                console.log("📡 Broadcasting changes to room:", fileId, "from:", s.id);
                s.to(fileId).emit("receive-changes", deltas , fileId);
            });
            
            s.on("send-cursor-move", (range: any, fileId: string, cursorId: string) => {
                console.log("👆 Broadcasting cursor move to room:", fileId);
                s.to(fileId).emit("receive-cursor-move", range, fileId, cursorId);
            });
            
            s.on("disconnect", (reason) => {
                console.log("❌ Socket disconnected:", s.id, "Reason:", reason);
            });
            
            s.on("error", (error) => {
                console.error("⚠️ Socket error:", error);
            });
        });

        res.socket.server.io = io;
    }
    res.end();
}

