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
    <Card className="w-10 h-10 flex items-center justify-center m-1 bg-white border-2 border-black text-4xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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
  const [showSeconds, setShowSeconds] = useState(true);

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
    <Card className="cursor-grab active:cursor-grabbing w-fit flex flex-col gap-2 p-4 items-center bg-white border-2 border-black shadow-shadow z-10">
      {/* Clock Display */}
      <div className="flex flex-row items-center gap-1 p-2 bg-teal-400 border-2 border-black shadow-sm rounded-base">
        <TimeSegment value={formattedHours} />
        <span className="text-2xl font-black mx-1 animate-pulse">:</span>
        <TimeSegment value={minutes} />
        {showSeconds && (
          <>
            <span className="text-2xl font-black mx-1 animate-pulse">:</span>
            <TimeSegment value={seconds} />
          </>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2 w-full justify-center">
        <Button
          onClick={() => setIs24Hour((prev) => !prev)}
          size="sm"
          className="h-8 text-xs bg-white hover:bg-black hover:text-white text-black border-2 border-black font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
        >
          {is24Hour ? "12h" : "24h"}
        </Button>

        <Button
          onClick={() => setShowSeconds((prev) => !prev)}
          size="sm"
          className="h-8 text-xs bg-white hover:bg-black hover:text-white text-black border-2 border-black font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
        >
          {showSeconds ? "Hide Sec" : "Show Sec"}
        </Button>
      </div>
    </Card>
  );
};

export default DigitalClock;
