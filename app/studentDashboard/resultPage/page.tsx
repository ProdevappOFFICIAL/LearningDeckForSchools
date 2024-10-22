"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import React from 'react';

const Result = ({ questions }) => {
  const router = useRouter();

  // Function to calculate the percentage score for a given category
  const calculateCategoryScore = (category) => {
    const categoryQuestions = questions.filter(ques => ques.category === category);
    const correctAnswers = categoryQuestions.reduce((total, ques) => {
      return total + (ques.correct_answer === ques.options?.[ques.userOption ?? -1] ? 1 : 0);
    }, 0);
    const scorePercentage = (correctAnswers / categoryQuestions.length) * 100;
    return {
      total: categoryQuestions.length,
      correct: correctAnswers,
      percentage: Math.round(scorePercentage),
    };
  };

  // Get unique categories from the questions
  const categories = Array.from(new Set(questions.map(ques => ques.category)));
  const scores = categories.map(category => ({
    category,
    ...calculateCategoryScore(category),
  }));

  // Calculate overall score
  const score = questions.reduce((total, ques) => {
    return total + (ques.correct_answer === ques.options?.[ques.userOption ?? -1] ? 1 : 0);
  }, 0);
  const overallPercentage = Math.round((score / questions.length) * 100);

  return (
    <div className="flex flex-col w-full h-full px-20 pt-5 text-black dark:text-white bg-white dark:bg-black justify-center items-center">
      <div className='w-[300px]'>
        <h2 className="header">
          <div className='flex items-center justify-center rounded-full text-[52px] w-52 h-52 bg-zinc-200/20 border'>
            {overallPercentage}%
          </div>
        </h2>
        <div className="details-holder">
          <h3>Your Performance</h3>
          <Progress value={overallPercentage} />
          <h3>Subject Grades</h3>
          {scores.map(({ category, correct, total, percentage }) => (
            <div key={category} className="mt-2">
              <h3>{category}: {correct}/{total} ({percentage}%)</h3>
              <Progress value={percentage} />
            </div>
          ))}
        </div>
      </div>
      <Button onClick={() => router.push('/default')}>Start New Quiz</Button>
      <Card className="p-5 bg-zinc-200/20 border">
        {questions.map((ques, qIndex) => (
          <div key={qIndex}>
            <div>{qIndex + 1}. {ques.question}</div>
            {ques.options?.map((option, oIndex) => (
              <div key={oIndex} className={`flex flex-row ${option === ques.correct_answer ? 'correct' : ''} ${ques.userOption === oIndex ? 'user-option' : ''}`}>
                {String.fromCharCode(65 + oIndex)}. {option}
                {option === ques.correct_answer && <span> Correct Answer</span>}
                {ques.userOption === oIndex && option !== ques.correct_answer && <span> Your Answer</span>}
              </div>
            ))}
          </div>
        ))}
      </Card>
    </div>
  );
};

export default Result;
