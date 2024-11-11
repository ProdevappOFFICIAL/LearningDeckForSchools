"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Splash_page = () => {
const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/auth')
    }, 0);
  })
  return ( 
    <div className=" flex flex-col h-screen w-screen items-center justify-center bg-green-600">
    <Image className=" p-[1px] bg-green-400/20 rounded-full animate-in scale-90 opacity-10 duration-1000 animate-out fade-in-100   animate-pulse  transition-all " alt="hello" height={110} width={110} src="/lds.png" />
    <div className="title">

        </div>
    
  </div>
  );
}
 
export default Splash_page;