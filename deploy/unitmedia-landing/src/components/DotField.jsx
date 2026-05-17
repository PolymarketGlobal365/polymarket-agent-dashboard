import { useMemo, useState } from "react";

const dotRows = 8;
const dotCols = 22;

export default function DotField() {
  const [pointer, setPointer] = useState(null);

  const dots = useMemo(() => {
    return Array.from({ length: dotRows * dotCols }, (_, index) => ({
      row: Math.floor(index / dotCols),
      col: index % dotCols,
    }));
  }, []);

  const handleMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      width: bounds.width,
      height: bounds.height,
    });
  };

  const resetPointer = () => setPointer(null);

  return (
    <>
      <div className="dot-field" onPointerMove={handleMove} onPointerLeave={resetPointer} aria-hidden="true">
        {dots.map((dot) => {
          const forceData = computeForce(dot, pointer);
          return (
            <span
              key={`${dot.row}-${dot.col}`}
              className="dot"
              style={{
                "--row": dot.row,
                "--col": dot.col,
                transform: `translate(${forceData.translateX}px, ${forceData.translateY}px) scale(${forceData.scale})`,
                opacity: forceData.opacity,
              }}
            />
          );
        })}
      </div>
      <div
        className="pointer-aura"
        aria-hidden="true"
        style={{
          opacity: pointer ? 1 : 0,
          transform: pointer ? `translate(${pointer.x}px, ${pointer.y}px)` : undefined,
        }}
      ></div>
    </>
  );
}

function computeForce(dot, pointer) {
  if (!pointer) {
    return { translateX: 0, translateY: 0, scale: 1, opacity: 0.86 };
  }

  const dotX = (dot.col / (dotCols - 1)) * pointer.width;
  const dotY = (dot.row / (dotRows - 1)) * pointer.height;
  const dx = dotX - pointer.x;
  const dy = dotY - pointer.y;
  const maxDistance = Math.min(pointer.width, pointer.height) * 0.28;
  const distance = Math.hypot(dx, dy);
  const force = Math.max(0, 1 - distance / maxDistance);

  return {
    translateX: dx * force * 0.16,
    translateY: dy * force * 0.16,
    scale: 1 + force * 1.5,
    opacity: (0.72 + force * 0.28).toFixed(3),
  };
}
