import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

const DigitalClock = () => {
  // 1. State to hold the current time
  const [time, setTime] = useState(new Date());

  // 2. Effect to update the time every second
  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date()); // Update the time state
    }, 1000);

    // Cleanup function: important to clear the interval when the component unmounts
    return () => clearInterval(timerId);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // 3. Formatting the time
  // Use toLocaleTimeString and options to ensure two digits for everything
  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");

  // 4. Function to render a single time segment (e.g., "10")
  const renderSegment = (segment) => (
    <div className="flex h-15">
      {/* Map over the characters of the two-digit string (e.g., '1' and '0') */}
      {segment.split("").map((digit, index) => (
        <Card
          key={index}
          className="w-10 h15 flex items-center justify-center m-1 bg-teal-200 text-2xl"
        >
          {digit}
        </Card>
      ))}
    </div>
  );

  return (
    <Card className="w-max p-2 flex-row items-center fixed right-5 top-5 gap-0 bg-teal-50">
      {renderSegment(hours)}
      <span className="w-2 h15 items-center justify-center m-1 text-2xl">
        :
      </span>
      {renderSegment(minutes)}
      {/* <span className="w-2 h15 flex items-center justify-center m-1 text-2xl">
        :
      </span>
      {renderSegment(seconds)} */}
    </Card>
  );
};

export default DigitalClock;
