"use client";

import { io as ClientIO } from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";

type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
})

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const baseUrl = (typeof window !== 'undefined' ? window.location.origin : undefined) || process.env.NEXT_PUBLIC_SITE_URL!;
        const socketInstance = new (ClientIO as any)(baseUrl,{
            path: "/api/socket/io",
            addTrailingSlash: false,
            forceNew: false,
            autoConnect: true,
            rememberUpgrade: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 10,
            timeout: 60000,
            transports: ['websocket', 'polling']
        });
        
        socketInstance.on("connect", () => {
            console.log("🟢 Socket connected successfully:", socketInstance.id);
            setIsConnected(true);
        });
        
        socketInstance.on("disconnect", (reason: string) => {
            console.log("🔴 Socket disconnected, reason:", reason);
            setIsConnected(false);
        });
        
        socketInstance.on("connect_error", (error: any) => {
            console.error("❌ Socket connection error:", error);
            setIsConnected(false);
        });

        socketInstance.on("reconnect", (attemptNumber: number) => {
            console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
            setIsConnected(true);
        });

        setSocket(socketInstance);
        
        return () => {
            console.log("🧹 Cleaning up socket connection");
            socketInstance.removeAllListeners();
            socketInstance.disconnect();
        }   
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}