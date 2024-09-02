import { useState, useEffect } from "react";

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const now:any = new Date();
    const nextMidnight :any= new Date();
    
    // Set to 12 AM of the next day
    nextMidnight.setHours(24, 0, 0, 0);
    
    const difference = nextMidnight - now;

    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center mb-2 md:mb-5">
      {timeLeft.hours !== undefined ? (
        <div className={`${timeLeft.hours<5?(timeLeft.hours<2?'text-red-500':'text-yellow-500'):'text-sky-500'}`}>
          <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
          <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
          <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      ) : (
        <div>00:00:00</div>
      )}
    </div>
  );
};

export default CountdownTimer;
