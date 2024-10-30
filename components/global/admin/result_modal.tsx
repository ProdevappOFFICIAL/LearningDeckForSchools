import React, { useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2pdf from 'html2pdf.js'; // Importing the html2pdf library

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
    full_name: string; // Ensure you have this property for the image source
}

interface ResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: ResultData | null;
}

const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, result }) => {
    const contentRef = useRef<HTMLDivElement>(null); // Create a ref for the content to be exported

    if (!isOpen || !result) return null;
    const handleExportPDF = () => {
        if (contentRef.current) {
            const dialogElement = contentRef.current;
            const opt = {
                margin: 0.5,    // Adjust margin for dialog fit
                filename: 'result.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,    // Improve clarity for smaller dialog
                    width: dialogElement.offsetWidth,   // Fit to dialog's width
                    height: dialogElement.offsetHeight, // Fit to dialog's height
                    useCORS: true,
                },
                jsPDF: { unit: 'in', format: [dialogElement.offsetWidth / 96, dialogElement.offsetHeight / 96], orientation: 'portrait' }
            };
    
            html2pdf().set(opt).from(dialogElement).save();
        }
    };
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-fit max-w-full overflow-y-auto max-h-[80vh]">
                <div className="flex justify-between mb-4">
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

                <div ref={contentRef} className="my-4"> {/* Wrap content with the ref */}
                    <div className="flex justify-between border-t border-b bg-zinc-200/20 p-2">
                        <div className="flex flex-col">
                            <p><strong>Username:</strong> {result.username}</p>
                            <p className="uppercase"><strong>Class:</strong> {result.classname}</p>
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
                            }}
                        />
                    </div>
                    <div className="my-2">
                        <h3 className="font-semibold py-3">Subject Scores:</h3>
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
                            {result.questions.map((question, index) => (
                                <li key={question.id} className="p-2 bg-gray-100 rounded-md">
                                    <div className="font-semibold">Q {index + 1}: {question.question}</div>
                                    <ul className="pl-4 mt-2 space-y-1">
                                        {question.options.map((option, idx) => (
                                            <li
                                                key={idx}
                                                className={`flex items-center ${
                                                    option === question.correct_answer ? 'text-green-600 font-bold' : ''
                                                } ${idx === question.userOption && option !== question.correct_answer ? 'text-red-500' : ''}`}
                                            >
                                                {String.fromCharCode(65 + idx)}. {option}
                                                {option === question.correct_answer && <span className="ml-2">(Correct Answer)</span>}
                                                {idx === question.userOption && option !== question.correct_answer && (
                                                    <span className="ml-2">(Your Answer)</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <button onClick={onClose} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">Close</button>
            </div>
        </div>
    );
};

export default ResultModal;
