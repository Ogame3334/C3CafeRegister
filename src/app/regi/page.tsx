'use client'

import { ItemInfo } from "@/class/ItemInfo";
import { ItemButton } from "../../components/regi/ItemButton";
import { useEffect, useState } from "react";
import {itemInfos} from "@/constants/items";
import { useRouter } from "next/navigation";


export default function Main() {
    const [itemList, setItemList] = useState<{itemIndex: number, itemInfo: ItemInfo, count: number}[]>([]);
    const [total, setTotal] = useState(0);

    const router = useRouter();

    useEffect(()=>{
        let sum = 0;
        itemList.forEach(elem => {
            sum += elem.itemInfo.price * elem.count;
        })
        setTotal(sum);
    }, [itemList]);
    
  return (
    <div>
        <div className="fixed top-0 bg-gray-100 h-12 outline outline-1 w-full flex justify-between items-center">
            <button 
                className="px-3 py-1 m-3 bg-green-100 active:bg-green-300 rounded-lg outline outline-1 outline-gray-500"
                onClick={()=>{router.push("/")}}
            >戻る</button>
        </div>
        <div className="h-12"/>
        <div className="grid grid-cols-2 bg-lime-100">
            {itemInfos.map((itemInfo, i) => (
                <ItemButton key={i} itemInfo={itemInfo} onClickHandler={()=>{
                    let isAdded = false;
                    const tempItemList: {itemIndex: number, itemInfo: ItemInfo, count: number}[] = [];

                    itemList.forEach((itemListElem) => {
                        if(itemListElem.itemInfo == itemInfo){
                            tempItemList.push({itemIndex: itemListElem.itemIndex, itemInfo: itemListElem.itemInfo, count: itemListElem.count + 1});
                            isAdded = true;
                        }
                        else{
                            tempItemList.push({itemIndex: itemListElem.itemIndex, itemInfo: itemListElem.itemInfo, count: itemListElem.count});
                        }
                    });
                    if(!isAdded){
                        tempItemList.push({itemIndex: i, itemInfo: itemInfo, count: 1});
                    }
                    setItemList(tempItemList);
                }}></ItemButton>
            ))}
        </div>

        <div className="h-20"/>
        <div className="h-12"/>
        <div className="fixed bottom-12 h-20 bg-white outline outline-1 w-full overflow-y-auto">
            {itemList.map((elem, i) => (
                <div key={i} className="px-3 flex justify-between text-xl">
                    <div>
                        {elem.itemInfo.name} {elem.itemInfo.kind}
                    </div>
                    <div className="text-right">{elem.itemInfo.price}円 {elem.count}個</div>
                </div>
            ))}
        </div>
        <div className="fixed bottom-0 bg-white h-12 outline outline-1 w-full flex justify-between items-center">
            <div className="text-2xl px-10">計{total}円</div>
            <button 
                className="p-2 m-3 bg-green-100 active:bg-green-300 rounded-lg outline outline-1 outline-gray-500"
                onClick={()=>{
                    if(itemList.length == 0) return;

                    let query: string = "";
                    itemList.forEach(elem => {
                        query += "d";
                        query += elem.itemIndex;
                        query += "i";
                        query += elem.count;
                    })

                    router.push("/account?data=" + query);
                }}
            >
                会計
            </button>
        </div>
    </div>
  );
}
