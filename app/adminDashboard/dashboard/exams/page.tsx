"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Book, BookOpenText } from "lucide-react";
import { useEffect, useState } from "react";

function Exams() {
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [form, setForm] = useState({ exam_name: "", class_name: "", minutes: "", seconds: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        fetchExams();
    }, []);

    // Fetch all exams
    async function fetchExams() {
        try {
            const response = await axios.get("http://192.168.0.50:3333/ExamCombination");
            setExams(response.data);
        } catch (error) {
            console.error("Error fetching exams:", error);
        }
    }

    // Handle form input change
    function handleInputChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    // Handle opening the dialog for adding a new exam
    function handleAddClick() {
        setSelectedExam(null);
        setForm({ exam_name: "", class_name: "", minutes: "", seconds: "" });
        setIsEditing(false);
        setShowDialog(true);
    }

    // Handle opening the dialog for editing an exam
    function handleEditClick(exam) {
        setSelectedExam(exam);
        setForm({ exam_name: exam.exam_name, class_name: exam.class_name, minutes: exam.minutes, seconds: exam.seconds });
        setIsEditing(true);
        setShowDialog(true);
    }

    // Handle saving (adding or updating) an exam
    async function handleSaveExam() {
        try {
            if (isEditing && selectedExam) {
                // Update the selected exam
                await axios.put(`http://192.168.0.50:3333/ExamCombination/${selectedExam.id}`, form);
                console.log("Exam updated successfully");
            } else {
                // Add a new exam
                await axios.post("http://192.168.0.50:3333/ExamCombination", form);
                console.log("New exam added successfully");
            }
            setForm({ exam_name: "", class_name: "", minutes: "", seconds: "" });
            setIsEditing(false);
            setShowDialog(false);
            fetchExams(); // Refresh exams list
        } catch (error) {
            console.error("Error saving exam:", error);
        }
    }

    // Handle deleting an exam
    async function handleDeleteClick(examId) {
        try {
            await axios.delete(`http://192.168.0.50:3333/ExamCombination/${examId}`);
            console.log("Exam deleted successfully");
            fetchExams(); // Refresh exams list
        } catch (error) {
            console.error("Error deleting exam:", error);
        }
    }

    return (
        <>
            <div className="m-4 max-w-screen-lg mx-auto">
              

                {/* Dialog for Add/Edit Exam */}
                {showDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="bg-white p-4 rounded shadow-lg">
                            <h3 className="text-xl font-bold">{isEditing ? "Edit Exam" : "Add Exam"}</h3>
                            <div className="flex flex-col space-y-3">
                                <input
                                    type="text"
                                    name="exam_name"
                                    value={form.exam_name}
                                    onChange={handleInputChange}
                                    placeholder="Exam Name"
                                    className="border p-2 rounded"
                                />
                                <input
                                    type="text"
                                    name="class_name"
                                    value={form.class_name}
                                    onChange={handleInputChange}
                                    placeholder="Class Name"
                                    className="border p-2 rounded"
                                />
                                <input
                                    type="number"
                                    name="minutes"
                                    value={form.minutes}
                                    onChange={handleInputChange}
                                    placeholder="Minutes"
                                    className="border p-2 rounded"
                                />
                             
                                <button
                                    onClick={handleSaveExam}
                                    className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
                                >
                                    {isEditing ? "Update Exam" : "Add Exam"}
                                </button>
                                <button
                                    onClick={() => setShowDialog(false)}
                                    className="bg-gray-400 text-white px-4 py-2 rounded mt-3"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col overflow-x-auto mx-4 items-center">
                <div className="flex flex-row  mb-3 w-full  justify-between">
                    
                <div className="flex justify-between rounded-full px-5 gap-x-2 items-center mx-4 bg-green-400/20">
        <BookOpenText/>
        <p className=" text-2xl my-3">Exams</p>
    </div>
                <Button onClick={handleAddClick} className="bg-green-600 text-white px-4 py-2 rounded">
                    Add Exam
                </Button>
               
                </div>
                
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b text-left">Exam Name</th>
                            <th className="py-3 px-4 border-b text-left">Class Name</th>
                            <th className="py-3 px-4 border-b text-left">Time (minutes)</th>
                            <th className="py-3 px-4 border-b text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-4 text-center text-gray-500">No exams available</td>
                            </tr>
                        ) : (
                            exams.map((data) => (
                                <tr key={data.id} className="hover:bg-gray-50 transition duration-200">
                                    <td className="py-2 px-4 border">{data.exam_name}</td>
                                    <td className="py-2 px-4 border uppercase">{data.class_name}</td>
                                    <td className="py-2 px-4 border">{data.minutes} </td>
                                    <td className="py-2 px-4 border flex space-x-2">
                                        <button
                                            onClick={() => handleEditClick(data)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(data.id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
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
