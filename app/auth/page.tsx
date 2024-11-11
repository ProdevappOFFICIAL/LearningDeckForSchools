"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FlipWords } from "@/components/ui/flip-words";
import toast, { Toaster } from "react-hot-toast";
import { DiamondIcon, Loader, MoonStar, RefreshCcw } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";
const StudentLogin: React.FC = () => {
   const words = ["Path", "Premier", "Ultimate", "Key"];  
   const [loading , setloading] = useState(false);

   const performBackgroundAction = async () => {
     
        await new Promise((resolve) => setTimeout(resolve, 2000));
        handleLogin();
     
    };

    const handleKeyPress = (event: { key: string; }) => {
        // Check if the "Enter" key is pressed
        if (event.key === 'Enter') {
            performBackgroundAction(); // Trigger the action on "Enter"
        }
    };

    useEffect(() => {
        // Add event listener for keydown
        window.addEventListener('keydown', handleKeyPress);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

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
            const response = await axios.get("http://192.168.0.50:3333/User");
            const users = response.data;
            setloading(true)

            const foundUser = users.find(
                (u: { user_email: string; user_password: string }) =>
                    u.user_email === user.user_email &&
                    u.user_password === user.user_password
            );

            if (foundUser) {
               // setCheck(true);
               setloading(true)   
                sessionStorage.setItem("user", user.user_email);
            //  setloading(true)

    router.push(`/studentDashboard?user_name=${encodeURIComponent(user.user_password)}`)
             //   router.push("/studentDashboard");
            } else {
                setloading(true)
                if(users.find(
                  (u: { user_email: string; user_password: string }) =>
                      u.user_email != user.user_email &&
                     u.user_password === user.user_password
                      )
  ){
    toast('Wrong Admission Number')
                } else if (users.find(
                  (u: { user_email: string; user_password: string }) =>
                    u.user_password != user.user_password &&
                  u.user_email != user.user_email
                      )) {
                        toast('Wrong Password')
                } else{
                   toast('Wrong ')
                }
               
            }
        } catch (error) {
            console.error("Login error:", error);
            setloading(false)
            toast('Wrong ' + error)
        }
    };
  
      useEffect(() => {
        // Prevent F11 from activating full-screen
        const handleKeyDown = (event: { key: string; preventDefault: () => void; }) => {
          if (event.key === "enter") {
            
            event.preventDefault();
            //alert("F11 is disabled on this page");
            handleLogin();
          }
        };
    
        window.addEventListener("keydown", handleKeyDown);
    
        // Cleanup the event listener on component unmount
        return () => {
          window.removeEventListener("keydown", handleKeyDown);
        };
      }, []);

      const Refresh = () => {
        window.location.reload();
      }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
     <Toaster/>
            <div className=" flex flex-row w-full h-screen ">
        <div className=" hidden sm:flex flex-col w-1/2  bg-green-600 justify-center items-center  p-8  text-white  text-2xl font-semibold tracking-tight">
        <div className="w-full">   
          <Image className=" p-[1px] bg-green-400/20 rounded-full animate-bounce " alt="hello" height={30} width={30} src="/lds.png"/> 
        <div>LearningDeck | Your<FlipWords className=" text-white/70 mx-2 px-2 py-1 rounded-full bg-green-400/20" words={words} /> <br/>Gateway to Success</div></div>
        </div>

        <div className=" flex flex-col bg-white items-center justify-center w-full sm:w-6/12  text-black">
       
      
        
        
        <div className="flex flex-row w-full justify-end items-end space-x-3 m-3 mr-3">
  <Button className="bg-green-600 rounded-full px-[10px] hover:bg-green-400" onClick={Refresh}> <ReloadIcon/></Button>
      <div className="w-3"/>
      </div>
          <div className="flex flex-row w-full items-end mt-2 mr-2">
            <div className="w-full"/>
  
          </div>
         
        <div className="flex flex-col w-full   h-full  justify-center items-center px-10">           
      
        <div className=" h-5"/>

         <Image  alt="UNCLE TEE LOGO" height={400} width={400} className="rounded-full pointer-events-none "   src="/utss.png.png"/>
         <p className="flex font-bold text-2xl ml-[-10px] mt-[-40px] text-black/75 items-center pointer-events-none ">UNCLE TEE SECONDARY SCHOOL ONDO</p>
     <div className=" h-5"/>
     <Input 
     className=" text-zinc-900 border border-zinc-200  "
       title="Input Username" 
       name="user_email"
       onChange={onTextFieldChange}
       type="text"
      placeholder="Enter your Admission Number"
     
      ></Input>
        <div className=" h-5"/>
      <Input 
     className=" text-zinc-900 border border-zinc-200 "
       title="Input Password" 
       name="user_password"
       onChange={onTextFieldChange}
       type="text"
      placeholder="Password"
     
      ></Input>

         <div className=" h-5"/>
         {loading? (<Button  onClick={handleLogin}  className="text-[11px]    w-full bg-green-600 text-white hover:bg-green-600"> 
          <div className=" text-zinc-200 animate-spin ">    
           <Loader/>
           </div>
         </Button>
        ): (
          <Button  onClick={handleLogin}  className="text-[11px]   w-full bg-green-600 text-white hover:bg-green-400"> <div>Login</div> </Button>
        )}
        </div>
         <div className=" h-5"/>

        
         </div>
        </div>
      
        </div>
    );
};

export default StudentLogin;
