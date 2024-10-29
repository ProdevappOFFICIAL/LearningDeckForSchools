"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { Edit } from "lucide-react";

interface Student {
    id: string;
    user_name: string;
    user_email: string;
    class_name: string;
    user_password: string;
}

interface ResultDetails {
    overallScore: number;
    subjectScores: Record<string, { correct: number; total: number }>;
    questions: { id: string; attempted: boolean }[];
}

function StudentList() {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [results, setResults] = useState<ResultData[]>([]);
    const [filteredResults, setFilteredResults] = useState<ResultData[]>([]);
    const [selectedResult, setSelectedResult] = useState<ResultData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<string>("");

    const {id} = useParams();
    const [userData , setUserData] = useState({
        id: id,
        user_name: "",
        user_email: "",
        user_password: "",
        class_name: "",
        
     });

     function onTextFieldChange(e){
         setUserData({
             ...userData,
             [e.target.name] : e.target.value
         });
     }

    useEffect(() => {
        async function getAllResults() {
            try {
                const response = await axios.get("http://localhost:3333/Result");
                const fetchedResults = response.data.Result || response.data;
                if (Array.isArray(fetchedResults)) {
                    setResults(fetchedResults);
                    setFilteredResults(fetchedResults); // Show all initially
                } else {
                    setError("Unexpected data format.");
                }
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch results.");
            } finally {
                setLoading(false);
            }
        }
        getAllResults();
    }, []);

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


    
   async function handleSignup(){
        // console.log(userData);
        // console.log(password);

            await axios.post("http://localhost:3333/User" , userData);
            alert("Your account has created");
            alert("Please Login");
   }
    useEffect(() => {
        async function getAllStudents() {
            try {
                const response = await axios.get("http://localhost:3333/User");
                setStudents(response.data);
                setFilteredStudents(response.data); // Show all students initially
            } catch (err) {
                setError("Failed to fetch students. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        getAllStudents();
    }, []);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // eslint-disable-next-line react-hooks/rules-of-hooks


    const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        setSelectedClass(selected);
        if (selected) {
            setFilteredResults(results.filter((result) => result.classname === selected));
        } else {
            setFilteredResults(results); // Show all if no class is selected
        }
    };


    return (     <>
    <div className="flex flex-row px-4 pt-4 mb-4 justify-between bg-zinc-200/20  border-b w-full">
        <p className="">List of All Students</p>

        {/* Class Selection Dropdown */}
        <div className="flex mb-4 text-center space-x-3 ">
            <div>
        
    <AlertDialog>
      <AlertDialogTrigger asChild>
       <Button className="bg-blue-600 hover:bg-blue-400 text-white ">
                    Add New Student
                </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Student</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <div className="flex p-10 bg-zinc-200/20 items-center">
            <div >
                <label htmlFor="name">Passport
                    <Input onChange={(e) => onTextFieldChange(e)} 
                    type="file" name="img_name" className=" w-full"  required />
                </label>
            </div>
                     </div>
          
            <div >
                <label htmlFor="name">Name 
                    <Input onChange={(e) => onTextFieldChange(e)} 
                    type="text" name="user_name"  required />
                </label>
            </div>


            <div >
                <label htmlFor="email"> Email
                    <Input onChange={(e) => onTextFieldChange(e)}  
                    type="text" name="user_email" required />
                </label>
            </div>

            <div >
                <label htmlFor="password"> Password
                    <Input onChange={(e) => onTextFieldChange(e)} 
                    type="text" name="user_password" required />
                </label>
            </div>
            <div >
                <label > Class (lowercase)
                        <Input onChange={(e) => onTextFieldChange(e)} 
                    type="text" name="class_name" required />
                </label>
                
            </div>
                     <AlertDialogCancel><Button onClick={handleSignup}>Add Student</Button></AlertDialogCancel> 
    
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
              
            </div>
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
        </div>
    </div><div className="flex flex-col w-full max-w-screen-lg mt-15 mx-auto items-center">


            <div className="">
                <table className="bg-white border border-gray-300 w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Profile Picture</th>
                            <th className="py-2 px-4 border-b">Full Name</th>
                            <th className="py-2 px-4 border-b">Admission Number</th>
                            <th className="py-2 px-4 border-b">Class Name</th>
                            <th className="py-2 px-4 border-b">Password</th>
                            <th className="py-2 px-4 border-b w-fit">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((data) => (
                                <tr key={data.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">
                                        <Image
                                            width={50}
                                            height={50}
                                            src={`/students/${data.user_password}.png`}
                                            className="rounded-full hidden border border-green-600"
                                            alt="Student logo"
                                            onError={(e) => {
                                                e.currentTarget.src = "/lds.png";
                                            } } />
                                    </td>
                                    <td className="py-2 px-4 border-b">{data.user_name}</td>
                                    <td className="py-2 px-4 border-b">{data.user_email}</td>
                                    <td className="py-2 px-4 border-b uppercase">{data.class_name}</td>
                                    <td className="py-2 px-4 border-b">
                                   {data.user_password}
                                    </td>
                                    <td className="w-fit" >
                                        <div className=" flex w-full items-center text-blue-600 p-1 rounded-full  ">
                                              <Edit height={30} width={30} className=" w-[15px] h-[15px]"/>
                                        </div>
                                      
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4">
                                    No students to display.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Student Result */}
            {modalVisible && selectedStudentResult && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-bold mb-4">{selectedStudentName}'s Result</h3>
                        <p className="mb-2"><strong>Overall Score:</strong> {selectedStudentResult.overallScore}%</p>
                        <div className="mb-4">
                            <h4 className="font-semibold">Subject Scores:</h4>
                            <ul className="list-disc list-inside">
                                {Object.entries(selectedStudentResult.subjectScores).map(([subject, score]) => (
                                    <li key={subject}>
                                        {subject}: {score.correct}/{score.total}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold">Questions Attempted:</h4>
                            <p>
                                {selectedStudentResult.questions.filter((q) => q.attempted).length} / {selectedStudentResult.questions.length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div></>
    );
}

export default StudentList;
