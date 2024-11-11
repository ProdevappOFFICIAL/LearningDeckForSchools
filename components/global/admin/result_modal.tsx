import React, { useRef, useState } from "react";
import Image from "next/image";
import { Check, Eye, EyeClosed, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2pdf from 'html2pdf.js'; // Importing the html2pdf library
import { Input } from "@/components/ui/input";

interface QuestionData {
     img: string;
    subject: ReactNode;
    id: number;
   
    question: string;
    options: string[];
    correct_answer: string;
    userOption: number | null;
}

interface ResultData {
    img: string;
    username: string;
    classname: string;
    overallScore: number;
    subjectScores: { [subject: string]: { correct: number; total: number } };
    questions: QuestionData[];
    full_name: string; // Ensure you have this property for the image source
}

interface ResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: ResultData | null;
}

const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, result }) => {
    const contentRef = useRef<HTMLDivElement>(null); // Create a ref for the content to be exported
    const [show, setShow] = useState(false)
    if (!isOpen || !result) return null;
    const handleExportPDF = () => {
        if (contentRef.current) {
            const dialogElement = contentRef.current;
            const opt = {
                margin: 0.1,    // Adjust margin for dialog fit
                filename:  result.username + ' RESULT.pdf',
                image: { type: 'jpeg', quality: 100 },
                html2canvas: { 
                    scale: 10,    // Improve clarity for smaller dialog
                    width: dialogElement.offsetWidth,   // Fit to dialog's width
                    height: dialogElement.offsetHeight, // Fit to dialog's height
                    useCORS: true,
                },
                jsPDF: { unit: 'in', format: [dialogElement.offsetWidth, dialogElement.offsetHeight / 30], orientation: 'portrait' }
            };
    
            html2pdf().set(opt).from(dialogElement).save();
        }
    };
    const CHandle = () => {
        setShow(true)
    }
    const Chand = () => {
        setShow(false)
    }
    

    return (
        <div className="flex flex-col fixed inset-0 bg-black backdrop:blur-sm bg-opacity-50 flex items-center justify-center">
            
                <div className="flex flex-col bg-zinc-200 p-4 rounded-lg w-fit  max-w-full" >
                     <div className="flex items-center mt-3 bg-zinc-200 h-[20px] justify-between mb-4">
                    <h2 className="text-xl font-bold">Detailed Result</h2>
                    <div className="space-x-3">
                        <Button onClick={handleExportPDF} className="text-white rounded-sm bg-blue-600 hover:bg-blue-400">
                            Export as PDF
                        </Button>
                        <button onClick={onClose} className="">
                            <X />
                        </button>
                    </div>
                </div>
    <div className="bg-white p-4 rounded-lg w-fit mt-[10px] max-w-full overflow-y-auto max-h-[80vh]">
               

                <div ref={contentRef} className=" flex flex-col max-w-[600px] max-h-[1000px] my-4 w-full p-10 shadow-md"> {/* Wrap content with the ref */}
              <div className="flex items-end justify-end">

              </div>
           
                    <div className="flex flex-row justify-between border-t border-b bg-zinc-200/20 p-2">
                        <div className="flex flex-col">
                            <p><strong>Username:</strong> {result.username}</p>
                            <p className="uppercase"><strong>Class:</strong> {result.classname}</p>
                            
                        </div>
                        <Image
                            width={50}
                            height={50}
                            src={result.img}
                            className="flex rounded-full border border-green-600"
                            alt="Student profile"
                            onError={(e) => {
                                e.currentTarget.src = "/default-profile.png";
                            }}
                        />
                      
                    </div>
                    <div className="my-2 h-full pb-10">
                        <h3 className="font-semibold py-3">Subject Scores:</h3>
                        <table className=" w-full border border-gray-300">
                            <thead>
                                <tr className="bg-zinc-200/20">
                                    {Object.keys(result.subjectScores).map((subject) => (
                                        <th key={subject} className="py-2 px-4 border text-center uppercase">
                                            {subject}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {Object.entries(result.subjectScores).map(([subject, score]) => (
                                        <td key={subject} className="py-2 px-4  border text-center">
                                            {score.correct}/{score.total}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                  
                  
                </div>
                    <div className="flex w-full justify-between px-2 py-1  rounded items-center "> 
                        <div className="flex space-x-4"> 
                            <Button variant={'outline'} className="text-black " onClick={CHandle}>
                                <Eye /> <div className="ml-2">Show questions</div></Button> 
                    
                            <Button variant={'outline'} className="text-black " onClick={Chand}>
                        <EyeClosed/><div className="ml-2">Hide questions</div>
                        </Button></div> </div>

                        {show? (   <div className="my-4 w-fit max-w-[600px]">
                        <h3 className="font-semibold mb-2">Questions</h3>
                        
                        <ul className="space-y-3 border w-full">
                            {result.questions.map((question, index) => (
                                <li key={question.id} className="p-2 w-full border-t border-b">
                                    <div className="font-semibold">Q {index + 1}: {question.question}</div>
                                <div className="flex justify-between">
      <ul className="pl-4 mt-2 space-y-1">
                                        {question.options.map((option, idx) => (
                                        
                                            <li
                                                key={idx}
                                                className={`flex items-center ${
                                                    option === question.correct_answer ? 'text-green-600' : ''
                                                } ${idx === question.userOption && option !== question.correct_answer ? 'text-red-500' : ''}`}
                                            >
                                                {String.fromCharCode(65 + idx)}. {option}

                                                
                                                {option === question.correct_answer && <span className="ml-2">
                                                    <div  className="flex items-center p-1 rounded-full bg-green-600 text-white h-[15px] w-[15px]">
                                                        <Check height={10} width={10}/>
                                                        </div>
                                                        </span>}
                                                {idx === question.userOption && option !== question.correct_answer && (
                                                    <span className="ml-2">                                      
                                                     <div  className="flex items-center p-1 rounded-full bg-red-600 text-white h-[15px] w-[15px]">

                                                    <X height={10} width={10}/>
                                                    </div></span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                              {question.img?  ( <Image src={question.img}  height={outerHeight/5} width={outerWidth/5} className=" bg-blend-multiply bg-transparent"  style={{ transition: 'width 0.3s, height 0.3s' }} alt=""/>):(<div></div>)
     }   
                         </div>
                              
                                    <div className="flex items-end ">
                                        <div className="w-full"/>
                                  <div className="flex flex-row w-full px-2 py-1 rounded bg-green-600 text-white">Subject: {question.subject}</div>
                                    </div>
                                  
                                </li>
                                
                            ))}
                        </ul>
                    </div>):(<div></div>)}
             
                <button onClick={onClose} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">Close</button>
             
            </div>
                </div>
        
        </div>
    );
};

export default ResultModal;
