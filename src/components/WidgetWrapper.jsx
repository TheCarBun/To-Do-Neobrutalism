import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

const WidgetWrapper = ({ children, id, constraintsRef, defaultPosition, className }) => {
  const widgetRef = useRef(null)
  const [position, setPosition] = useState(defaultPosition || { x: 0, y: 0 });
  const [hasLoaded, setHasLoaded] = useState(false);

  const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  };

  useEffect(() => {
    const saved = localStorage.getItem(`widget_pos_${id}`);
    if (saved) {
      setPosition(JSON.parse(saved));
    }
    setHasLoaded(true);
  }, [id]);

  const handleDragEnd = (_, info) => {
  if (!constraintsRef.current || !widgetRef.current) return;

  const containerRect = constraintsRef.current.getBoundingClientRect();
  const widgetRect = widgetRef.current.getBoundingClientRect();

  const newX = position.x + info.offset.x;
  const newY = position.y + info.offset.y;

  const maxX = containerRect.width - widgetRect.width;
  const maxY = containerRect.height - widgetRect.height;

  const clampedX = clamp(newX, 0, maxX);
  const clampedY = clamp(newY, 0, maxY);

  const finalPos = { x: clampedX, y: clampedY };

  setPosition(finalPos);
  localStorage.setItem(`widget_pos_${id}`, JSON.stringify(finalPos));
};


  if (!hasLoaded) return null; // Avoid hydration mismatch or flashy jumps

  return (
    <motion.div
      ref={widgetRef}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={constraintsRef}
      initial={position}       
      // animate={position}
      onDragEnd={handleDragEnd}
      
      className={`absolute z-10 cursor-grab active:cursor-grabbing ${className}`}
      whileDrag={{scale: 1.01, cursor: "grabbing" }}
    >
      {children}
    </motion.div>
  );
};

export default WidgetWrapper;
