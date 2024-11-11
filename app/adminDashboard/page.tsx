"use client"
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
const AdminLogin: React.FC = () => {
    const [user, setUser] = useState({
        user_email: "",
        user_password: "",
    });
   // const [check, setCheck] = useState(false);
    const router = useRouter();

    const onTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async () => {
        try {
            const response = await axios.get("http://192.168.0.50:3333/Admin");
            const users = response.data;

            const foundUser = users.find(
                (u: { user_email: string; user_password: string }) =>
                    u.user_email === user.user_email &&
                    u.user_password === user.user_password
            );

            if (foundUser) {
                sessionStorage.setItem("admin", user.user_email);
                router.push("/adminDashboard/dashboard");
            } else {
                alert("Wrong User Email or Password");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
           
            <div className=" flex flex-row w-full h-screen ">
        <div className=" hidden sm:flex flex-col w-1/2  bg-green-600 justify-center items-center  p-8  text-white  text-2xl font-semibold tracking-tight">
        <div className="w-full">   <Image alt="hello" height={30} width={30} src="/lds.png"/> <p>LearningDeck | Elearning Platform</p></div>
        </div>

        <div className=" flex flex-col bg-zinc-100 items-center justify-center w-full sm:w-6/12  text-black">
          <div className="flex flex-row w-full items-end mt-2 mr-2">
            <div className="w-full"/>
  
          </div>
         
        <div className="flex flex-col w-full   h-full  justify-center items-center px-10">           
      
        <div className=" h-5"/>

         <Image alt="hello" height={150} width={150} src="/lds.png"/>
     <div className=" h-5"/>
     <Input 
     className=" text-zinc-400 bg-sky-300/20 "
       title="Input Username" 
       name="user_email"
       onChange={onTextFieldChange}
       type="text"
      placeholder="Admin Username"
     
      ></Input>
        <div className=" h-5"/>
      <Input 
     className=" text-zinc-400 bg-sky-300/20 "
       title="Input Password" 
       name="user_password"
       onChange={onTextFieldChange}
       type="password"
      placeholder="Admin Password"
     
      ></Input>

         <div className=" h-5"/>
         <Button  onClick={handleLogin} className="text-[11px]   w-full bg-green-600 text-white hover:bg-zinc-500"   onClick={handleLogin}>Enter Key</Button></div>
         <div className=" h-5"/>

        
         </div>
        </div>
      
        </div>
    );
};

export default AdminLogin;
