// pages/api/socket.ts
import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Socket as NetSocket } from 'net';
import type { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { SocketSchema } from "@/class/SocketSchema";
import { ItemInfo } from "@/class/ItemInfo";

type ReseponseWebSocket = NextApiResponse & {
    socket: NetSocket & { server: HttpServer & { io?: SocketServer } };
};

let id = 0;

export default function handler(req: NextApiRequest, res: ReseponseWebSocket) {
    let items: {id: number, slipId: number, itemInfo: ItemInfo, count: number}[] = [];
    
    if (req.method === "GET") {
        if (!res.socket.server.io) {
            const httpServer: HttpServer = res.socket.server;
            const io = new Server(httpServer, {
                path: "/api/socket",
            });

            io.on("connection", (socket) => {
                console.log("New client connected");
                socket.emit("hi");

                socket.on("message", (msg) => {
                    console.log("Message received:", msg);
                    const socketMessage: SocketSchema = JSON.parse(msg);
                    if(socketMessage.method === "Account"){
                        const content = socketMessage.content as {slipId: number, items: {itemInfo: ItemInfo, count: number}[]};
                        content.items.forEach(elem => {
                            // if(elem.itemInfo.type !== "goods"){
                            //     for(let i = 0; i < elem.count; ++i){
                            //         items.push({id: id++, slipId: content.slipId, itemInfo: elem.itemInfo});
                            //     }
                            // }
                            items.push({id: id++, slipId: content.slipId, itemInfo: elem.itemInfo, count: elem.count})
                        })

                        io.emit("message", JSON.stringify({method: "ItemsUpdate", content: items} as SocketSchema))
                    }
                    else if(socketMessage.method === "RequireItems"){
                        io.emit("message", JSON.stringify({method: "ItemsUpdate", content: items} as SocketSchema))
                    }
                    else if(socketMessage.method === "Done"){
                        const id = (socketMessage.content as {id: number}).id;
                        items = items.filter(item => item.id !== id);
                        io.emit("message", JSON.stringify({method: "ItemsUpdate", content: items} as SocketSchema))
                        console.log(items);
                    }
                    // console.log(io);
                    io?.emit("message", msg); // 全クライアントにメッセージを送信
                });

                socket.on("disconnect", () => {
                    console.log("Client disconnected");
                });
            });

            res.socket.server.io = io;
        }
        res.end();
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
