"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import ResultModal from "@/components/global/admin/result_modal";
import { Album, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";


const Result: React.FC = () => {
    const [results, setResults] = useState<ResultData[]>([]);
    const [filteredResults, setFilteredResults] = useState<ResultData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedResult, setSelectedResult] = useState<ResultData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [Batch, setBatch] = useState<string>("");
    

    
   
    

    useEffect(() => {
        async function getAllResults() {
            try {
                const response = await axios.get("http://192.168.0.50:3333/Result");
                const fetchedResults = response.data.Result || response.data;
                if (Array.isArray(fetchedResults)) {
                    setResults(fetchedResults);
                    setFilteredResults(fetchedResults); 
                } else {
                    setError("Unexpected data format.");
                }
            } catch (err) {
              //  setError(err.response?.data?.message || "Failed to fetch results.");
            } finally {
                setLoading(false);
            }
        }
        getAllResults();
    }, []);
    const handleDeleteAll = async () => {
        try {
          // Step 1: Fetch all items
          const fetchResponse = await fetch('http://192.168.0.50:3333/Result');
          
          // Check if the fetch was successful
          if (!fetchResponse.ok) {
            throw new Error('Failed to fetch items');
          }
      
          const data = await fetchResponse.json();
      
          // Step 2: Delete each item individually
          const deletePromises = data.map((item: { id: any; }) =>
            fetch(`http://192.168.0.50:3333/Result/${item.id}`, {
              method: 'DELETE',
            })
          );
      
          // Await all delete promises
          await Promise.all(deletePromises);
      
          
          window.location.reload();
          toast('All Results Deleted Succesfully')
        } catch (error) {
          console.error('Error deleting content:', error);
          alert('An error occurred while deleting content');
        }
      };
    const handleViewResult = (id: string) => {
        const result = results.find((r) => r.id === id);
        if (result) {
            setSelectedResult(result);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setSelectedResult(null);
        setIsModalOpen(false);
    };

    const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
    
        setSelectedClass(selected);
        setFilteredResults(selected ? results.filter((result) => result.classname === selected) : results);
    };
    const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        setBatch(selected);
        setFilteredResults(selected ? results.filter((result) => result.exam_name.includes(selected)) : results);
    };

    if (loading) return <div>Loading...</div>;


    return (
        <>
        <Toaster/>
            <div className="flex flex-row px-4 pt-4 mb-4 justify-between bg-zinc-200/20 border-b w-full">
            <div className="flex justify-between rounded-full mb-3 px-5 gap-x-2 items-center mx-4 bg-green-400/20">
        <Album/>
        <p className=" text-2xl my-3">Results</p>
    </div>
                <div className="mb-4 text-center">
                    <Button onClick={handleDeleteAll}>
                        Delete all Results
                    </Button>
                   
                    <select
                        id="classSelect"
                        value={selectedClass}
                        onChange={handleClassChange}
                        className="p-2 border rounded"
                    >
                        <option value="">All Classes</option>
                        <option value="js1">JS1</option>
                        <option value="js2">JS2</option>
                        <option value="js3">JS3</option>
                        <option value="ss1">SS1</option>
                        <option value="ss2">SS2</option>
                        <option value="ss3">SS3</option>
                       
                    </select>
                    <select
                        id="classSelect"
                        value={Batch}
                        onChange={handleBatchChange}
                        className="p-2 border rounded"
                    >
                        <option value="">All Batch</option>
                        <option value="1">(BATCH 1)</option>
                        <option value="2">(BATCH 2) </option>
                       
                    
                    </select>
                </div>
            </div>
            <div className="container mx-auto p-4">
                <div className="overflow-x-auto" >
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border ">Passport</th>
                                <th className="px-4 py-2 border">Username</th>
                                <th className="px-4 py-2 border">Class</th>
                                <th className="px-4 py-2 border">Exam-Name</th>
                                <th className="px-4 py-2 border">Overall Score</th>
                                <th className="px-4 py-2 border">Subject Scores</th>
                                <th className="px-4 py-2 border">Questions Attempted</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults.length > 0 ? (
                                filteredResults.map((data) => (
                                    <tr key={data.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">
                                        <div className=" rounded-full p-5 bg-green-200/20">
                <User/>

                </div>
                                        </td>
                                        <td className="py-2 px-4 border-b">{data.username}</td>
                                        <td className="py-2 px-4 border-b uppercase">{data.classname}</td>
                                        <td className="py-2 px-4 border-b">{data.exam_name}</td>
                                        <td className="py-2 px-4 border-b font-bold text-green-600">{data.overallScore}%</td>
                                        <td className="py-2 px-4 border-b">
                                            {Object.entries(data.subjectScores).map(([subject, score]) => (
                                                <div key={subject} className=" flex border px-2 py-1  bg-blue-600 border-t-white border-b-white text-sm bg-blue text-white ">
                                                   {subject}:
                                                    {score.correct}/{score.total}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {data.questions.filter((q) => q.attempted).length} / {data.questions.length}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => handleViewResult(data.id)}
                                                className="text-white text-sm px-2 py-1 rounded bg-green-600 hover:underline"
                                            >
                                                View Result
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-4">No results to display.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <ResultModal isOpen={isModalOpen} onClose={closeModal} result={selectedResult} />
            </div>
        </>
    );
};

export default Result;
