import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop devices with fine pointers and without reduced motion
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPos({ x: targetX, y: targetY });
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      const isInteractive =
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.closest('[role="button"]') ||
        target.closest('.interactive');

      setIsHovering(Boolean(isInteractive));
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    // Smooth trailing animation loop
    let rafId;
    const loop = () => {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      setTrailingPos({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Precision Center Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        }}
      >
        <div
          className={`w-2 h-2 rounded-full transition-all duration-150 ${
            isHovering
              ? 'bg-brand-400 scale-150'
              : 'bg-brand-500 scale-100 shadow-[0_0_10px_rgba(16,185,129,0.8)]'
          }`}
        />
      </div>

      {/* Trailing Ambient Aura Ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0)`,
        }}
      >
        <div
          className={`rounded-full border border-brand-500/40 transition-all duration-300 ease-out ${
            isHovering
              ? 'w-10 h-10 bg-brand-500/10 scale-125 border-brand-400/80 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : 'w-7 h-7 scale-100'
          }`}
        />
      </div>
    </>
  );
};

export default CustomCursor;
