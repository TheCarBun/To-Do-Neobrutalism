import DigitalClock from "./components/DigiClock";
import ToDoList from "./components/ToDoList";
import MoreIncoming from "./components/MoreIncoming";
import "./App.css";

import { motion } from "motion/react";

function App() {
  return (
    <div className="min-h-screen bg-teal-50 font-bitcount p-4 flex flex-col md:flex-row gap-4 items-start w-full">
      
      {/* To-do Area (Left) */}
      <div className="flex flex-col items-center w-full md:w-1/4 min-w-[500px]">
        <h2 className="text-2xl text-black/20 uppercase mb-4">Task Station</h2>
        <ToDoList />
      </div>

      {/* Widget Area (Right) */}
      <div className="flex-1 flex flex-col items-center w-full h-[95vh] bg-white/50 border-2 border-black/10 rounded-xl p-8 gap-8 relative overflow-hidden">
        <div className="absolute top-4 left-4 text-black/20 text-4xl uppercase pointer-events-none">
          Widget Area
        </div>
        
        {/* Draggable Widgets */}

        <motion.div drag dragMomentum={false} className="z-20 absolute top-5 right-5">
          <DigitalClock /> 
        </motion.div>

        <motion.div drag dragMomentum={false} className="z-10 w-full max-w-sm absolute bottom-5 right-5">
          <MoreIncoming />
        </motion.div>
      </div>
      
    </div>
  );
}

export default App;
