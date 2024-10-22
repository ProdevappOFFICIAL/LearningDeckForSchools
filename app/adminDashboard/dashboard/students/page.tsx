"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
function StudentList() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function getAllStudents() {
            try {
                const response = await axios.get("http://192.168.137.1:3333/User");
                setStudents(response.data);
            } catch (err) {
                setError("Failed to fetch students. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        getAllStudents();
    }, []);

    const handleViewResult = (id) => {
        router.push(`/adminDashboard/dashboard/students/details/${id}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex flex-col w-full max-w-screen-lg mt-15 mx-auto items-center">
            <p className=" font-bold text-2xl my-3">List of All Students</p>
            <div className="overflow-x-auto">
                <table className="bg-white border border-gray-300 w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Profile Picture</th>
                            <th className="py-2 px-4 border-b">Full Name</th>
                            <th className="py-2 px-4 border-b">Admission Number</th>
                            <th className="py-2 px-4 border-b">Class Name</th>
                            <th className="py-2 px-4 border-b">View Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((data) => (
                            <tr key={data.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b"> 
                                    <Image width={50} height={50} src={'/students/'+ data.user_password + '.png'} className=" rounded-full border border-green-600" alt="Student logo"/>
                                
                                    </td>
                                <td className="py-2 px-4 border-b">{data.user_name}</td>
                                <td className="py-2 px-4 border-b">{data.user_email}</td>
                                <td className="py-2 px-4 border-b uppercase">{data.class_name}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleViewResult(data.id)}
                                        className="text-white text-sm px-2 py-1 rounded bg-green-600 hover:underline"
                                    >
                                        View Result
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StudentList;
