"use client"
import { Button } from "@/components/ui/button";
import { Card} from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Bolt, MoonIcon } from "lucide-react";
import Image from "next/image";
import { MoonLoader } from "react-spinners";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";

   const AdminDashboard = () => {
    const [exam , setExam] = useState("Updating...");
    const [question , setQuestion] = useState("Updating...");
    const [user , setUser] = useState("Updating...");
    const [jsonOutput, setJsonOutput] = useState<string>('');
    useEffect(() => {
      async function getAllExam(){
          const value  = await axios.get("http://192.168.137.1:3333/ExamCombination");
          setExam(value.data.length);
      }
      getAllExam();


      async function getAllQuestions(){
          const value  = await axios.get("http://192.168.137.1:3333/Question");
          setQuestion(value.data.length);
      }
      getAllQuestions();


      async function getAllUsers(){
          const value  = await axios.get("http://192.168.137.1:3333/User");
          setUser(value.data.length);
      }
      getAllUsers();
  })
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const jsonData = convertTxtToJson(text);
    setJsonOutput(JSON.stringify(jsonData, null, 2));
  };

  const convertTxtToJson = (txtContent) => {
    const lines = txtContent.split('\n').map(line => line.trim()).filter(Boolean);

    const className = lines[0].split('=')[1]?.replace(/"/g, '').trim() || '';
    const subjectName = lines[1].split('=')[1]?.replace(/"/g, '').trim() || '';
    const examName = lines[2].split('=')[1]?.replace(/"/g, '').trim() || '';

    const questions = [];
    let questionId = 1;

    // Mapping from letters to answers
    const answerMapping = {};

    for (let i = 4; i < lines.length; i++) {
        if (lines[i].startsWith('Q')) {
            const questionLine = lines[i];
            const questionText = questionLine.slice(questionLine.indexOf('.') + 1).trim();

            const answers = [];
            for (let j = 1; j <= 4; j++) {
                const answerLine = lines[i + j];
                if (answerLine && answerLine.startsWith(String.fromCharCode(64 + j))) { // A, B, C, D
                    const answerText = answerLine.slice(answerLine.indexOf('.') + 1).trim();
                    answers.push(answerText);
                    answerMapping[String.fromCharCode(64 + j)] = answerText; // Save the mapping
                }
            }

            const answerLine = lines[i + 5];
            const correctAnswerLetter = answerLine ? answerLine.split(':')[1]?.trim().toUpperCase() : '';

            // Defensive check for correctAnswerLetter
            if (!correctAnswerLetter || !['A', 'B', 'C', 'D'].includes(correctAnswerLetter)) {
                console.error("Invalid correct answer format for question ID:", questionId);
                continue; // Skip this question if the correct answer is invalid
            }

            // Log for debugging
            console.log("Collected Answers:", answers);
            console.log("Correct Answer Letter:", correctAnswerLetter);

            // Filter out the correct answer to get incorrect answers
            const incorrectAnswers = answers.filter((answer, index) => {
                return String.fromCharCode(65 + index) !== correctAnswerLetter; // A, B, C, D
            });

            questions.push({
                id: questionId.toString(),
                question: questionText,
                incorrect_answers: incorrectAnswers,
                correct_answer: answerMapping[correctAnswerLetter], // Get the actual answer text
                class_name: className.toLowerCase(),
                exam_name: examName,
                subject: subjectName.toLowerCase()
            });

            questionId++;
            i += 5; // Move to the next question block
        }
    }

    return {
        ExamCombination: [
            {
                id: "1",
                exam_name: examName,
                class_name: className.toLowerCase(),
                timer: "10:00",
                lock_mode: "true",
                enable_timer: "true"
            }
        ],
        Question: questions,
        Result: []
    };
};

    return ( <div className="flex flex-col w-full">
       <pre>{jsonOutput}</pre>
     <div className="flex items-center gap-x-4 py-3 px-3 border-b w-full">
     <div className="flex items-center gap-x-2">   <Image className=" rounded-full border" alt="hello" height={50} width={50} src="/lds.png"/> <p className=" text-zinc-800  text-xl ">LearningDeck</p></div>
      <div className="w-full"/>
    
      <Dialog>
              <DialogTrigger asChild>
                <div>
  <Button variant={'destructive'}> Import C.A.T</Button>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Import C.A.T</DialogTitle>
                  <DialogDescription>
                    <div className="mt-5">
                      <Input
                        type="file" accept=".txt" onChange={handleFileChange}
                        className="bg-zinc-200/20" />
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="submit" size="sm" className="bg-red-600 dark:bg-red-800 px-3 dark:text-white dark:hover:bg-green-400">
                      <p className="text-[11px] mr-2 text-zinc-200">
                      Import File
                      </p>
                    
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

      <MoonIcon/>
      <Bolt/>
     </div>
     <div>
      <div className="mx-4 mt-4">
       <Card className="flex w-full shadow-none border rounded-none p-2 bg-zinc-200/20 ">
        C.A.T DETAILS
      </Card>
      <div className="flex py-4 justify-between mx-0">
        <div  className=" h-[50px]  shadow-none rounded-none  flex">
          <Separator className="h-full w-[5px] p-0 rounded bg-orange-600"/>
          <div className="flex flex-row p-2 bg-orange-200  border rounded-tr rounded-br ">
          <div className="flex w-[200px] flex-col  ">
          <div className=" text-sm">
          Exams
        </div>
        <div className="text-[11px]">
          total number
        </div>
        </div>
        <div className="w-full"/>
        <p>
         
          {exam}
        </p>
          </div>
       
        </div>
        <div  className=" h-[50px]  shadow-none rounded-none  flex">
          <Separator className="h-full w-[5px] p-0 rounded bg-red-600"/>
          <div className="flex flex-row p-2 bg-red-200  border rounded-tr rounded-br ">
          <div className="flex w-[200px] flex-col  ">
          <div className=" text-sm">
          Questions
        </div>
        <div className="text-[11px]">
          total number
        </div>
        </div>
        <div className="w-full"/>
        <p>
          {question}
        </p>
          </div>
       
        </div>
        <div  className=" h-[50px]  shadow-none rounded-none  flex">
          <Separator className="h-full w-[5px] p-0 rounded bg-green-600"/>
          <div className="flex flex-row p-2 bg-green-200  border rounded-tr rounded-br ">
          <div className="flex w-[200px] flex-col  ">
          <div className=" text-sm">
          Students
        </div>
        <div className="text-[11px]">
          total number
        </div>
        </div>
        <div className="w-full"/>
        <p>
          {user}
        </p>
          </div>
       
        </div>
      </div>
      <div className="flex py-4 justify-between mx-0 hidden">
        <div  className=" h-[50px]  shadow-none rounded-none  flex">
          <Separator className="h-full w-[5px] p-0 rounded bg-zinc-600"/>
          <div className="flex flex-row p-2 bg-zinc-200  border rounded-tr rounded-br ">
          <div className="flex w-[200px] flex-col  ">
          <div className=" text-sm">
          Subjects
        </div>
        <div className="text-[11px]">
          total number
        </div>
        </div>
        <div className="w-full"/>
        <p>
          20
        </p>
          </div>
       
        </div>
        <div  className=" h-[50px]  shadow-none rounded-none  flex">
          <Separator className="h-full w-[5px] p-0 rounded bg-yellow-600"/>
          <div className="flex flex-row p-2 bg-yellow-200  border rounded-tr rounded-br ">
          <div className="flex w-[200px] flex-col  ">
          <div className=" text-sm">
          Classes
        </div>
        <div className="text-[11px]">
          total number
        </div>
        </div>
        <div className="w-full"/>
        <p>
          6
        </p>
          </div>
       
        </div>
        <div  className=" h-[50px]  shadow-none rounded-none  flex">
          <Separator className="h-full w-[5px] p-0 rounded bg-lime-600"/>
          <div className="flex flex-row p-2 bg-lime-200  border rounded-tr rounded-br ">
          <div className="flex w-[200px] flex-col  ">
          <div className=" text-sm">
          All C.A.T
        </div>
        <div className="text-[11px]">
          total number
        </div>
        </div>
        <div className="w-full"/>
        <p>
          20
        </p>
          </div>
       
        </div>
      </div>
    

      <Card className="flex w-full  p-2 shadow-none border rounded-none bg-zinc-200/20 ">
        C.A.T SETTINGS
      </Card>
   
      <div className="flex py-4 justify-between mx-0">
        <div  className=" h-[50px]  shadow-none rounded-none  flex">
          <Separator className="h-full w-[5px] p-0 rounded bg-green-600"/>
          <div className="flex flex-row p-2 bg-zinc-200  border rounded-tr rounded-br ">
          <div className="flex w-[200px] flex-col  ">
          <div className=" text-sm">
          Exam Number
        </div>
        <div className="text-[11px]">
          total number
        </div>
        </div>
        <div className="w-full"/>
        <p>
          20
        </p>
          </div>
       
        </div>
        <div  className=" h-[50px]  shadow-none rounded-none  flex">
          <Separator className="h-full w-[5px] p-0 rounded bg-green-600"/>
          <div className="flex flex-row p-2 bg-zinc-200  border rounded-tr rounded-br ">
          <div className="flex w-[200px] flex-col  ">
          <div className=" text-sm">
          Exam Number
        </div>
        <div className="text-[11px]">
          total number
        </div>
        </div>
        <div className="w-full"/>
        <p>
          20
        </p>
          </div>
       
        </div>
        <div  className=" h-[50px]  shadow-none rounded-none  flex">
          <Separator className="h-full w-[5px] p-0 rounded bg-green-600"/>
          <div className="flex flex-row p-2 bg-zinc-200  border rounded-tr rounded-br ">
          <div className="flex w-[200px] flex-col  ">
          <div className=" text-sm">
          Exam Number
        </div>
        <div className="text-[11px]">
          total number
        </div>
        </div>
        <div className="w-full"/>
        <p>
          20
        </p>
          </div>
       
        </div>
      </div>
    
     
      </div>
      </div>
     </div>
      );
   }
    
   export default AdminDashboard;