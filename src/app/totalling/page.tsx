'use client'

import { CSVDataSchema } from "@/class/CSVDataSchema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Main() {
    const router = useRouter();

    const [data, setData] = useState<{ name: string, price: number, discount: number, count: number }[]>([]);
    const [totalData, setTotalData] = useState<{ name: string, count: number, total: number }[]>([]);

    const fetchData = async () => {
        const res = await fetch("/api/account");
        const data: CSVDataSchema[] = (await res.json()).data;



        setData(data.map((elem, i) => ({ name: `${elem.name} ${elem.kind}`, price: Number(elem.price), discount: Number(elem.discount), count: Number(elem.count) })));
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let tempTotalData: { name: string, count: number, total: number }[] = [];

        data.forEach((elem) => {
            let isExist = false;
            for (let i = 0; i < tempTotalData.length; ++i) {
                if (tempTotalData[i].name == elem.name) {
                    tempTotalData[i].count++;
                    tempTotalData[i].total += (elem.price - elem.discount) * elem.count;
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                tempTotalData.push({ name: elem.name, count: 1, total: (elem.price - elem.discount) * elem.count });
            }
            setTotalData(tempTotalData);
        })
    }, [data]);

    return (
        <div>
            <div className="fixed top-0 bg-gray-100 h-12 outline outline-1 w-full flex justify-between items-center">
                <button
                    className="px-3 py-1 m-3 bg-green-100 active:bg-green-300 rounded-lg outline outline-1 outline-gray-500"
                    onClick={() => { router.push("/") }}
                >戻る</button>
            </div>
            <div className="h-12" />
            <div className="text-2xl p-5 text-center">まとめ表</div>
            <table className="m-5 table-auto outline outline-1">
                <thead>
                    <tr>
                        <th className="outline outline-1 p-2 bg-gray-100">
                            品名
                        </th>
                        <th className="outline outline-1 p-2 bg-gray-100">
                            個数
                        </th>
                        <th className="outline outline-1 p-2 bg-gray-100">
                            小計
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {totalData.map((item, i) => (
                        <tr key={i}>
                            <th className="outline outline-1 p-2">
                                {item.name}
                            </th>
                            <th className="outline outline-1 p-2">
                                {item.count}個
                            </th>
                            <th className="outline outline-1 p-2">
                                {item.total}円
                            </th>
                        </tr>
                    ))}
                    <tr>
                        <th className="outline outline-1 p-2">

                        </th>
                        <th className="outline outline-1 p-2">
                            合計
                        </th>
                        <th className="outline outline-1 p-2">
                            {String(totalData.reduce((a, b) => (a + b.total), 0))}円
                        </th>
                    </tr>
                </tbody>
            </table>
            <div className="text-2xl p-5 text-center">詳細表</div>
            <table className="m-5 table-auto outline outline-1">
                <thead>
                    <tr>
                        <th className="outline outline-1 p-2 bg-gray-100">
                            品名
                        </th>
                        <th className="outline outline-1 p-2 bg-gray-100">
                            価格
                        </th>
                        <th className="outline outline-1 p-2 bg-gray-100">
                            値引
                        </th>
                        <th className="outline outline-1 p-2 bg-gray-100">
                            個数
                        </th>
                        <th className="outline outline-1 p-2 bg-gray-100">
                            小計
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, i) => (
                        <tr key={i}>
                            <th className="outline outline-1 p-2">
                                {item.name}
                            </th>
                            <th className="outline outline-1 p-2">
                                {item.price}円
                            </th>
                            <th className="outline outline-1 p-2">
                                {item.discount}円引
                            </th>
                            <th className="outline outline-1 p-2">
                                {item.count}個
                            </th>
                            <th className="outline outline-1 p-2">
                                {(item.price - item.discount) * item.count}円
                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
