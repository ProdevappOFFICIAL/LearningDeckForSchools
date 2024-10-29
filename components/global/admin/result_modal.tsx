import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
interface QuestionData {
    id: number;
    question: string;
    options: string[];
    correct_answer: string;
    userOption: number | null;
}

interface ResultData {
    username: string;
    classname: string;
    overallScore: number;
    subjectScores: { [subject: string]: { correct: number; total: number } };
    questions: QuestionData[];
}

interface ResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: ResultData | null;
}
let x = 1;
const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, result }) => {
    if (!isOpen || !result) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex  items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-fit max-w-full overflow-y-auto max-h-[80vh]">
                <div className="flex justify-between mb-4"><h2 className="text-xl font-bold ">Detailed Result</h2> 
                <div className="space-x-3">
                  <Button className=" text-white rounded-sm bg-blue-600 hover:bg-blue-400"> Export as PDF</Button>
                     <button onClick={onClose} className=""> <X/></button> </div> </div>
                
                <div className=" flex justify-between border p-2">
                    <div className="flex flex-col">
  <p><strong>Username:</strong> {result.username}</p>
                <p className=" uppercase"><strong>Class:</strong> {result.classname}</p>
                <p><strong>Overall Score:</strong> {result.overallScore}%</p>
                    </div>
         <Image
                                                width={50}
                                                height={50}
                                                src={`/students/${result.full_name}.png`}
                                                className="flex rounded-full border border-green-600"
                                                alt="Student profile"
                                                onError={(e) => {
                                                    e.currentTarget.src = "/default-profile.png";
                                                } } />
         
                </div>
            
                
                <div className="my-2">
    <h3 className="font-semibold">Subject Scores:</h3>
    <table className="w-full border border-gray-300">
        <thead>
            <tr className="bg-zinc-200/20">
                {Object.keys(result.subjectScores).map((subject) => (
                    <th key={subject} className="py-2 px-4 border-b text-left uppercase">
                        {subject}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            <tr>
                {Object.entries(result.subjectScores).map(([subject, score]) => (
                    <td key={subject} className="py-2 px-4 border-b text-center">
                        {score.correct}/{score.total}
                    </td>
                ))}
            </tr>
        </tbody>
    </table>
</div>

                
                <div className="my-4">
                    <h3 className="font-semibold mb-2">Questions</h3>
                    <ul className="space-y-3">
                        {result.questions.map((question) => (
                            <li key={question.id} className="p-2 bg-gray-100 rounded-md">
                                <div className="font-semibold">Q {x++}: {question.question}</div>
                                <ul className="pl-4 mt-2 space-y-1">
                                    {question.options.map((option, index) => (
                                        <li
                                            key={index}
                                            className={`flex items-center ${
                                                option === question.correct_answer ? 'text-green-600 font-bold' : ''
                                            } ${index === question.userOption && option !== question.correct_answer ? 'text-red-500' : ''}`}
                                        >
                                            {String.fromCharCode(65 + index)}. {option}
                                            {option === question.correct_answer && <span className="ml-2">(Correct Answer)</span>}
                                            {index === question.userOption && option !== question.correct_answer && (
                                                <span className="ml-2">(Your Answer)</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <button onClick={onClose} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">Close</button>
            </div>
        </div>
    );
};

export default ResultModal;
