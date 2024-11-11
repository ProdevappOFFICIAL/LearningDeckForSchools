'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ImageResize from './image-resize'
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
  import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Calculator from '@/components/global/calculator';
import { CalculatorIcon } from 'lucide-react';
import Image from 'next/image';


interface Question {
  _id: string | number;
  img: string;
  visited: boolean;
  attempted: boolean;
  userOption: number;
  options: string[];
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const ExamPage = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pass, setPass] =useState("");

  const userClass = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("class_name") : "";
  const userName = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("user_name") : "";
  const examName = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("exam_name") : "";
  const passport = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("key") : "";
  const min = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("min") : "0";
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
   
    }
  }, []);
  //const sec = new URLSearchParams(window.location.search).get("sec");
  
  const [minutes, setMinutes] = useState(min);
  const [seconds, setSeconds] = useState(0); // Set initial time here
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {

    // Fetch the logged-in user information (assuming user is logged in and stored in sessionStorage)
    const loggedInUserEmail = sessionStorage.getItem("user");

    if (loggedInUserEmail) {
      // Fetch user data from JSON server to get the class name of the logged-in user
      axios
        .get("http://192.168.0.50:3333/User")
        .then((response) => {
          const userData = response.data.find(
            (user: { user_email: string; }) => user.user_email === loggedInUserEmail      );
    
          if (userData) {
            setPass(userData.img)
            
          
          }
        })
        .catch(() => {
       
        });
    }
  }, []);


  useEffect(() => {
    
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://192.168.0.50:3333/Question?exam_name=${examName}&class_name=${userClass}`);
        const formattedQuestions = response.data.map((ques, index) => {
          const options = [...ques.incorrect_answers, ques.correct_answer].sort(() => Math.random() - 0.5);
          return {
            ...ques,
            _id: index + 1,
            visited: false,
            attempted: false,
            userOption: -1,
            options,
          };
        });
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Could not fetch questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
    }, [examName, userClass]);


   const calculateSubjectScores = () => {
    const subjectScores = {};

    questions.forEach((ques) => {
      const { subject, correct_answer, options, userOption } = ques;

      if (!subjectScores[subject]) {
        subjectScores[subject] = { correct: 0, total: 0 };
      }

      // Increment total questions for the subject
      subjectScores[subject].total++;

      // Check if the user's answer is correct
      if (options[userOption] === correct_answer) {
        subjectScores[subject].correct++;
      }
    });

    return subjectScores;
  };
  
   const saveAndSubmit = () => {
    saveResults();
    sessionStorage.removeItem("user");
    router.push('/auth');
  };

 const saveResults = async () => {
    const results = {
      overallScore: questions.reduce((total, ques) => {
        return total + (ques.options[ques.userOption] === ques.correct_answer ? 1 : 0);
      }, 0),
      img: pass,
      full_name: passport,
      username: userName,
      classname: userClass,
      exam_name: examName,
      subjectScores: calculateSubjectScores(),
      questions,
    };

    try {
      await axios.post('http://192.168.0.50:3333/Result', results);
     // alert('Results saved successfully!');
    } catch (error) {
      console.error('Error saving results:', error);
     // alert('Failed to save results.');
    }
  };
  
  useEffect(() => {
    let interval = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes > 0) {
            setMinutes((prevMinutes) => prevMinutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);
    } else if (isActive && minutes === 0 && seconds === 0) {
      // Timer finished, redirect to another page
      saveAndSubmit();
      setIsActive(false);
      setMinutes(0);
      setSeconds(0); // Reset to initial time
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, router]);

 useEffect( () => {
    return () => { 
      
 setIsActive(true);
    if(sessionStorage.getItem("user") == null)
    {
      router.push("/auth")
    }
   
    };
  }, []);
  // Save results to the server
 

  const markVisited = () => {
    const temp = [...questions];
    temp[currentQuestion].visited = true;
    setQuestions(temp);
  };

  const saveAndNextFunction = () => {
    const temp = [...questions];
    temp[currentQuestion].userOption = temp[currentQuestion].userOption; // Ensure the userOption is saved

    // Move to the next question
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(0); // Reset to the first question if at the end
    }
  };


 
  useEffect(() =>{
  //  startTimer();
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      // Option selection (A, B, C, D)
      if (['a', 'b', 'c', 'd'].includes(key)) {
        const index = key.charCodeAt(0) - 'a'.charCodeAt(0); // Convert 'a' to 0, 'b' to 1, etc.
        if (index < questions[currentQuestion]?.options.length) {
          const temp = [...questions];
          temp[currentQuestion].attempted = true;
          temp[currentQuestion].userOption = index;
          setQuestions(temp);
        }
      }

      // Save and next (N)
      if (key === 'p') {
        if (currentQuestion > 0) {
          markVisited();
          setCurrentQuestion(currentQuestion - 1);
        }
      }
      if (key === 's') {
        saveAndSubmit()
      }
      if (key === 'enter') {
        saveAndSubmit()
      }
      if (key === 'n') {
        saveAndNextFunction();
      }
    };
    
     window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [questions, currentQuestion]);

  if (loading) {
    return   <div className=" flex flex-col h-screen w-screen items-center justify-center ">
    <Image className=" p-[1px] bg-green-400/20 rounded-full animate-in scale-90 opacity-10 duration-1000 animate-out fade-in-100   animate-pulse  transition-all " alt="hello" height={110} width={110} src="/lds.png" />
    <div className="title">

        </div>
    
  </div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  const NavigationPanel = ({ questions, setQuestions, currentQuestion, setCurrentQuestion, markVisited }) => {
    const handlePageChange = (page: number) => {
      markVisited(page);
      setCurrentQuestion(page);
    };
  
    const getButtonColor = (index: number) => {
      return questions[index]?.attempted ? "bg-red-600 text-white" : "bg-blue-600 text-white";
    };

  
    return (
<div className="flex flex-wrap mr-[20px]">
  <Pagination>
    <PaginationContent className="flex flex-wrap w-full mr-[20px] ">
      {questions.map((_, index) => (
        <PaginationItem className="m-1" key={index}>
          <PaginationLink
            href="#"
            className={`pagination-link ${getButtonColor(index)} rounded px-3 py-1 transition duration-300`}
            isActive={currentQuestion === index}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(index);
            }}
          >
            {index + 1}
          </PaginationLink>
        </PaginationItem>
      ))}
    </PaginationContent>
  </Pagination>
</div>

    );
  };
  
  return (
    <div className='h-screen w-screen flex flex-col items-end mr-4'>
      <div className="flex flex-col w-full h-[500px]">
      
      <div className="flex flex-row items-center justify-between m-5 my-5  ">
        <div>
          <Button
            onClick={() => {
              if (currentQuestion > 0) {
                markVisited();
                setCurrentQuestion(currentQuestion - 1);
              }
            } }
            variant="outline"
            className="dark:bg-black text-white bg-blue-600 border rounded-lg px-5 hover:bg-blue-400 hover:text-white"
          >
            Previous
          </Button>

          <Button
            onClick={saveAndNextFunction}
            className="dark:bg-black dark:text-white bg-blue-600 border rounded-lg px-10 hover:bg-blue-400"
          >
            Next
          </Button>
        </div>

        <div className='flex  uppercase font-bold'>
          Name: {userName}
          <div className='w-3' />
          Class: {userClass}
        </div>
        <div className='flex space-x-4'>
         <Button variant={"outline"}>
         {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
         </Button>
          <Dialog>
            <DialogTrigger asChild>
              <div>
                <Button variant="outline" size="icon">
                  <CalculatorIcon className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Calculator</DialogTitle>
                <DialogDescription>
                  Simple Calculator
                  <div className="mt-5">
                    <Calculator />
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <div className='w-3' />
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" className="bg-red-600 rounded-lg px-10 hover:bg-red-400 dark:text-white">
                Submit
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-xl sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Submit</DialogTitle>
                <DialogDescription>Are you sure you want to submit?</DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button variant="destructive" type="submit" onClick={saveAndSubmit}>
                    Submit
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

      </div>

      <Separator />
      <div className="flex flex-col  my-10 p-5 w-auto h-fit">
        <div className='flex'>
 <Card className="h-full w-full ">
          <CardHeader>
            <CardTitle className=' font-bold text-xl'>
              Questions {questions[currentQuestion]?._id}/{questions.length}
            </CardTitle>
            <CardDescription className=' font-bold text-sm text-black'>{questions[currentQuestion]?.question}</CardDescription>
          </CardHeader>
          <div className='flex flex-row'>
  <CardContent className="flex flex-col">
            {questions[currentQuestion]?.options.map((option, index) => (
              <div key={index} className="flex w-[500px] items-center p-3">
                <input
                  type="radio"
                  name="options"
                  id={`option-${index}`}
                  checked={questions[currentQuestion]?.userOption === index}
                  onChange={() => {
                    const temp = [...questions];
                    temp[currentQuestion].userOption = index; // Save selected option
                    temp[currentQuestion].attempted = true; // Mark as attempted
                    setQuestions(temp);
                  } } />
                <label htmlFor={`option-${index}`} className="ml-2">
                  {String.fromCharCode(65 + index)}. {option}
                </label>
              </div>
            ))}
          </CardContent>
      <div className='w-full'/>
      {
        questions[currentQuestion]?.img?( <Image src={questions[currentQuestion]?.img}  height={outerHeight/5} width={outerWidth/5}  style={{ transition: 'width 0.3s, height 0.3s' }} alt=""/>):(<div></div>)
      }
         
            </div>
        
        </Card>

       <Card className='flex flex-col'>
       <div className="">
          <div className="flex items-center rounded-sm p-5">
         <Image width={150} height={150} src={pass} className=" rounded-full bg-blend-screen border border-green-600" alt="Student logo"/>
          </div>
        </div>
        <div className='flex flex-row w-full text-sm p-2 bg-zinc-200/20'>
         <p>EXAM-NAME:</p><p>{examName}</p> 
        </div>
        <div className='flex flex-row w-full text-sm p-2 bg-zinc-200/20'>
          NAME: {userName}
        </div>
        <div className='flex flex-row w-full text-sm p-2 bg-zinc-200/20 uppercase'>
          CLASS: {userClass}
        </div>
       </Card>
        </div>
       
        <div className="flex flex-wrap mt-3 mr-[20px]">
          <NavigationPanel
            questions={questions}
            setQuestions={setQuestions}
            currentQuestion={currentQuestion}
            markVisited={markVisited} setCurrentQuestion={setCurrentQuestion} />

        </div>




      </div>
    </div>
    <div className="flex items-center text-sm py-1 px-2  mt-10 sm:mt-5  rounded-full hover:bg-green-200 bg-green-200/20 border border-green-600 font-bold text-green-600 ">   <Image alt="hello" height={30} width={30} src="/lds.png" /> <p>Powered by LearningDeck for Schools </p></div><div className=" h-5" /></div>
  );
};

export default ExamPage;
