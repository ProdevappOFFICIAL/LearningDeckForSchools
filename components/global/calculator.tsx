"use client"
import { useState } from 'react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Calculator() {
  const [result, setResult] = useState('');
  const [expression, setExpression] = useState('');

  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        setResult(eval(expression).toString());
      } catch (error) {
        setResult('Syntax Error',error);
      }
    } else if (value === 'C') {
      setResult('');
      setExpression('');
    } else if (result === '0.30000000000000004'){
        setResult('0.3');
    } 
    else {
      setExpression((prevExpression) => prevExpression + value);
    }
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', 'C', '+',
    '='
  ];

  return (<div className=' flex flex-col'>

  <Input  value={expression}/>
<div className=' h-2'/>
<div className=' flex flex-row'>
<div className=' w-full'/>
  
    <div className='w-full'/>

 <Input   value={result}
          className=' border-zinc-300 bg-zinc-200 w-28'
          placeholder='Answer'
       readOnly/>
</div>
         

    <div className=' h-4'/>
        <div className="grid grid-cols-4  gap-2 items-end justify-end">
          {buttons.map((btn) => (
            <Button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className="text-xl bg-white text-black border  hover:bg-zinc-200/20 rounded-lg dark:border-gray-200 dark:bg-gray-900 dark:text-gray-200" 
            >
              {btn}
            </Button>
            
          ))}
          </div>
      
</div>
     )};