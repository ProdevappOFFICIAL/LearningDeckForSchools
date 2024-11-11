"use client"
import { Button } from "@/components/ui/button";
import { Card} from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Bolt, Copy, FileDown, Import, Layout} from "lucide-react";
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


interface Question {
  id: string;
  question: string;
  incorrect_answers: string[];
  correct_answer: string;
}

interface ExamData {
  class_name: string;
  subject: string;
  exam_name: string;
  questions: Question[];
}

   const AdminDashboard = () => {
    const [exam , setExam] = useState("Updating...");
    const [question , setQuestion] = useState("Updating...");
    const [user , setUser] = useState("Updating...");
    const [batchNo, setBatchNo] = useState(''); // initial batch number
    const { setTheme } = useTheme();
    const id = 1
    const [jsonData, setJsonData] = useState<ExamData | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [errorLog, setErrorLog] = useState<string[]>([]);
  const [base64, setBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);



  const handleCopy = () => {
    if (base64) {
      navigator.clipboard.writeText(base64).then(() => {
        toast('Copied to clipboard')
        setCopySuccess("Copied to clipboard!");
        setTimeout(() => setCopySuccess(null), 2000); // Clear the success message after 2 seconds
      }).catch(err => {
        toast('Failed to Copied to clipboard')
        setCopySuccess("Failed to copy!");
      });
    }
  };

  // Function to convert file to base64
  const handlePNGFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64(reader.result as string);
        setFileName(file.name);
      };
      reader.readAsDataURL(file); // Convert the file to base64
    } else {
      alert('Please upload a PNG file.');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileContent = await file.text();

    const examData: ExamData = {
   
      questions: [],
    };

    let questionText = "";
    let answerOptions: string[] = [];
    let correctAnswer = "";
    const errors: string[] = [];

    // Define regex patterns to match class, subject, exam, questions, options, and answers
    const classRegex = /Class\s*=\s*"([^"]+)"/;
    const subjectRegex = /Subject-name\s*=\s*"([^"]+)"/;
    const examNameRegex = /Exam-name\s*=\s*"([^"]+)"/;
    const questionRegex = /Q\d+\.\s*(.+)/;
    const optionRegex = /^[A-Da-d]\.\s*(.+)/;
    const answerRegex = /Answer\s*:\s*([A-Da-d])/;

    const lines = fileContent.split("\n");

    lines.forEach((line) => {
      const text = line.trim();
      if (classRegex.test(text)) {
        examData.class_name = text.match(classRegex)?.[1] || "";
      } else if (subjectRegex.test(text)) {
        examData.subject = text.match(subjectRegex)?.[1] || "";
      } else if (examNameRegex.test(text)) {
        examData.exam_name = text.match(examNameRegex)?.[1] || "";
      } else if (questionRegex.test(text)) {
        // Save the previous question if complete
        if (questionText && answerOptions.length === 4 && correctAnswer) {
          const questionId = (examData.questions.length + 1).toString();
          examData.questions.push({
            id: questionId,
            question: questionText,
            incorrect_answers: answerOptions.filter((opt) => opt !== correctAnswer),
            correct_answer: correctAnswer,
            class_name: examData.class_name, // Add class_name
            subject: examData.subject, // Add subject
            exam_name: examData.exam_name, // Add exam_name
          });
        } else if (questionText) {
          errors.push(`Skipped incomplete question: "${questionText}" - Issue: Missing correct answer or options.`);
        }
        
        // Start a new question
        questionText = text.match(questionRegex)?.[1] || "";
        answerOptions = [];
        correctAnswer = "";
      } else if (optionRegex.test(text)) {
        const optionText = text.slice(3).trim();
        
        if (answerOptions.length >= 4) {
          errors.push(`Extra option found for question: "${questionText}" - Option: "${optionText}"`);
        } else {
          answerOptions.push(optionText);
        }
      } else if (answerRegex.test(text)) {
        const answerMatch = text.match(answerRegex);
        if (answerMatch) {
          const answerIndex = answerMatch[1].toUpperCase(); // Normalize to uppercase
          correctAnswer = answerOptions[["A", "B", "C", "D"].indexOf(answerIndex)];
    
          // Check for a mismatch if the answer index doesn't match any option
          if (!correctAnswer) {
            errors.push(`Answer inconsistency for question: "${questionText}" - Expected answer option not found.`);
          }
        } else {
          errors.push(`Invalid answer format for question: "${questionText}" - Text: "${text}"`);
        }
      }
    });
    
    // Final check for the last question in the list
    if (questionText && answerOptions.length === 4 && correctAnswer) {
      const questionId = (examData.questions.length + 1).toString();
      examData.questions.push({
        id: questionId,
        question: questionText,
        incorrect_answers: answerOptions.filter((opt) => opt !== correctAnswer),
        correct_answer: correctAnswer,
        class_name: examData.class_name.toLocaleLowerCase, // Add class_name
        subject: examData.subject, // Add subject
        exam_name: examData.exam_name, // Add exam_name
      });
    } else if (questionText) {
      errors.push(`Skipped incomplete final question: "${questionText}" - Issue: Missing correct answer or options.`);
    }
    

    setJsonData(examData);
    setErrorLog(errors); // Log errors for skipped or incomplete questions
  };

  const handleExportToServer = async () => {
    if (jsonData && jsonData.questions.length > 0) {
      try {
        const responses = await Promise.all(
          jsonData.questions.map(async (question) => {
            const { id, question: questionText, incorrect_answers, correct_answer, class_name, subject, exam_name } = question;
            const payload = {
              id,
              question: questionText,
              incorrect_answers,
              correct_answer,
              class_name,
              subject,
              exam_name,
            };
  
            // Sending each question to the API
            return await axios.post("http://192.168.0.50:3333/Question", payload);
          })
        );
    toast(`Added ${jsonData.questions.length}  ${jsonData.subject} Questions Sucessfully`)
        setStatusMessage(`Data saved successfully! Response IDs: ${responses.map(res => res.data.id).join(', ')}`);
      } catch (error) {
        console.error("Failed to save data to JSON server:", error);
        setStatusMessage("Failed to save data. Please try again.");
      }
    } else {
      setStatusMessage("No questions to save.");
    }
  };
  

    // Fetch current batch data on component mount
    useEffect(() => {
      axios.get(`http://192.168.0.50:3333/Batch/${id}`)
        .then(response => {
          setBatchNo(response.data.batch_no);
        })
        .catch(error => {
          console.error('Error fetching batch data:', error);
        });
    }, [id]);
  
    // Function to handle updating the batch_no
    const handleUpdateBatchNo = () => {
      try {
          axios.put(`http://192.168.0.50:3333/Batch/${id}`, {
        batch_no: batchNo
      })
        toast('Changed to Batch'+ batchNo)
      } catch (error) {
         console.error('Error updating batch number:', error);
      }
    
    }
    
    useEffect(() => {
      async function getAllExam(){
          const value  = await axios.get("http://192.168.0.50:3333/ExamCombination");
          setExam(value.data.length);
      }
      getAllExam();


      async function getAllQuestions(){
          const value  = await axios.get("http://192.168.0.50:3333/Question");
          setQuestion(value.data.length);
      }
      getAllQuestions();


      async function getAllUsers(){
          const value  = await axios.get("http://192.168.0.50:3333/User");
          setUser(value.data.length);
      }
      getAllUsers();
  })







    return ( <div className="flex flex-col w-full">
    
 
        <Toaster />
     <div className="flex items-center gap-x-4 py-3 px-3 border-b w-full">
     <div className="flex justify-between rounded-full px-5 gap-x-2 items-center mx-4 bg-green-400/20">
        <Layout/>
        <p className=" text-2xl my-3">Dashboard</p>
    </div>
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
  <Button variant={'destructive'}> Convert to Base64</Button>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between mt-4"><p>Convert</p>       
                      <Button onClick={handleCopy} className="bg-green-600" style={{ marginTop: '10px' }}>
              <Copy/> 
            </Button>
       </DialogTitle>
                  <DialogDescription className=" max-h-[500px] scroll-auto overflow-y-auto">
                    <div className="mt-5">
                    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
     
                    <div className="flex items-center justify-center">
      <input
        type="file"
     accept="image/*"
        id="file-upload"
        className="hidden" // Hide the default file input
        onChange={handlePNGFileChange}
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex items-center justify-center"
      >
        <div className="p-20 bg-zinc-600/20 hover:bg-zinc-400 rounded-full">
          <FileDown/>
        </div>
       
      </label>
    </div>
    <div style={{ marginTop: '20px' }} className="flex flex-col items-center">
        {base64 && (
          <>
          <Image src={base64} width={200} height={200} className=" rounded-full border border-green-600" alt="image"/>
          
          </>
        )}
      </div>
    </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
             
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
                  <DialogDescription className=" max-h-[500px] scroll-auto overflow-y-auto">
                    <div className="mt-5">
                    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
     
                    <div className="flex items-center justify-center">
      <input
        type="file"
        accept=".txt"
        id="file-upload"
        className="hidden" // Hide the default file input
        onChange={handleFileChange}
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex items-center justify-center"
      >
        <div className="p-20 bg-zinc-600/20 hover:bg-zinc-400 rounded-full">
          <FileDown/>
        </div>
       
      </label>
    </div>
      {jsonData && (
        <>
          <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
            <h3>All Questions</h3>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", maxHeight: "300px", overflow: "auto" }}>
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          </div>
          <DialogClose>
            <Button className=" bg-blue-600 my-5" onClick={handleExportToServer}>
            Add to my Questions
          </Button>
          </DialogClose>
          
          {statusMessage && <p>{statusMessage}</p>}
          {errorLog.length > 0 && (
            <div className=" my-5">
              <h4 className=" font-bold px-2 py-1 bg-red-600 rounded text-white my-2">Skipped or Incomplete Questions</h4>
              <ul className=" border p-5">
                {errorLog.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
             
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