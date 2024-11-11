"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { User } from "lucide-react";

interface Student {
    id: string;
    img: string;
    user_name: string;
    user_email: string;
    class_name: string;
    user_password: string;
}

function StudentList() {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [no, setNo] = useState('');

    const [userData, setUserData] = useState<Student>({
        id: '',
        img: "",
        user_name: "",
        user_email: "",
        user_password: "",
        class_name: "",
    });

    useEffect(() => {
        async function getAllStudents() {
            try {
                const response = await axios.get("http://192.168.0.50:3333/User");
                setStudents(response.data);
                setNo(response.data.length);
               
                setFilteredStudents(response.data);
            } catch (err) {
                setError("Failed to fetch students. Please try again.");
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
                await axios.put(`http://192.168.0.50:3333/User/${userData.id}`, userData); // Update by `id`
                alert("Student details updated.");
            } else {
                // Set the new ID based on the current total count of students
                const newId = students.length + 1;
                const newStudent = { ...userData, id: newId.toString() };
    
                await axios.post("http://192.168.0.50:3333/User", newStudent); // Add new student
                alert("New student added.");
            }
            setIsEdit(false);
            setUserData({ id: "", img: "", user_name: "", user_email: "", user_password: "", class_name: "" });
        } catch (error) {
            console.error("Error adding or updating student:", error); // Log full error details
            alert("Error adding or updating student.");
        }
    };
    

    const handleEditClick = (student: Student) => {
        setUserData(student);
        setIsEdit(true);
    };

    return (
        <div className="flex flex-col h-full overflow-auto">
         
            <div className="flex flex-row px-4 pt-4 mb-4 justify-between bg-zinc-200/20 border-b">
            <div className="flex justify-between mb-3 rounded-full px-5 gap-x-2 items-center mx-4 bg-green-400/20">
        <User/>
        <p className=" text-2xl ">Students</p>
    </div>

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
                                <div>
                                <Image src={userData.img} width={200} height={200} className=" rounded-full border border-green-600" alt="image"/>
                                        <label htmlFor="profile">Profile
                                            <Input type="text" name="img" value={userData.img} onChange={onTextFieldChange} required />
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
                                        <Button onClick={() => setIsEdit(false)}>Cancel</Button>
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
                        <th className="py-2 px-4 border-b">Passport</th>
                            <th className="py-2 px-4 border-b">Full Name</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Class</th>
                            <th className="py-2 px-4 border-b">Password</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((data) => (
                                <tr key={data.id} onClick={() => handleEditClick(data)} className="hover:bg-gray-50 cursor-pointer">
                                     <Dialog>
            <DialogTrigger asChild>
            <td className="py-2 px-4 border-b">
                <div className=" rounded-full p-5 bg-green-200/20">
                <User/>

                </div>
           </td>
            </DialogTrigger>
            <DialogContent className=" w-auto bg-transparent border-none text-white">
              <DialogHeader>
              
                <DialogDescription>
                  
                  <div className="mt-5">
                  <Image alt={data.user_password + "image"} className=" rounded-full border-[2px] border-green-600" width={200} height={200} src={userData.img}/>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
                                  
                                    <td className="py-2 px-4 border-b">{data.user_name}</td>
                                    <td className="py-2 px-4 border-b">{data.user_email}</td>
                                    <td className="py-2 px-4 border-b uppercase">{data.class_name}</td>
                                    <td className="py-2 px-4 border-b">{data.user_password}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-4">No students to display.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StudentList;
