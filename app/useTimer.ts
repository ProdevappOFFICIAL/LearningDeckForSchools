import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';

interface Time {
  min: number;
  sec: number;
}

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
          isNavigating.current = true;
          router.push('/default/exam/result');
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

export default useTimer;

