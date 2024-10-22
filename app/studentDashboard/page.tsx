'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { MoonLoader } from "react-spinners";
import { Users } from "lucide-react";
import Image from "next/image";

function ExamCombination() {
  const [examCombinations, setExamCombinations] = useState([]);
  const [userClass, setUserClass] = useState(""); // Store the user's class
  const [userID, setID] =useState('');
  const [userName, setName] =useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const router = useRouter();

  useEffect(() => {
    // Fetch the logged-in user information (assuming user is logged in and stored in sessionStorage)
    const loggedInUserEmail = sessionStorage.getItem("user");

    if (loggedInUserEmail) {
      // Fetch user data from JSON server to get the class name of the logged-in user
      axios
        .get("http://192.168.137.1:3333/User")
        .then((response) => {
          const userData = response.data.find(
            (user: { user_email: string; }) => user.user_email === loggedInUserEmail      );
    
          if (userData) {
            setUserClass(userData.class_name);
            setID(userData.user_email)
            setName(userData.user_password)
          
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
        .get("http://192.168.137.1:3333/ExamCombination")
        .then((response) => {
          // Filter exams based on the class of the user
          const filteredExams = response.data.filter((exam) => {
            if (userClass.toLowerCase().includes("js")) {
              return exam.exam_name === "EMBCCY" || exam.exam_name === "PALSE";
            } else if (userClass.toLowerCase().includes("s")) {
              return exam.exam_name === "CGSAS" || exam.exam_name === "RADGE";
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
    router.push(`/studentDashboard/ExamPage/?user_name=${encodeURIComponent(userName)}&&class_name=${encodeURIComponent(userClass)}`)
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-between items-end ">
   <div className="h-full w-full  p-6 flex flex-col items-center">
      

      {loading ? (
        <p className="text-gray-500"><MoonLoader/></p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
        <div className="mb-6">
          <div className="flex items-center rounded-full p-5">
         <Image width={150} height={150} src={'/students/'+ userName + '.png'} className=" rounded-full border border-green-600" alt="Student logo"/>
          </div>
        </div>

        {examCombinations.length > 0 ? (
            <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
                {examCombinations.map((exam) => (
                    <><div
                    key={exam.id}
                    className="flex justify-between items-center p-4 bg-white shadow-lg rounded-lg cursor-pointer hover:bg-gray-100 transition"
                  >
                    <div className="flex-1 space-y-3">
                      <p className="border px-4 py-2">ADMISSION NUMBER: {userID}</p>
                      <p className="border px-4 py-2">NAME: {userName}</p>
                      <p className="border px-4 py-2 uppercase">CLASS: {userClass}</p>
                      <p className="border px-4 py-2">TIMER: {exam.timer}</p>
                    </div>

                  </div><button className="bg-green-600 rounded text-white py-2 hover:bg-green-400" onClick={() => handleExamClick(exam)}>
                      START EXAM
                    </button></>
                ))}
               
            </div>
            
        ) : (
            <p className="text-gray-500 mt-4">No exam available for your class.</p>
        )}
    </>
      )}

      
    </div>
    
    <div className="flex items-center text-sm py-1 px-2  rounded-full hover:bg-green-200 bg-green-200/20 border border-green-600 font-bold text-green-600 ">   <Image alt="hello" height={30} width={30} src="/lds.png"/> <p>Powered by LearningDeck for Schools </p></div>
    <div className=" h-5"/>
    </div>
 
  );
}

export default ExamCombination;