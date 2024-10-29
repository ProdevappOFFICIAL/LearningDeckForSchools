'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
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

  const userClass = new URLSearchParams(window.location.search).get("class_name");
  const userName = new URLSearchParams(window.location.search).get("user_name");
  const examName = new URLSearchParams(window.location.search).get("exam_name");
  const passport = new URLSearchParams(window.location.search).get("key");
  

  interface Time {
    min: number;
    sec: number;
  }
  
  


  useEffect(() => {
    
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3333/Question?exam_name=${examName}&class_name=${userClass}`);
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
    startTimer();
    
  }, [examName, userClass]);

  
  const useTimer = (initialMinutes: number, initialSeconds: number) => {
    const [time, setTime] = useState<Time>({ min: initialMinutes, sec: initialSeconds });
    const router = useRouter();
    const refresh = useRef<NodeJS.Timeout | null>(null);
    const isNavigating = useRef(false);
  
    const run = useCallback(() => {
      setTime((prevTime) => {
        let { min, sec } = prevTime;
        if (min === 0 && sec === 0) {
           
          if (refresh.current) {
            clearInterval(refresh.current);
            refresh.current = null;
          }
          if (!isNavigating.current) {
        
             saveAndSubmit();
          }
          return prevTime;
        }
        if (sec === 0) {
          min--;
          sec = 59;
        } else {
          sec--;
        }
        return { min, sec };
      });
    }, [router]);
  
    const startTimer = useCallback(() => {
      if (refresh.current) {
        clearInterval(refresh.current);
      }
      run();
      refresh.current = setInterval(run, 1000); // 1000 milliseconds = 1 second
    }, [run]);
  
    useEffect(() => {
      return () => {
        if (refresh.current) {
          clearInterval(refresh.current);
        }
      };
    }, []);
  
    return { time, startTimer };
  };
  
  
   const {time, startTimer} = useTimer(60 , 2);


   useEffect(() => {
    return () => {
    if(sessionStorage.getItem("user") == null)
    {
      router.push("/")
    }
    };
  }, []);

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

  // Save results to the server
  const saveResults = async () => {
    const results = {
      overallScore: questions.reduce((total, ques) => {
        return total + (ques.options[ques.userOption] === ques.correct_answer ? 1 : 0);
      }, 0),
      full_name: passport,
      username: userName,
      classname: userClass,
      exam_name: examName,
      subjectScores: calculateSubjectScores(),
      questions,
    };

    try {
      await axios.post('http://localhost:3333/Result', results);
     // alert('Results saved successfully!');
    } catch (error) {
      console.error('Error saving results:', error);
     // alert('Failed to save results.');
    }
  };

  const subjectScores = calculateSubjectScores();
  const totalQuestions = questions.length;
  const overallScore = questions.reduce((total, ques) => {
    return total + (ques.options[ques.userOption] === ques.correct_answer ? 1 : 0);
  }, 0);
  const overallPercentage = Math.round((overallScore / totalQuestions) * 100);




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

  const saveAndSubmit = () => {
    saveResults();
    sessionStorage.removeItem("user");
    router.push('/');
  };

  const handlePageChange = (index: number) => {
    markVisited(); // Mark current question as visited before changing
    setCurrentQuestion(index);
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
    return <div>Loading questions...</div>;
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
          {time.min < 10 ? "0" + time.min : time.min}:
          {time.sec < 10 ? "0" + time.sec : time.sec}
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
        </Card>

       <Card className='flex flex-col'>
       <div className="">
          <div className="flex items-center rounded-sm p-5">
         <Image width={150} height={150} src={'/students/'+ passport + '.png'} className=" rounded-full bg-blend-screen border border-green-600" alt="Student logo"/>
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
