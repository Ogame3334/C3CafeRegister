// pages/index.tsx
import Head from "next/head";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./globals.css"
import { ItemInfo } from "@/class/ItemInfo";
import { SocketSchema } from "@/class/SocketSchema";
import { useRouter } from "next/navigation";

const socket = io({ path: "/api/socket" });

const Home = () => {
    const [message, setMessage] = useState("");
    const [items, setItems] = useState<{id: number, slipId: number, itemInfo: ItemInfo}[]>([]);

    useEffect(() => {
        socket.on("message", (msg) => {
            // console.log("received message:", msg);
            const socketData = JSON.parse(msg) as SocketSchema;
            if(socketData.method === "ItemsUpdate"){
                setItems(socketData.content as {id: number, slipId: number, itemInfo: ItemInfo}[]);
            }
        });

        return () => {
            socket.off("message");
        };
    }, []);

    useEffect(()=>{
        console.log(items);
    }, [items]);

    const sendMessage = () => {
        socket.emit("message", message);
        setMessage("");
    };

    useEffect(()=>{
        if(message === "") return;
        sendMessage();
    }, [message]);

    const router = useRouter();

    return (
        <div>
            <Head>
                <title>伝票</title>
                <meta name="description" content="Socket.IO with Next.js and TypeScript" />
            </Head>
            <main>
                <div className="fixed top-0 bg-gray-100 h-12 outline outline-1 w-full flex justify-between items-center">
                <button 
                        className="px-3 py-1 m-3 bg-green-100 rounded-lg outline outline-1 outline-gray-500"
                        onClick={()=>{router.push("/")}}
                    >戻る</button>
                <button 
                        className="px-3 py-1 m-3 bg-green-100 rounded-lg outline outline-1 outline-gray-500"
                        onClick={()=>{
                            setMessage(JSON.stringify({method: "RequireItems", content: {}} as SocketSchema));
                        }}
                    >再読み込み</button>
                </div>
                <div className="h-12"/>
                {items.map((elem, i) => (
                    <div key={i} className="bg-lime-100 m-3 p-3 rounded-md outline outline-1 flex justify-between">
                        <div className="text-3xl">{elem.slipId}</div>
                        <div>{elem.itemInfo.name} {elem.itemInfo.kind}</div>
                        <button 
                            className="p-2 bg-white outline outline-1 rounded-md"
                            onClick={()=>{
                                setMessage(JSON.stringify({method: "Done", content: {id: elem.id}} as SocketSchema))
                            }}
                            >完了</button>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default Home;
