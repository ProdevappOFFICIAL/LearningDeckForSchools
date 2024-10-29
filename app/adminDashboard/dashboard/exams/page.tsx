"use client";
import axios from "axios";
import { useEffect, useState } from "react";

function Exams() {
    const [exam, setExams] = useState([]);

    useEffect(() => {
        async function getAllQuestions() {
            try {
                const response = await axios.get("http://localhost:3333/ExamCombination");
                setExams(response.data);
            } catch (error) {
                console.error("Error fetching exams:", error);
            }
        }
        getAllQuestions();
    }, []);

    return (
        <>
            <div className="m-4 max-w-screen-lg mx-auto">
             
            </div>

            <div className=" flex flex-col overflow-x-auto mx-4 items-center">
            <p className=" font-bold text-2xl my-3">List of All Exams</p>
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b text-left">Exam Name</th>
                            <th className="py-3 px-4 border-b text-left">Class Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exam.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="py-4 text-center text-gray-500">No exams available</td>
                            </tr>
                        ) : (
                            exam.map((data) => (
                                <tr key={data.id} className="hover:bg-gray-50 transition duration-200">
                                    <td className="py-2 px-4 border-b">{data.exam_name}</td>
                                    <td className="py-2 px-4 border-b uppercase">{data.class_name}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Exams;

