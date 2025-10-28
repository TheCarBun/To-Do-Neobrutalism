import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DigitCard = ({ digit }) => (
  <motion.div
    key={digit}
    initial={{ rotateX: 90 }}
    animate={{ rotateX: 0 }}
    exit={{ rotateX: -90 }}
    transition={{ duration: 0.25, ease: "easeIn" }}
  >
    <Card className="w-10 h-10 flex items-center justify-center m-1 bg-teal-100 text-2xl shadow-md">
      {digit}
    </Card>
  </motion.div>
);

const TimeSegment = ({ value }) => (
  <div className="flex">
    {value.split("").map((digit, index) => (
      <AnimatePresence mode="wait" key={index}>
        <DigitCard digit={digit} />
      </AnimatePresence>
    ))}
  </div>
);

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);
  const [showSeconds, setShowSeconds] = useState(false);

  // Update the clock accurately every second
  useEffect(() => {
    const tick = () => {
      setTime(new Date());
      setTimeout(tick, 1000 - (Date.now() % 1000)); // aligns with system clock
    };
    tick();
    return () => clearTimeout(tick);
  }, []);

  let hours = time.getHours();
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");

  if (!is24Hour) {
    hours = hours % 12 || 12; // convert 0 -> 12 for 12-hour format
  }

  const formattedHours = String(hours).padStart(2, "0");
  return (
    <Card className="fixed top-5 right-5 flex flex-row gap-2 p-2 items-end space-y-2 bg-teal-50">
      {/* Clock Display */}
      <Card className="flex-row items-center gap-0 p-2 rounded-lg shadow-lg border flex">
        <TimeSegment value={formattedHours} />
        <span className="text-2xl font-mono mx-1">:</span>
        <TimeSegment value={minutes} />
        {showSeconds && (
          <>
            <span className="text-2xl font-mono mx-1">:</span>
            <TimeSegment value={seconds} />
          </>
        )}
      </Card>

      {/* Control Buttons */}
      <div className="grid gap-2">
        <Button
          onClick={() => setIs24Hour((prev) => !prev)}
          size="icon"
          className="bg-white hover:bg-teal-100"
        >
          {is24Hour ? "12h" : "24h"}
        </Button>

        <Button
          onClick={() => setShowSeconds((prev) => !prev)}
          size="icon"
          className="bg-white hover:bg-teal-100"
        >
          {showSeconds ? "Sec" : "Sec"}
        </Button>
      </div>
    </Card>
  );
  // return (
  //   <Card className="fixed top-5 right-5 flex-row items-center gap-0 p-2 bg-teal-50 rounded-lg shadow-lg border">
  //     <TimeSegment value={hours} />
  //     <span className="text-2xl font-mono mx-1">:</span>
  //     <TimeSegment value={minutes} />
  //     {/* Uncomment to show seconds */}
  //     <span className="text-2xl font-mono mx-1">:</span>
  //     <TimeSegment value={seconds} />
  //   </Card>
  // );
};

export default DigitalClock;
