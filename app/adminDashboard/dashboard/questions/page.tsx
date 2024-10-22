"use client";
import axios from "axios";
import { useEffect, useState } from "react";

function Question() {
    const [questions, setQuestions] = useState([]);

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
            <p className=" font-bold text-2xl my-3">List of All Questions</p>
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
