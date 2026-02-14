"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * RadialClockFace - Neo-Brutalist Version
 * A customizable SVG clock face with hard borders and shadows.
 *
 * @param {number} size - Diameter of the SVG (default 400)
 * @param {string} mode - "12h" or "24h" (default "24h")
 * @param {string} period - "AM" or "PM" (for 12h mode logic, though styling is now unified)
 * @param {number} labelStep - Frequency of hour labels (default 3)
 * @param {Array} bezelSegments - Custom colored segments [{ start, end, color }]
 * @param {string} className - Optional CSS classes
 */
/**
 * RadialClockFace - Neo-Brutalist Version
 * A customizable SVG clock face with hard borders and shadows.
 */
export function RadialClockFace({
  size = 400,
  mode = "12h",
  period,
  labelStep,
  bezelSegments,
  className,
}) {
  const center = size / 2;
  // Reduce radius slightly to account for the stroke and shadow offset so it fits in viewBox
  const offset = 4; // Hard shadow offset
  const strokeWidth = 3;
  const outerRadius = size / 2 - offset - strokeWidth; 
  const innerRadius = size * 0.267; // Keep proportional inner radius for segments

  const totalHours = mode === "12h" ? 12 : 24;
  const step = labelStep ?? 3;

  // Neo-Brutalist Constants
  const borderColor = "#000"; // Hard black
  const shadowColor = "#000"; // Hard black shadow
  const bgColor = "#fff"; // White face
  const tickColor = "#000"; // Black ticks

  const uniqueSuffix = React.useId().replace(/[:]/g, "-");
  const ringId = `neo-${mode}-${period ?? "all"}-${uniqueSuffix}`;

  return (
    <div className={cn("relative inline-block", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        shapeRendering="geometricPrecision"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <mask
            id={`ring-mask-${ringId}`}
            x="0"
            y="0"
            width={size}
            height={size}
            maskUnits="userSpaceOnUse"
          >
            <circle cx={center} cy={center} r={outerRadius} fill="white" />
            <circle cx={center} cy={center} r={innerRadius} fill="black" />
          </mask>
        </defs>

        {/* Hard Shadow (Offset Circle) */}
        <circle
          cx={center + offset}
          cy={center + offset}
          r={outerRadius}
          fill={shadowColor}
        />

        {/* Main Face Background */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill={bgColor}
          stroke={borderColor}
          strokeWidth={strokeWidth}
        />

        {/* Bezel Segments (Flat Colors) */}
        {bezelSegments && bezelSegments.length > 0 && (
          <g mask={`url(#ring-mask-${ringId})`}>
            {bezelSegments.map((seg, idx) => (
              <path
                key={`bezel-${idx}`}
                d={describeRingSegment(
                  center,
                  innerRadius,
                  outerRadius,
                  seg.start,
                  seg.end
                )}
                fill={seg.color}
                stroke={borderColor}
                strokeWidth={1}
              />
            ))}
          </g>
        )}

        {/* Inner Circle Decoration (optional, adds depth to bezel) */}
        {bezelSegments && bezelSegments.length > 0 && (
            <circle 
                cx={center} 
                cy={center} 
                r={innerRadius} 
                fill="none" 
                stroke={borderColor} 
                strokeWidth={strokeWidth} 
            />
        )}


        {/* Ticks: Major (Hours) + Minor (Half-Hours) */}
        {Array.from({ length: totalHours * 2 }, (_, i) => {
          const isHour = i % 2 === 0;
          const hourIndex = i / 2; // integer if isHour
          const angle = (i / (totalHours * 2)) * 360;
          
          let tickLength, tickW;
          
          if (isHour) {
             // Existing logic for full hours
             const isQuarter = hourIndex % (totalHours / 4) === 0;
             tickLength = isQuarter ? 20 : 12;
             tickW = isQuarter ? 4 : 2;
          } else {
             // Logic for half-hours (between hours)
             tickLength = 6; // Smaller
             tickW = 1;      // Thinner
          }

          const p1 = pointOnCircle(center, center, outerRadius - 4, angle);
          const p2 = pointOnCircle(center, center, outerRadius - 4 - tickLength, angle);

          return (
            <line
              key={`tick-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={tickColor}
              strokeWidth={tickW}
              strokeLinecap="square"
            />
          );
        })}

        {/* Hour Labels */}
        {Array.from({ length: totalHours }, (_, i) => {
          if (i % step !== 0) return null;
          const angle = (i / totalHours) * 360;
          // Position labels slightly inward
          const labelDist = outerRadius - 45; 
          const labelPoint = pointOnCircle(center, center, labelDist, angle);
          const displayHour = mode === "12h" ? (i === 0 ? 12 : i) : i;

          return (
            <text
              key={`label-${i}`}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-bitcount text-lg font-bold select-none"
              fill={tickColor}
              style={{ fontWeight: 700 }}
            >
              {displayHour.toString().padStart(2, "0")}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * DialClock - Logic Wrapper
 * Handles time state and passes appropriate bezel segments to RadialClockFace
 */
export default function DialClock({ size = 300, className, ...props }) {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000); // 1 minute update is enough for hour hand usually, but 1s is fine for accuracy

    return () => clearInterval(timer);
  }, []);

  // Calculate segment based on 12h format as requested by user update
  const mode = "12h";
  let hours = time.getHours();
  const minutes = time.getMinutes();
  
  // Normalize to 12h format (0-11.99)
  hours = hours % 12; // 0-11
  
  const totalMinutes = hours * 60 + minutes;
  const dayMinutes = 12 * 60; // 720 minutes in 12h
  
  // Angle: 0 degrees is top (12:00/00:00).
  const endAngle = (totalMinutes / dayMinutes) * 360;

  const bezelSegments = [
    { start: 0, end: endAngle, color: "#2dd4bf" } // Teal-400
  ];

  return (
    <RadialClockFace
      size={size}
      mode={mode}
      bezelSegments={bezelSegments}
      className={className}
      labelStep={3}
      {...props}
    />
  );
}

/**
 * Helper: Calculate coordinates on a circle
 */
function pointOnCircle(cx, cy, radius, angle) {
  let normalizedAngle = angle % 360;
  if (normalizedAngle < 0) normalizedAngle += 360;
  const rad = ((normalizedAngle - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

/**
 * Helper: Generates SVG path for a ring segment
 */
function describeRingSegment(
  center,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle
) {
  const normalize = (a) => {
    const n = a % 360;
    return n < 0 ? n + 360 : n;
  };
  const s = normalize(startAngle);
  const e = normalize(endAngle);
  
  // Handle full circle case or near full circle
  // If start and end are same, it might draw nothing or everything depending on logic.
  // For clock, if it's 00:00, end is 0. 
  
  // If e < s (e.g. crossing midnight), we want the larger arc? 
  // Or just 0 to end. Since we start at 0, endAngle goes from 0 to 360.
  
  const delta = (e - s + 360) % 360;
  // if delta is very small but positive, draw it.
  
  const largeArc = delta > 180 ? 1 : 0;
  const toRad = (deg) => ((deg - 90) * Math.PI) / 180;

  const sr = toRad(s);
  const er = toRad(e);

  const x1 = center + outerRadius * Math.cos(sr);
  const y1 = center + outerRadius * Math.sin(sr);
  const x2 = center + outerRadius * Math.cos(er);
  const y2 = center + outerRadius * Math.sin(er);
  const x3 = center + innerRadius * Math.cos(er);
  const y3 = center + innerRadius * Math.sin(er);
  const x4 = center + innerRadius * Math.cos(sr);
  const y4 = center + innerRadius * Math.sin(sr);

  return [
    `M ${x1.toFixed(3)},${y1.toFixed(3)}`,
    `A ${outerRadius.toFixed(3)},${outerRadius.toFixed(3)} 0 ${largeArc},1 ${x2.toFixed(3)},${y2.toFixed(3)}`,
    `L ${x3.toFixed(3)},${y3.toFixed(3)}`,
    `A ${innerRadius.toFixed(3)},${innerRadius.toFixed(3)} 0 ${largeArc},0 ${x4.toFixed(3)},${y4.toFixed(3)}`,
    "Z",
  ].join(" ");
}

