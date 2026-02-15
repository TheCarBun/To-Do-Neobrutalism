import { useState, useEffect } from "react";

const TopClock = () => {
  const [progress, setProgress] = useState(0);
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // Calculate percentage for 12-hour cycle
      // (Hours % 12) converts 24h to 12h (0-11)
      // We convert everything to seconds for smooth movement
      const totalSecondsIn12h = 12 * 60 * 60;
      const currentSeconds = (hours % 12) * 3600 + minutes * 60 + seconds;

      const percentage = (currentSeconds / totalSecondsIn12h) * 100;

      setProgress(percentage);

      // Optional: formatted time for a tooltip or display
      setTimeString(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    };

    // Update every second
    const timer = setInterval(updateTime, 1000);
    updateTime(); // Initial call

    return () => clearInterval(timer);
  }, []);

  // Generate the ticks for the 12-hour scale
  const renderTicks = () => {
    const hours = 12;
    const elements = [];

    for (let i = 0; i <= hours; i++) {
      // Is this the very last tick (repeating 12/0)?
      // We render 0-11, and a final tick for layout symmetry if needed,
      // but usually 0 is left, 12 is right (same position logically).

      // MAJOR TICK (The Hour)
      elements.push(
        <div
          key={`hour-${i}`}
          className="flex flex-col justify-end items-center h-full relative"
          style={{ flex: 1 }}
        >
          {/* Number Logic: Only show 12, 3, 6, 9 */}
          {/* We map 0 to 12 for display purposes */}
          {i % 3 === 0 && (
            <span className="absolute top-2 text-sm leading-none font-sans">
              {i === 0 ? "12" : i}
            </span>
          )}

          {/* The Bold Line */}
          {/* height: 60% of container, width: 4px */}
          <div className="w-1 md:w-1 h-2/5 bg-black"></div>
        </div>,
      );

      // MINOR TICKS (Between hours)
      // Don't render minor ticks after the last hour mark
      if (i < hours) {
        for (let j = 0; j < 4; j++) {
          elements.push(
            <div
              key={`min-${i}-${j}`}
              className="flex flex-col justify-end items-center h-full"
              style={{ flex: 1 }}
            >
              {/* Thin Line */}
              {/* height: 30% of container, width: 2px */}
              <div className="w-0.5 h-1/3 bg-black"></div>
            </div>,
          );
        }
      }
    }
    return elements;
  };

  return (
    <>
      {/* CONTAINER 
        h-24 (96px) gives it that "thick" look.
        border-b-4 border-black is the signature Neobrutalism stroke.
      */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-10 mb-10 bg-teal-100 border-b-4 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,0.1)]">
        {/* SCALE WRAPPER */}
        <div className="relative w-full h-full flex items-end justify-between px-0 md:px-1 overflow-hidden">
          {/* TICKS */}
          {renderTicks()}

          {/* CURRENT TIME INDICATOR (The Needle) */}
          <div
            className="absolute top-0 bottom-0 w-1 md:w-1.5 bg-teal-500 z-10 transition-all duration-1000 ease-linear pointer-events-none"
            style={{
              left: `${progress}%`,
              // Pull back by 50% of its own width so it centers exactly on the time
              transform: "translateX(-50%)",
            }}
          >
            {/* Optional: A "Head" for the needle to make it look mechanical */}
            {/* <div className="w-4 h-4 bg-red-500 border-2 border-black absolute top-0 left-1/2 -translate-x-1/2"></div> */}
            {/* <div className="absolute top-6 left-6 bg-black text-white text-xs font-bold px-1 py-0.5 whitespace-nowrap border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"> */}
            {/* {timeString} */}
            {/* </div> */}
          </div>
        </div>
      </nav>

      {/* Spacer to push your content down so it's not hidden behind the clock */}
      <div className="h-28 w-full b-10"></div>
    </>
  );
};

export default TopClock;
