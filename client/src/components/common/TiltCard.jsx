import React, { useRef, useState, useEffect } from 'react';

const TiltCard = ({
  children,
  className = '',
  maxTilt = 7,
  glare = true,
  depth = 30, // 3D depth pop-out in pixels for children
}) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (e) => {
    if (isTouch || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
      transformStyle: 'preserve-3d',
    });

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        opacity: 0.35,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(16, 185, 129, 0.28) 0%, rgba(245, 158, 11, 0.08) 35%, transparent 70%)`,
        transition: 'opacity 0.2s ease',
      });
    }
  };

  const handleMouseLeave = () => {
    if (isTouch) return;
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
      transformStyle: 'preserve-3d',
    });
    setGlareStyle({ opacity: 0, transition: 'opacity 0.5s ease' });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`relative will-change-transform ${className}`}
    >
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] overflow-hidden mix-blend-screen"
          style={glareStyle}
          aria-hidden="true"
        />
      )}
      <div style={{ transform: `translateZ(${depth}px)`, transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  );
};

export default TiltCard;
