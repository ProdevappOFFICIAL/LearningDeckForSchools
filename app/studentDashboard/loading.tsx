"use client"
import { useEffect } from "react";
import Image from "next/image";


 const Loading = () => {
    useEffect(() => {
     setTimeout(() => {
     }, 10000);
    })
    return ( 
    
      <div className=" flex flex-col h-screen w-screen items-center justify-center bg-transparent">
      <Image className=" p-[1px] bg-green-400/20 rounded-full animate-in scale-90 opacity-10 duration-1000   animate-pulse  transition-all " alt="hello" height={110} width={110} src="/lds.png" />
    </div>
    );
 }
  
 export default Loading;