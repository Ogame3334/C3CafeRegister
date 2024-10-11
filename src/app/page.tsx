"use client"

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  return (
    <main>
      <div className="text-3xl text-center p-5">C3 Checkout Counter</div>
      <div 
        onClick={()=>{router.push("/regi")}} 
        className="m-10 p-3 bg-green-100 active:bg-green-300 rounded-full outline outline-1 text-2xl text-center">
        レジ
      </div>
      <div 
        onClick={()=>{router.push("/slip")}} 
        className="m-10 p-3 bg-green-100 active:bg-green-300 rounded-full outline outline-1 text-2xl text-center">
        伝票
      </div>
    </main>
  );
}
