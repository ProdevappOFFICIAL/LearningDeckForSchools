"use client"
import { Button } from "@/components/ui/button";
import { Card} from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Bolt} from "lucide-react";
import Image from "next/image";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"



   const AdminDashboard = () => {
    const [exam , setExam] = useState("Updating...");
    const [question , setQuestion] = useState("Updating...");
    const [user , setUser] = useState("Updating...");
    const [batchNo, setBatchNo] = useState(''); // initial batch number
    const { setTheme } = useTheme();
  
    // Fetch current batch data on component mount
    useEffect(() => {
      axios.get(`http://localhost:3333/Batch/${id}`)
        .then(response => {
          setBatchNo(response.data.batch_no);
        })
        .catch(error => {
          console.error('Error fetching batch data:', error);
        });
    }, [id]);
  
    // Function to handle updating the batch_no
    const handleUpdateBatchNo = () => {
      axios.put(`http://localhost:3333/Batch/${id}`, {
        batch_no: batchNo
      })
        .then(() => {
        
        })
        .catch(error => {
          console.error('Error updating batch number:', error);
        });
    };
    useEffect(() => {
      async function getAllExam(){
          const value  = await axios.get("http://localhost:3333/ExamCombination");
          setExam(value.data.length);
      }
      getAllExam();


      async function getAllQuestions(){
          const value  = await axios.get("http://localhost:3333/Question");
          setQuestion(value.data.length);
      }
      getAllQuestions();


      async function getAllUsers(){
          const value  = await axios.get("http://localhost:3333/User");
          setUser(value.data.length);
      }
      getAllUsers();
  })


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
  
      try {
         await convertTxtToJson(text); // Convert text file content to JSON
      } catch (error) {
          console.error("Error during file conversion or saving process:", error);
      }
  };
  
  const convertTxtToJson = async (txtContent) => {
    // Split content into lines, trim whitespace, and filter out empty lines
    const lines = txtContent.split('\n').map(line => line.trim()).filter(Boolean);

    // Extract metadata from the first three lines
    const className = lines[0]?.split('=')[1]?.replace(/"/g, '').trim() || '';
    const subjectName = lines[1]?.split('=')[1]?.replace(/"/g, '').trim() || '';
    const examName = lines[2]?.split('=')[1]?.replace(/"/g, '').trim() || '';

    // Check if required metadata is present
    if (!className || !subjectName || !examName) {
        console.error("Error: Missing required exam metadata.");
        return;
    }

    console.log("Parsed Metadata:", { className, subjectName, examName });

    const questions = [];
    let questionId = 1;
    let i = 3; // Start after metadata

    while (i < lines.length) {
        console.log(`Processing line ${i}: ${lines[i]}`); // Log current line being processed
        const line = lines[i];
        
        // Detect start of a new question
        if (line.startsWith('Q')) {
            // Parse the question text
            const questionText = line.slice(line.indexOf('.') + 1).trim();

            // Parse answer options A, B, C, D
            const answers = [];
            for (let j = 1; j <= 4; j++) {
                const answerLine = lines[i + j];
                if (answerLine && answerLine.startsWith(String.fromCharCode(64 + j))) { // A, B, C, D
                    const answerText = answerLine.slice(answerLine.indexOf('.') + 1).trim();
                    answers.push(answerText);
                } else {
                    console.warn(`Missing or malformed answer option for question ${questionId}, expected ${String.fromCharCode(64 + j)}`);
                }
            }

            // Ensure we have exactly 4 answer options
            if (answers.length !== 4) {
                console.error(`Question ${questionId} does not have exactly 4 answer options. Skipping this question.`);
                i += 6; // Move to the next question block
                questionId++;
                continue; // Skip to next question
            }

            // Parse the correct answer
            const answerLine = lines[i + 5];
            const correctAnswerLetter = answerLine ? answerLine.split(':')[1]?.trim().toUpperCase() : '';

            if (!correctAnswerLetter || !['A', 'B', 'C', 'D'].includes(correctAnswerLetter)) {
                console.error(`Invalid or missing correct answer for question ${questionId}, skipping question.`);
                i += 6; // Move to the next question block
                questionId++;
                continue; // Skip to next question
            }

            const correctAnswerText = answers[correctAnswerLetter.charCodeAt(0) - 65];
            const incorrectAnswers = answers.filter((_, index) => index !== (correctAnswerLetter.charCodeAt(0) - 65));

            // Prepare question data
            const questionData = {
                id: questionId.toString(),
                question: questionText,
                incorrect_answers: incorrectAnswers,
                correct_answer: correctAnswerText,
                class_name: className.toLowerCase(),
                exam_name: examName,
                subject: subjectName.toLowerCase()
            };

            console.log("Prepared Question Data:", questionData);

            // Attempt to save the question to the API
            try {
                const response = await axios.post("http://localhost:3333/Question", questionData);
                console.log(`Question ID ${questionId} saved successfully:`, response.data);
                toast("Added " + subjectName.toLowerCase() + " Questions");
            } catch (error) {
                console.error("API Error while saving question:", questionData, error);
            }

            questions.push(questionData);
            questionId++;
            i += 6; // Move to the next question block
        } else {
            i++; // Continue if line does not start with "Q"
        }
    }

    console.log(`Total questions processed: ${questions.length}`); // Log total processed questions
    return { Question: questions };
};



    return ( <div className="flex flex-col w-full">
        <Toaster />
     <div className="flex items-center gap-x-4 py-3 px-3 border-b w-full">
     <div className="flex items-center gap-x-2">   <Image className=" rounded-full border" alt="hello" height={50} width={50} src="/lds.png"/> <p className=" text-zinc-800  text-xl ">LearningDeck</p></div>
      <div className="w-full"/>
      <Dialog>
              <DialogTrigger asChild>
                <div>
                  <Button variant={'outline'}>Change Batch Number</Button>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className=" text-black/80">Batch Number</DialogTitle>
                  <DialogDescription className="w-full">

                    <div className="flex justify-between  w-full mt-5">
                      <div>
                        Change Exam Batch Number:
                      </div>
                     <select className=" bg-zinc-200/20 border px-2 py-1 rounded-sm" value={batchNo} onChange={e => setBatchNo(e.target.value)}>
                       <option value="1"> BATCH 1</option>
                       <option value="2"> BATCH 2</option>
                     </select>                
                    
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                  <Button onClick={handleUpdateBatchNo} className=" bg-blue-600">Save</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

    
      

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

            <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
          -------------------
        </div>
        <div className="text-[11px]">
        -------------------
        </div>
        </div>
        <div className="w-full"/>
        <p>
          
        </p>
          </div>
       
        </div>
        <div  className=" h-[50px]  shadow-none rounded-none  flex">
          <Separator className="h-full w-[5px] p-0 rounded bg-green-600"/>
          <div className="flex flex-row p-2 bg-zinc-200  border rounded-tr rounded-br ">
          <div className="flex w-[200px] flex-col  ">
          <div className=" text-sm">
          -------------------
        </div>
        <div className="text-[11px]">
        -------------------
        </div>
        </div>
        <div className="w-full"/>
        <p>
          
        </p>
          </div>
       
        </div>
        <div  className=" h-[50px]  shadow-none rounded-none  flex">
          <Separator className="h-full w-[5px] p-0 rounded bg-green-600"/>
          <div className="flex flex-row p-2 bg-zinc-200  border rounded-tr rounded-br ">
          <div className="flex w-[200px] flex-col  ">
          <div className=" text-sm">
          -------------------
        </div>
        <div className="text-[11px]">
        -------------------
        </div>
        </div>
        <div className="w-full"/>
        <p>
          
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