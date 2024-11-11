'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Maximize2Icon, Minimize2Icon} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

function ExamCombination() {
  const [examCombinations, setExamCombinations] = useState([]);
  const [userClass, setUserClass] = useState(""); // Store the user's class
  const [userID, setID] =useState('');
  const [userName, setName] =useState('');
  const [pass, setPass] =useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [batch, setBatchNo] = useState();
  
  const router = useRouter();

  useEffect(() => {

    // Fetch the logged-in user information (assuming user is logged in and stored in sessionStorage)
    const loggedInUserEmail = sessionStorage.getItem("user");

    if (loggedInUserEmail) {
      // Fetch user data from JSON server to get the class name of the logged-in user
      axios
        .get("http://192.168.0.50:3333/User")
        .then((response) => {
          const userData = response.data.find(
            (user: { user_email: string; }) => user.user_email === loggedInUserEmail      );
    
          if (userData) {
            setUserClass(userData.class_name);
            setID(userData.user_email)
            setName(userData.user_name)
            setPass(userData.img)
            
          
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setError("Could not fetch user data.");
        });
    }
  }, []);
  
  useEffect(() => {
    // Fetch the ExamCombination data after getting the user's class
    if (userClass) {
      setLoading(true); // Start loading
      axios
        .get("http://192.168.0.50:3333/Batch")
        .then((response) => {
          setBatchNo(response.data)
          console.log(" Batch number", response.data.Batch.batch_no );
        })
        .catch((error) => {
          console.error("Error with Batch number", error);
        });
    }
  }, [userClass]); 

  useEffect(() => {
    // Fetch the ExamCombination data after getting the user's class
    if (userClass) {
      setLoading(true); // Start loading
      axios
        .get("http://192.168.0.50:3333/ExamCombination")
        .then((response) => {
          // Filter exams based on the class of the user
          const filteredExams = response.data.filter((exam) => {
            if (userClass.toLowerCase().includes("js")) {
              return exam.exam_name === "JSS BATCH1"
         
              || exam.exam_name === "JSS BATCH2";
            } else if (userClass.toLowerCase().includes("s")) {
              return exam.exam_name === "SSS BATCH1" || exam.exam_name === "SSS BATCH2";
            }
            return false; // Return nothing if the class doesn't match js1-js3 or S1-S3
          });
          setExamCombinations(filteredExams);
          setLoading(false); // Loading complete
        })
        .catch((error) => {
          console.error("Error fetching the exam combinations:", error);
          setError("Could not fetch exam combinations.");
          setLoading(false); // Loading complete even on error
        });
    }
  }, [userClass]); // Fetch the exams after user class is set

  // Navigate to ExamPage with the selected exam details
  const handleExamClick = (exam) => {
    router.push(`/studentDashboard/ExamPage/?user_name=${encodeURIComponent(userName)}&&class_name=${encodeURIComponent(userClass)}&&exam_name=${encodeURIComponent(exam.exam_name)}&&min=${encodeURIComponent(exam.minutes)}`)
  };
  const goFullScreen = () => {
    const elem = document.documentElement; // Targeting the whole page
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen(); // Firefox
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(); // Chrome, Safari, and Opera
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen(); // IE/Edge
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen(); // Firefox
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen(); // Chrome, Safari, and Opera
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen(); // IE/Edge
    }
  };
  useEffect(() => {
    // Prevent F11 from activating full-screen
    const handleKeyDown = (event: { key: string; preventDefault: () => void; }) => {
      if (event.key === "F11") {
        
        event.preventDefault();
        alert("F11 is disabled on this page");
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
    <div className="h-screen w-screen flex flex-col justify-between items-end ">
      <div className="flex items-end space-x-3 m-3">
  <Button onClick={goFullScreen} variant={'outline'}><Maximize2Icon/> </Button>
      <Button onClick={exitFullScreen} className=" bg-red-600 text-white" variant={'destructive'}> <Minimize2Icon/> </Button>
      <Button className="bg-green-600 rounded-full px-[10px] hover:bg-green-400" onClick={Refresh}> <ReloadIcon/></Button>
      </div>
    

   <div className="h-full w-full  p-6 flex flex-col items-center overflow-y-auto">
      

      {loading ? (
      <div className=" flex flex-col h-screen w-screen items-center justify-center">
              <Image className=" p-[1px] bg-green-400/20 rounded-full animate-in scale-90 opacity-10 duration-1000   animate-pulse  transition-all " alt="hello" height={110} width={110} src="/lds.png" />
            </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
        <div className="mb-6">
          <div className="flex items-center rounded-full p-5">
        
          </div>
        </div>

    <div>
    {examCombinations.length > 0 ? (
            <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
                {examCombinations.map((exam) => (
                    <><div
                    key={exam.id}
                  >
                  
                  { exam.class_name === userClass ? (

                        <>  {batch.map((no)=>(
                        <div key={no.id}>
                                { exam.exam_name.includes(no.batch_no) ? (

                           <><div className="flex justify-between items-center p-2 bg-white dark:bg-zinc-600 dark:text-white shadow-lg rounded-lg cursor-pointer hover:bg-gray-100 transition">
                                <div className="flex flex-col w-full items-center space-y-3">
                                <Image width={150} height={150} src={pass} className=" rounded-full border border-green-600" alt="Student logo"/>
                                  <p className="border px-4 py-2 w-full">EXAM- NAME: {exam.exam_name} </p>
                                  <p className="border px-4 py-2 w-full">ADMISSION NUMBER: {userID}</p>
                                  <p className="border px-4 py-2 w-full">NAME: {userName}</p>
                                  <p className="border px-4 py-2 uppercase w-full">CLASS: {userClass}</p>
                                  <p className="border px-4 py-2 uppercase flex w-full">TIME: {exam.minutes} : 00</p>
                                 
                                </div>
                              </div><button className=" w-full mt-3 bg-green-600 rounded text-white py-2 hover:bg-green-400" onClick={() => handleExamClick(exam)}>
                                  START EXAM
                                </button></>):(<div></div>)} </div>))}</> 
                     
                      ): (
                        <div></div>
                      )
                    }
                

                  </div></>
                ))}
               
            </div>
            
        ) : (
            <p className="text-gray-500 mt-4">No exam available for your class.</p>
        )}
    </div>
    
    </>
      )}

      
    </div>
    
    <div className="flex items-center text-sm py-1 px-2  rounded-full hover:bg-green-200 bg-green-200/20 border border-green-600 font-bold text-green-600 ">   <Image alt="hello" height={30} width={30} src="/lds.png"/> <p>Powered by LearningDeck for Schools </p></div>
    <div className=" h-5"/>
    </div>
 
  );
}

export default ExamCombination;