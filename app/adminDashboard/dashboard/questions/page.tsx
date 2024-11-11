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
import toast, { Toaster } from "react-hot-toast";
import { Book } from "lucide-react";
import Image from "next/image";

function Question() {
    const [questions, setQuestions] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    const [classFilter, setClassFilter] = useState("");  // State for class filter

    

    const router = useRouter();
    const { id } = useParams();
    let questionId = 1;

    const [userData, setUserData] = useState({
        id: questionId.toString(),
        exam_id: Number(id),
        question: "",
        img: '',
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
            await axios.delete(`http://192.168.0.50:3333/Question/${questionId}`);
            fetchQuestions(); // Refresh the question list after deletion
            toast(`Question ${questionId} deleted succesfully `)
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    };
    

    const handleAddOrUpdateQuestion = async () => {
        try {
            if (editMode && currentQuestionId) {
                console.log("Updating question with ID:", currentQuestionId);
                 
                await axios.put(`http://192.168.0.50:3333/Question/${currentQuestionId}`, userData);
                toast(`Updated Question`, currentQuestionId);
                //window.location.reload();
            } else {
                console.log("Adding new question:", userData);
                await axios.post("http://192.168.0.50:3333/Question", userData);
                toast("Adding new question:", userData);
                //window.location.reload();
            }

            setEditMode(false);
            setCurrentQuestionId(null);
            setUserData({
                id: questionId.toString,
                exam_id: Number(id),
                img: "",
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
          // Step 1: Fetch all items
          const fetchResponse = await fetch('http://192.168.0.50:3333/Question');
          
          // Check if the fetch was successful
          if (!fetchResponse.ok) {
            throw new Error('Failed to fetch items');
          }
      
          const data = await fetchResponse.json();
      
          // Step 2: Delete each item individually
          const deletePromises = data.map((item) =>
            fetch(`http://192.168.0.50:3333/Question/${item.id}`, {
              method: 'DELETE',
            })
          );
      
          // Await all delete promises
          await Promise.all(deletePromises);
      
          
          window.location.reload();
          toast('All Questions Deleted Succesfully')
        } catch (error) {
          console.error('Error deleting content:', error);
          alert('An error occurred while deleting content');
        }
      };
      
      
      const fetchQuestions = async () => {
        try {
            const response = await axios.get("http://192.168.0.50:3333/Question");
            const filteredQuestions = classFilter
                ? response.data.filter(question => question.class_name === classFilter)
                : response.data;
            setQuestions(filteredQuestions);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };
    

    useEffect(() => {
        fetchQuestions();
    }, [classFilter]);
    

    return (
        <div className="container mx-auto p-4 ">
            <Toaster/>
          
            <div className="flex items-center  justify-between bg-white/30">
    <QuestionListHeader />


<div className="flex gap-3 justify-between items-center ">
    <div className="flex py-1 px-2 pb-2 bg-green-600/20 rounded items-center ">
<SelectField

    options={["js1", "js2", "js3", "ss1", "ss2", "ss3"]}
    onChange={(e) => setClassFilter(e.target.value)}
    value={classFilter}
/>

<p className="flex py-1 px-2 mt-1 bg-green-200/20 rounded text-black/80">
{classFilter}: has {questions.length} questions
    </p> 
    </div>

<Button onClick={handleDeleteAll} variant={'destructive'}> Delete all Questions</Button>
    
     <div className="w-4"/>
      <AddOrEditQuestionDialog
                userData={userData}
                onTextFieldChange={onTextFieldChange}
                handleAddOrUpdateQuestion={handleAddOrUpdateQuestion}
                setOption={setOption}
                editMode={editMode}
            />
</div>
     

      
            </div>
        
            <QuestionTable questions={questions} onEdit={loadQuestionData} onDelete={handleDeleteQuestion} />

         
        </div>
    );
}

const QuestionListHeader = () => (
    <div className="flex justify-between rounded-full px-5 gap-x-2 items-center mx-4 bg-green-400/20">
        <Book/>
        <p className=" text-2xl my-3">Questions</p>
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
                <AlertDialogDescription className="space-y-3 overflow-y-auto max-h-[500px]">
                <div className="space-y-3">
                                <Image src={userData.img} height={100} width={100} style={{ maxWidth: '100%', maxHeight: '100%'}} className=" h-auto w-full rounded border border-black" alt="image"/>
                                        <label className="mt-3" htmlFor="profile">Question Image
                                            <Input type="text" name="img" value={userData.img} onChange={onTextFieldChange} required />
                                        </label>
                                    
                                       
                                    </div>
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
                        options={["mat", "eng", "bst" ,"cca", "crs", "yor", "pvs", "bus", "nve", "fre" ,"gns", "his" , "phy", "bio", "chm", "cve" , "dpc", "agr", "eco"]}
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
    <table className="min-w-full bg-white border rounded border-gray-300 mt-6 overflow-y-auto">
        <thead>
            <tr className="bg-gray-100 rounded-sm">
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


