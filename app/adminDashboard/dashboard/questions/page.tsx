"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";


function Question() {
    const [questions, setQuestions] = useState([]);
    const [option1, setoption1] =useState([]);
    const [option2, setoption2] =useState();
    const [option3, setoption3] =useState(); 
    const {id} = useParams();
    const router = useRouter();

    const [userData , setUserData] = useState({
            id: id,
            exam_id: id,
            question: "",
            incorrect_answers: [
              option1,
              option2,
              option3,
            ],
            correct_answer: "",
            class_name: "",
            exam_name: "",
            subject: ""
     });

     function onTextFieldChange(e){
         setUserData({
             ...userData,
             [e.target.name] : e.target.value
         });
     }
     async function handleAddQuestion(){
        // console.log(userData);
        // console.log(password);
           router.push('/adminDashboard/dashboard/questions')
            await axios.post("http://localhost:3333/Question" , userData);
            
   }

    useEffect(() => {
        async function getAllQuestions() {
            try {
                const response = await axios.get("http://localhost:3333/Question");
                setQuestions(response.data);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        }
        getAllQuestions();
    }, []);

    return (
        <>
            <div className="m-4 max-w-screen-lg mx-auto">
             
            </div>

            <div className=" flex flex-col overflow-x-auto mx-4 items-center">
                <div className="flex justify-between">  <p className=" font-bold text-2xl my-3">List of All Questions</p>
                <AlertDialog>
      <AlertDialogTrigger asChild>
       <Button className="bg-blue-600 hover:bg-blue-400 text-white ">
                    Add New Question
                </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Question</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <div className="flex p-10 bg-zinc-200/20 items-center">
            <div >
                <label htmlFor="name">Question_img
                    <Input onChange={(e) => onTextFieldChange(e)} 
                    type="file" name="img_name" className=" w-full"  required />
                </label>
            </div>
                     </div>
          
            <div >
                <label htmlFor="name">Question 
                    <Input onChange={(e) => onTextFieldChange(e)} 
                    type="text" name="question"  required />
                </label>
            </div>
         
            <div >
                <label htmlFor="email"> Option 1
                    <Input onChange={(e) => setoption1(e)}  
                    type="text" name="correct_answer" required />
                </label>
            </div>

            <div >
                <label htmlFor="email"> Correct Answer
                    <Input onChange={(e) => onTextFieldChange(e)}  
                    type="text" name="correct_answer" required />
                </label>
            </div>

            <div >
                <label htmlFor="password"> Exam
                    <Input onChange={(e) => onTextFieldChange(e)} 
                    type="text" name="exam_name" required />
                </label>
            </div>
            <div >
                <label htmlFor="password"> Subject
                    <Input onChange={(e) => onTextFieldChange(e)} 
                    type="text" name="subject" required />
                </label>
            </div>
            <div >
                <label > Class (lowercase)
                        <Input onChange={(e) => onTextFieldChange(e)} 
                    type="text" name="class_name" required />
                </label>
                
            </div>
                     <AlertDialogCancel><Button onClick={handleAddQuestion}>Add Student</Button></AlertDialogCancel> 
    
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
                </div>
          
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Question</th>
                            <th className="py-2 px-4 border-b">Option One</th>
                            <th className="py-2 px-4 border-b">Option Two</th>
                            <th className="py-2 px-4 border-b">Option Three</th>
                            <th className="py-2 px-4 border-b">Option Four</th>
                            <th className="py-2 px-4 border-b">Correct Answer</th>
                            <th className="py-2 px-4 border-b">Subject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((data) => {
                            const options = [...data.incorrect_answers, data.correct_answer].sort(); // Mix options
                            return (
                                <tr key={data.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{data.question}</td>
                                    <td className="py-2 px-4 border-b">{options[0]}</td>
                                    <td className="py-2 px-4 border-b">{options[1]}</td>
                                    <td className="py-2 px-4 border-b">{options[2]}</td>
                                    <td className="py-2 px-4 border-b">{options[3]}</td>
                                    <td className="py-2 px-4 border-b">{data.correct_answer}</td>
                                    <td className="py-2 px-4 border-b">{data.subject}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Question;
