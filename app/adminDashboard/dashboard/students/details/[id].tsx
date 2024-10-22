"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

function StudentResult() {
    const router = useRouter();
    const { id } = router.query; // Get ID from query parameters

    const [result, setResult] = useState(null);

    useEffect(() => {
        if (user) {
            async function fetchStudentResult() {
                try {
                    const response = await axios.get(`http://192.168.137.1:3333/Result/${id}`);
                    setResult(response.data);
                } catch (error) {
                    console.error("Error fetching student result:", error);
                }
            }
            fetchStudentResult();
        }
    }, [id]); // Fetch data when id is available

    if (!id) return <p>Loading...</p>;
    if (!result) return <p>Loading result data...</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold">Results for {result.username}</h2>
            <p>Overall Score: {result.overallScore}</p>
            <h3 className="text-lg font-semibold">Subject Scores:</h3>
            <ul>
                {Object.entries(result.subjectScores).map(([subject, scores]) => (
                    <li key={subject}>
                        {subject.charAt(0).toUpperCase() + subject.slice(1)}: {scores.correct} / {scores.total}
                    </li>
                ))}
            </ul>

            <h3 className="text-lg font-semibold">Questions:</h3>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b">Question</th>
                        <th className="py-2 px-4 border-b">Your Answer</th>
                        <th className="py-2 px-4 border-b">Correct Answer</th>
                    </tr>
                </thead>
                <tbody>
                    {result.questions.map((question) => (
                        <tr key={question.id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">{question.question}</td>
                            <td className="py-2 px-4 border-b">
                                {question.options[question.userOption] || "Not attempted"}
                            </td>
                            <td className="py-2 px-4 border-b">{question.correct_answer}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={() => router.back()}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
                Go Back
            </button>
        </div>
    );
}

export default StudentResult;
