"use client"

import { ItemInfo } from "@/class/ItemInfo";
import { itemInfos } from "@/constants/items";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./globals.css";
import { io, Socket } from "socket.io-client";
import { SocketSchema } from "@/class/SocketSchema";
import { PostDataSchema } from "@/class/CSVDataSchema";

const RegiButton = ({c, onClickHandler}: {c: string, onClickHandler: () => void}) => {
    return (
        <button 
            className="m-2 h-8 bg-white active:bg-gray-200 rounded-2xl outline outline-2 text-2xl flex items-center justify-center"
            onClick={onClickHandler}
        >
            {c}
        </button>
    )
}

export default function Main() {
    const parseData = (dataStr: string): {itemInfo: ItemInfo, count: number}[] => {
        const itemList: {itemInfo: ItemInfo, count: number}[] = [];
        const datas: string[] = dataStr.split("d");
        datas.forEach((elem, i) => {
            if(i != 0){
                const splitedData = elem.split('i');
                const tempItemInfo: ItemInfo = itemInfos[Number(splitedData[0])];
                const tempCount: number = Number(splitedData[1]);
                
                itemList.push({itemInfo: tempItemInfo, count: tempCount});
            }
        });

        return itemList;
    }

    const [message, setMessage] = useState("hoge");
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io({ path: "/api/socket" });
        setSocket(newSocket);

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    const sendMessage = () => {
        console.log("Send message:", message);
        socket?.emit("message", message);
    };

    const router = useRouter();
    
    // 預り金
    const [deposit, setDeposit] = useState(0);
    // おつり
    const [change, setChange] = useState(0);
    
    const [doneAccounting, setDoneAccounting] = useState(false);
    const [itemList, setItemList] = useState<{itemInfo: ItemInfo, count: number}[]>([]);
    const [items, setItems] 
        = useState<{itemInfo: ItemInfo, count: number, discount: number}[]>([]);
    const [total, setTotal] = useState(0);
    const [slipId, setSlipId] = useState(1);
    
    const searchParams = useSearchParams();
    const dataString: string = searchParams!.get("data") || "";

    useEffect(() => {
        setItemList(parseData(dataString));
    }, [dataString]);

    useEffect(() => {
        const newAccountData = itemList.map(elem => ({
            itemInfo: elem.itemInfo,
            count: elem.count,
            discount: 0,
        }));
        setItems(newAccountData);

        const newTotal = newAccountData
            .map(elem => (elem.itemInfo.price - elem.discount) * elem.count)
            .reduce((a, b) => a + b, 0);
        setTotal(newTotal);
    }, [itemList]);

    useEffect(()=>{
        if(message === "") return;
        sendMessage();
    }, [message]);

    useEffect(()=>{
        console.log("hi");
        const newTotal = items
            .map(elem => (elem.itemInfo.price - elem.discount) * elem.count)
            .reduce((a, b) => a + b, 0);
        setTotal(newTotal);
    }, [items]);

    return (
      <div>
        <div className="fixed top-0 bg-gray-100 h-12 outline outline-1 w-full flex justify-between items-center">
            <button 
                className="px-3 py-1 m-3 bg-green-100 active:bg-green-300 rounded-lg outline outline-1 outline-gray-500"
                onClick={()=>{router.push("/regi")}}
            >戻る</button>
        </div>
        <div className="h-12"/>
        <div>
            {items.map((elem, i) => (
                <div key={i} className="m-2 p-2 bg-green-100 rounded-xl outline outline-1 flex justify-between items-center">
                    <div className="flex flex-col w-1/3">
                        <div>{elem.itemInfo.name}</div>
                        <div>{elem.itemInfo.kind}</div>
                    </div>
                    <div>{elem.itemInfo.price} 円</div>
                    <div className="flex flex-col justify-center items-center">
                        <div className="text-center">値引き</div>
                        <input type="text" className="w-16"
                            onChange={(e) => {
                                // console.log(Number(e.target.value));
                                const value = Number(e.target.value);
                                if(value){
                                    console.log(value);
                                }
                                elem.discount = value;
                                setItems([...items]);
                            }}    
                        />
                    </div>
                    <div>{elem.count} 個</div>
                </div>
            ))}
        </div>
        <div className="h-96"></div>
        <div className="fixed bottom-0 h-96 w-full bg-lime-50 outline outline-1 flex flex-col">
            <div className="flex justify-between items-center">
                <div className="p-3 text-xl">計 {total} 円</div>
                <div className="flex">
                <div>伝票番号</div>
                <div className="mx-4">
                    <select className="text-xl" onChange={(e) => {setSlipId(Number(e.target.value))}}>
                        {[...Array(20)].map((_, i) => (
                            <option key={i}>{i + 1}</option>
                        ))}
                    </select>
                </div>
                </div>
            </div>
            <div className="grid grid-cols-3 w-auto">
                <RegiButton c="C" onClickHandler={()=>{
                    if(doneAccounting) return;
                    setDeposit(0);
                }}/>
                <RegiButton c="" onClickHandler={()=>{}}/>
                <RegiButton c="<" onClickHandler={()=>{
                    if(doneAccounting) return;
                    setDeposit(Number(String(deposit).slice(0, -1)))
                }}/>
                <RegiButton c="1" onClickHandler={()=>{
                    if(doneAccounting) return;
                    setDeposit(Number(String(deposit) + "1"))
                }}/>
                <RegiButton c="2" onClickHandler={()=>{
                    if(doneAccounting) return;
                    setDeposit(Number(String(deposit) + "2"))
                }}/>
                <RegiButton c="3" onClickHandler={()=>{
                    if(doneAccounting) return;
                    setDeposit(Number(String(deposit) + "3"))
                }}/>
                <RegiButton c="4" onClickHandler={()=>{
                    if(doneAccounting) return;
                    setDeposit(Number(String(deposit) + "4"))
                }}/>
                <RegiButton c="5" onClickHandler={()=>{
                    if(doneAccounting) return;
                    setDeposit(Number(String(deposit) + "5"))
                }}/>
                <RegiButton c="6" onClickHandler={()=>{
                    if(doneAccounting) return;
                    setDeposit(Number(String(deposit) + "6"))
                }}/>
                <RegiButton c="7" onClickHandler={()=>{
                    if(doneAccounting) return;
                    setDeposit(Number(String(deposit) + "7"))
                }}/>
                <RegiButton c="8" onClickHandler={()=>{
                    if(doneAccounting) return;
                    setDeposit(Number(String(deposit) + "8"))
                }}/>
                <RegiButton c="9" onClickHandler={()=>{
                    if(doneAccounting) return;
                    setDeposit(Number(String(deposit) + "9"))
                }}/>
                <RegiButton c="" onClickHandler={()=>{}}/>
                <RegiButton c="0" onClickHandler={()=>{
                    if(doneAccounting) return;
                    setDeposit(Number(String(deposit) + "0"))
                }}/>
                <RegiButton c="▽" onClickHandler={()=>{
                    if(deposit < total) return;
                    setChange(deposit - total);
                    setDoneAccounting(true);
                }}/>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-xl p-2">お預かり {deposit} 円</div>
                    <div className="text-xl p-2">おつり {change} 円</div>
                </div>
                <div>
                <button 
                className={`w-16 h-12 px-3 py-1 m-3 rounded-lg outline outline-1 outline-gray-500 ${doneAccounting ? "bg-green-100" : "bg-gray-50"} ${doneAccounting ? "active:bg-green-300" : ""}`}
                onClick={async ()=>{
                    if(!doneAccounting) return;
                    setMessage(JSON.stringify({
                        method: "Account", 
                        content: {slipId: slipId, items: items.map(elem => ({
                            itemInfo: elem.itemInfo, count: elem.count} as {itemInfo: ItemInfo, count: number}
                        ))
                    } as {slipId: number, items: {itemInfo: ItemInfo, count: number}[]}
                    } as SocketSchema));
                    
                    const postDatas: PostDataSchema[] = [];
                    items.forEach(item => {
                        postDatas.push({
                            name: item.itemInfo.name,
                            kind: item.itemInfo.kind,
                            price: String(item.itemInfo.price),
                            discount: String(item.discount),
                            count: String(item.count),
                            type: item.itemInfo.type
                        })
                    })

                    await fetch("/api/account", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            data: postDatas
                        })
                    })

                    router.push("/regi");
                }}
            >完了</button>
                </div>
            </div>
        </div>
      </div>
    );
  }
