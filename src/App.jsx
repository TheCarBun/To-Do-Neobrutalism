import { useRef, useState, useEffect } from "react";
import DigitalClock from "./components/DigiClock";
import DialClock from "./components/DialClock";
import ToDoList from "./components/ToDoList";
import WidgetWrapper from "./components/WidgetWrapper";
import Settings from "./components/Settings";
import { useAppearance } from "./hooks/useAppearance";
import "./App.css";

function App() {
  const constraintsRef = useRef(null);
  const { 
    darkMode, setDarkMode, 
    autoTheme, setAutoTheme, 
    showWidgets, setShowWidgets, 
    themeColor, setThemeColor 
  } = useAppearance();

  // Widget selector state
  const [enabledWidgets, setEnabledWidgets] = useState(() => {
    const saved = localStorage.getItem("enabledWidgets");
    return saved ? JSON.parse(saved) : ["dial-clock", "digital-clock", "more-incoming"];
  });

  // Persist enabled widgets
  useEffect(() => {
    localStorage.setItem("enabledWidgets", JSON.stringify(enabledWidgets));
  }, [enabledWidgets]);

  return (
    <div className="min-h-screen bg-background font-bitcount p-4 flex flex-col md:flex-row gap-4 items-start w-full transition-colors duration-300">
      
      {/* To-do Area (Left) */}
      <div className="flex flex-col items-center w-full md:w-1/4 min-w-[500px]">
        <h2 className="text-2xl text-foreground/20 uppercase mb-4">Task Station</h2>
        <ToDoList />
      </div>

      {/* Widget Area (Right) */}
      <div 
        ref={constraintsRef}
        className="flex-1 flex flex-col items-center w-full h-[95vh] bg-secondary-background/50 border-2 border-border/10 rounded-xl p-8 gap-8 relative overflow-hidden"
      >
        <div className="absolute top-4 left-4 text-foreground/20 text-4xl uppercase pointer-events-none">
          Widget Area
        </div>
        
        {/* Draggable Widgets */}
        {showWidgets && (
          <>
            {enabledWidgets.includes("dial-clock") && (
              <WidgetWrapper id="dial-clock" constraintsRef={constraintsRef} defaultPosition={{ x: 10, y: 20 }}>
                <DialClock size={300} className="shadow-shadow rounded-full border-2 border-black bg-white" />
              </WidgetWrapper>
            )}

            {enabledWidgets.includes("digital-clock") && (
              <WidgetWrapper id="digital-clock" constraintsRef={constraintsRef} defaultPosition={{ x: 500, y: 5 }}>
                <DigitalClock /> 
              </WidgetWrapper>
            )}           
          </>
        )}

      </div>
      
        {/* Settings Button & Panel */}
        <Settings 
          darkMode={darkMode} setDarkMode={setDarkMode}
          autoTheme={autoTheme} setAutoTheme={setAutoTheme}
          showWidgets={showWidgets} setShowWidgets={setShowWidgets}
          themeColor={themeColor} setThemeColor={setThemeColor}
          enabledWidgets={enabledWidgets} setEnabledWidgets={setEnabledWidgets}
        />
    </div>
  );
}

export default App;
