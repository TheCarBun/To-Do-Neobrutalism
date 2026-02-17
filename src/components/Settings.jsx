import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Settings as SettingsIcon, X } from "lucide-react";

// Available widgets list
const AVAILABLE_WIDGETS = [
  { id: "dial-clock", name: "Dial Clock" },
  { id: "digital-clock", name: "Digital Clock" },
];

// Helper functions for hue slider
function hexToHue(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  if (delta === 0) return 0;
  
  let hue;
  if (max === r) {
    hue = ((g - b) / delta) % 6;
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }
  
  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;
  
  return hue;
}

function hueToHex(hue) {
  const s = 0.7; // 70% saturation
  const l = 0.6; // 60% lightness
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
  const m = l - c / 2;
  
  let r, g, b;
  if (hue < 60) {
    [r, g, b] = [c, x, 0];
  } else if (hue < 120) {
    [r, g, b] = [x, c, 0];
  } else if (hue < 180) {
    [r, g, b] = [0, c, x];
  } else if (hue < 240) {
    [r, g, b] = [0, x, c];
  } else if (hue < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }
  
  const toHex = (n) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const Settings = ({ 
  darkMode, setDarkMode, 
  autoTheme, setAutoTheme,
  themeColor, setThemeColor,
  enabledWidgets, setEnabledWidgets
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-6 left-6 p-3 bg-secondary-background border-2 border-border rounded-full shadow-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-secondary-background/80 z-50 text-foreground"
      >
        <SettingsIcon size={24} />
      </button>

      {/* Settings Modal/Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            />
            
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-20 left-6 w-80 bg-secondary-background border-4 border-border p-6 rounded-xl shadow-shadow z-[70] flex flex-col gap-6"
            >
              <div className="flex justify-between items-center border-b-2 border-border/10 pb-4">
                <h3 className="text-xl font-bold uppercase">System</h3>
                <button onClick={() => setIsOpen(false)} className="hover:bg-foreground/5 rounded p-1">
                  <X size={24} />
                </button>
              </div>

              {/* Toggles */}
              <div className="space-y-4">
                
                <div className="flex justify-between items-center">
                  <span className="font-bold">Auto Theme (12PM-12AM)</span>
                  <Switch checked={autoTheme} onCheckedChange={setAutoTheme} />
                </div>

                <div className="flex justify-between items-center opacity-100 transition-opacity">
                   {/* If Auto is On, maybe disable this? But user requested "Manual override handling" implies it should still work.
                       The hook logic: "If autoTheme is OFF: Follow user's manual toggle."
                       If Auto is ON, the hook forces dark/light based on time. 
                       If I toggle this while Auto is ON, it will just flip back on the next interval tick (1 min) or immediately if I used `useEffect`.
                       So practically, if Auto is ON, this switch is readonly or disabled.
                   */}
                  <span className={`font-bold ${autoTheme ? "opacity-50" : ""}`}>Dark Mode</span>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={(val) => {
                      if (!autoTheme) setDarkMode(val); // Only allow change if auto is off
                    }} 
                    disabled={autoTheme}
                    className={autoTheme ? "opacity-50 cursor-not-allowed" : ""}
                  />
                </div>
              </div>

              {/* Widget Selector */}
              <div className="space-y-3 pt-2 border-t-2 border-border/10">
                <label className="font-bold">Active Widgets</label>
                <div className="space-y-2">
                  {AVAILABLE_WIDGETS.map((widget) => (
                    <div key={widget.id} className="flex justify-between items-center">
                      <span className="text-sm">{widget.name}</span>
                      <Switch 
                        checked={enabledWidgets.includes(widget.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEnabledWidgets([...enabledWidgets, widget.id]);
                          } else {
                            setEnabledWidgets(enabledWidgets.filter(id => id !== widget.id));
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Slider (Hue only) */}
              <div className="space-y-2 pt-2 border-t-2 border-border/10">
                <label className="font-bold flex justify-between">
                  <span>Theme Hue</span>
                  <span className="text-xs font-normal opacity-50 uppercase">{themeColor}</span>
                </label>
                <div className="flex flex-col gap-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="360" 
                    value={hexToHue(themeColor)}
                    onChange={(e) => setThemeColor(hueToHex(parseInt(e.target.value)))}
                    className="w-full h-8 cursor-pointer appearance-none rounded-lg border-2 border-border"
                    style={{
                      background: `linear-gradient(to right, 
                        hsl(0, 70%, 60%), 
                        hsl(60, 70%, 60%), 
                        hsl(120, 70%, 60%), 
                        hsl(180, 70%, 60%), 
                        hsl(240, 70%, 60%), 
                        hsl(300, 70%, 60%), 
                        hsl(360, 70%, 60%)
                      )`
                    }}
                  />
                  <style>{`
                    input[type="range"]::-webkit-slider-thumb {
                      appearance: none;
                      width: 24px;
                      height: 24px;
                      border-radius: 50%;
                      background: white;
                      border: 3px solid black;
                      cursor: pointer;
                      box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
                    }
                    input[type="range"]::-moz-range-thumb {
                      width: 24px;
                      height: 24px;
                      border-radius: 50%;
                      background: white;
                      border: 3px solid black;
                      cursor: pointer;
                      box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
                    }
                  `}</style>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Settings;
