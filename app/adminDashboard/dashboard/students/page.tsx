"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
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

interface Student {
    id: string;
    user_name: string;
    user_email: string;
    class_name: string;
    user_password: string;
}

function StudentList() {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isEdit, setIsEdit] = useState(false);
    const [selectedClass, setSelectedClass] = useState<string>("");

    const [userData, setUserData] = useState<Student>({
        id: "",
        user_name: "",
        user_email: "",
        user_password: "",
        class_name: "",
    });



    useEffect(() => {
        async function getAllStudents() {
            try {
                const response = await axios.get("http://localhost:3333/User");
                setStudents(response.data);
                setFilteredStudents(response.data);
            } catch (err) {
                setError("Failed to fetch students. Please try again.", err)
            }
        }
        getAllStudents();
    }, []);

    const onTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        setSelectedClass(selected);
        setFilteredStudents(
            selected ? students.filter((student) => student.class_name === selected) : students
        );
    };

    const handleClassSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUserData({
            ...userData,
            class_name: e.target.value,
        });
    };

    const handleSignupOrUpdate = async () => {
        try {
            if (isEdit) {
                await axios.put(`http://localhost:3333/User/${userData.id}`, userData);
                alert("Student details updated.");
            } else {
                await axios.post("http://localhost:3333/User", userData);
                alert("New student added. Please login.");
            }
            setIsEdit(false);
            setUserData({ id: "", user_name: "", user_email: "", user_password: "", class_name: "" });
        } catch (error) {
            alert("Error adding or updating student.");
        }
    };

    const handleEditClick = (student: Student) => {
        setUserData(student);
        setIsEdit(true);
    };
const disacble = () => {
    setIsEdit(false)
}
  //  if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex flex-col h-full overflow-auto">
        <div className="flex flex-row px-4 pt-4 mb-4 justify-between bg-zinc-200/20 border-b" onClick={disacble}>
            <p>List of All Students</p>
    
            {/* Class Selection Dropdown */}
            <div className="flex mb-4 text-center space-x-3">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-400 text-white">
                            {isEdit ? "Edit Student" : "Add New Student"}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{isEdit ? "Edit Student" : "Add New Student"}</AlertDialogTitle>
                            <AlertDialogDescription className="space-y-3">
                                <div className="p-10 bg-zinc-200/20 items-center">
                                    <label htmlFor="name">Passport
                                        <Input type="file" name="img_name" onChange={onTextFieldChange} className="w-full" required />
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="name">Name
                                        <Input type="text" name="user_name" value={userData.user_name} onChange={onTextFieldChange} required />
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="email">Email
                                        <Input type="text" name="user_email" value={userData.user_email} onChange={onTextFieldChange} required />
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="password">Password
                                        <Input type="text" name="user_password" value={userData.user_password} onChange={onTextFieldChange} required />
                                    </label>
                                </div>
                                <div>
                                    <label>Class
                                        <select name="class_name" value={userData.class_name} onChange={handleClassSelectChange} className="p-2 border rounded w-full" required>
                                            <option value="">Select Class</option>
                                            <option value="js1">JS1</option>
                                            <option value="js2">JS2</option>
                                            <option value="js3">JS3</option>
                                            <option value="ss1">SS1</option>
                                            <option value="ss2">SS2</option>
                                            <option value="ss3">SS3</option>
                                        </select>
                                    </label>
                                </div>
                                <AlertDialogCancel>
                                    <Button onClick={handleSignupOrUpdate}>
                                        {isEdit ? "Update Student" : "Add Student"}
                                    </Button>
                                    <Button>Cancel</Button>
                                </AlertDialogCancel>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                    </AlertDialogContent>
                </AlertDialog>
    
                <select id="classSelect" value={selectedClass} onChange={handleClassChange} className="p-2 border rounded">
                    <option value="">All Classes</option>
                    <option value="js1">JS1</option>
                    <option value="js2">JS2</option>
                    <option value="js3">JS3</option>
                    <option value="ss1">SS1</option>
                    <option value="ss2">SS2</option>
                    <option value="ss3">SS3</option>
                </select>
            </div>
        </div>
    
        <div className="flex flex-col max-w-screen-lg mx-auto items-center overflow-auto">
            <table className="bg-white border border-gray-300 table-auto">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b">Profile Picture</th>
                        <th className="py-2 px-4 border-b">Full Name</th>
                        <th className="py-2 px-4 border-b">Admission Number</th>
                        <th className="py-2 px-4 border-b">Class Name</th>
                        <th className="py-2 px-4 border-b">Password</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((data) => (
                            <tr key={data.id} onClick={() => handleEditClick(data)} className="hover:bg-gray-50 focus-visible:bg-green-400">
                                <td className="py-2 px-4 border-b">
                                    <Image
                                        width={50}
                                        height={50}
                                        src={`/students/${data.user_password}.png`}
                                        className="rounded-full hidden border border-green-600"
                                        alt="Student logo"
                                        onError={(e) => {
                                            e.currentTarget.src = "/lds.png";
                                        }}
                                    />
                                </td>
                                <td className="py-2 px-4 border-b">{data.user_name}</td>
                                <td className="py-2 px-4 border-b">{data.user_email}</td>
                                <td className="py-2 px-4 border-b uppercase">{data.class_name}</td>
                                <td className="py-2 px-4 border-b">{data.user_password}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center py-4">No students to display.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
    
    );
}

export default StudentList;

