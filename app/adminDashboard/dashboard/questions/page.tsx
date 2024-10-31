"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { 
    AlertDialog, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";

function Question() {
    const [questions, setQuestions] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    

    const router = useRouter();
    const { id } = useParams();
    let questionId = 1;

    const [userData, setUserData] = useState({
        id: questionId.toString(),
        exam_id: Number(id),
        question: "",
        incorrect_answers: ["", "", ""],
        correct_answer: "",
        class_name: "",
        exam_name: "",
        subject: ""
    });

    const loadQuestionData = (question) => {
        console.log("Loading question data for editing:", question);
        setEditMode(true);
        setCurrentQuestionId(question.id);
        setUserData({
            ...question,
            incorrect_answers: question.incorrect_answers || ["", "", ""]
        });
    };

    const setOption = (index, value) => {
        setUserData((prevData) => {
            const updatedAnswers = [...prevData.incorrect_answers];
            updatedAnswers[index] = value;
            return { ...prevData, incorrect_answers: updatedAnswers };
        });
    };

    const onTextFieldChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };
    const handleDeleteQuestion = async (questionId) => {
        try {
            await axios.delete(`http://localhost:3333/Question/${questionId}`);
            fetchQuestions(); // Refresh the question list after deletion
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    };
    

    const handleAddOrUpdateQuestion = async () => {
        try {
            if (editMode && currentQuestionId) {
                console.log("Updating question with ID:", currentQuestionId);
                await axios.put(`http://localhost:3333/Question/${currentQuestionId}`, userData);
            } else {
                console.log("Adding new question:", userData);
                await axios.post("http://localhost:3333/Question", userData);
            }

            setEditMode(false);
            setCurrentQuestionId(null);
            setUserData({
                id: questionId.toString,
                exam_id: Number(id),
                question: "",
                incorrect_answers: ["", "", ""],
                correct_answer: "",
                class_name: "",
                exam_name: "",
                subject: ""
            });
            router.push('/adminDashboard/dashboard/questions');
            fetchQuestions();
            questionId++
        } catch (error) {
            console.error("Error adding/updating question:", error);
        }
    };
 
      const handleDeleteAll = async () => {
        try {
            const response = await fetch('http://localhost:3333/Question', {
            method: 'DELETE',
          });
    
          if (response.ok) {
            alert('All content deleted successfully');
          } else {
            alert('Failed to delete content');
          }
        } catch (error) {
          console.error('Error deleting content:', error);
          alert('An error occurred while deleting content');
        }
      };
    const fetchQuestions = async () => {
        try {
            const response = await axios.get("http://localhost:3333/Question");
            setQuestions(response.data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    return (
        <div className="container mx-auto p-4">
           Selected Question Class: {userData.class_name}
            <div className="flex items-center justify-between">
    <QuestionListHeader />
    <Button onClick={handleDeleteAll}> Delete all Questions</Button>
       <AddOrEditQuestionDialog
                userData={userData}
                onTextFieldChange={onTextFieldChange}
                handleAddOrUpdateQuestion={handleAddOrUpdateQuestion}
                setOption={setOption}
                editMode={editMode}
            />
            </div>
        
            <QuestionTable questions={questions} onEdit={loadQuestionData} onDelete={handleDeleteQuestion} />

         
        </div>
    );
}

const QuestionListHeader = () => (
    <div className="flex justify-between items-center mx-4">
        <p className="font-bold text-2xl my-3">List of All Questions</p>
    </div>
);

const AddOrEditQuestionDialog = ({ userData, onTextFieldChange, handleAddOrUpdateQuestion, setOption, editMode }) => (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-400 text-white">
                {editMode ? "Edit Question" : "Add New Question"}
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{editMode ? "Edit Question" : "Add New Question"}</AlertDialogTitle>
                <AlertDialogDescription className="space-y-3">
                    <InputField label="Question Image" name="img_name" type="file" onChange={onTextFieldChange} />
                    <InputField label="Question" name="question" onChange={onTextFieldChange} value={userData.question} />
                    <InputField label="Option 1" onChange={(e) => setOption(0, e.target.value)} value={userData.incorrect_answers[0]} />
                    <InputField label="Option 2" onChange={(e) => setOption(1, e.target.value)} value={userData.incorrect_answers[1]} />
                    <InputField label="Option 3" onChange={(e) => setOption(2, e.target.value)} value={userData.incorrect_answers[2]} />
                    <InputField label="Correct Answer" name="correct_answer" onChange={onTextFieldChange} value={userData.correct_answer} />

                    <SelectField 
                        label="Exam" 
                        name="exam_name" 
                        options={["JSS BATCH1", "JSS BATCH2", "SSS BATCH1", "SSS BATCH2"]}
                        onChange={onTextFieldChange} 
                        value={userData.exam_name}
                    />

                    <SelectField 
                        label="Subject" 
                        name="subject" 
                        options={["math", "english", "chemistry", "biology", "civic"]}
                        onChange={onTextFieldChange} 
                        value={userData.subject}
                    />

                    <SelectField 
                        label="Class" 
                        name="class_name" 
                        options={["js1", "js2", "js3", "ss1", "ss2", "ss3"]}
                        onChange={onTextFieldChange} 
                        value={userData.class_name}
                    />

                    <AlertDialogCancel>
                        <Button onClick={handleAddOrUpdateQuestion}>{editMode ? "Update Question" : "Add Question"}</Button>
                        <Button> Cancel</Button>
                    </AlertDialogCancel>
                </AlertDialogDescription>
            </AlertDialogHeader>
        </AlertDialogContent>
    </AlertDialog>
);

const InputField = ({ label, name, type = "text", onChange, value }) => (
    <div className="space-y-2">
        <label htmlFor={name} className="block font-medium">{label}</label>
        <Input onChange={onChange} type={type} name={name} className="w-full" value={value} required />
    </div>
);

const SelectField = ({ label, name, options, onChange, value }) => (
    <div className="space-y-2">
        <label htmlFor={name} className="block font-medium">{label}</label>
        <select 
            name={name} 
            className="w-full p-2 border rounded-md" 
            onChange={onChange} 
            value={value} 
            required
        >
            <option value="">Select {label}</option>
            {options.map((option) => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
);

const QuestionTable = ({ questions, onEdit, onDelete }) => (
    <table className="min-w-full bg-white border border-gray-300 mt-6">
        <thead>
            <tr className="bg-gray-100">
                <TableHeader title="S/N" />
                <TableHeader title="Question" />
                <TableHeader title="A" />
                <TableHeader title="B" />
                <TableHeader title="C" />
                <TableHeader title="D" />
                <TableHeader title="Correct Answer" />
                <TableHeader title="Subject" />
                <TableHeader title="Edit" /> {/* Add Actions header */}
                <TableHeader title="Delete" />
            </tr>
        </thead>
        <tbody>
        {questions.map((data, index) => (
                <TableRow key={data.id} data={data} onEdit={() => onEdit(data)} onDelete={onDelete} index={index} />
            ))}
        </tbody>
    </table>
);

const TableHeader = ({ title }) => (
    <th className="py-2 px-4 border-b text-left">{title}</th>
);
const TableRow = ({ data, onEdit, onDelete , index }) => {

    const options = [...data.incorrect_answers, data.correct_answer].sort();
    return (
        <tr className="hover:bg-gray-50">
            <td className="py-2 px-4 border">{index + 1}</td>
            <td className="py-2 px-4 border">{data.question}</td>
            {options.map((option, idx) => (
                <TableCell key={idx} content={option} />
            ))}
            <td className="py-2 px-4 border">{data.correct_answer}</td>
            <td className="py-2 px-4 border">{data.subject}</td>
            <td className="py-2 px-4 border">
                <Button onClick={() => onEdit(data)}>Edit</Button>
               
            </td>
            <td className="py-2 px-4 border">
            <Button onClick={() => onDelete(data.id)} className="bg-red-600 hover:bg-red-400 text-white ml-2">
                    Delete
                </Button>
            </td>
        </tr>
    );
};


const TableCell = ({ content }) => (
    <td className="py-2 px-4 border-b">{content}</td>
);

export default Question;


