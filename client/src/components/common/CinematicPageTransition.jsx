import React from 'react';

const CinematicPageTransition = ({ children, className = '' }) => {
  return (
    <div
      className={`animate-fade-in transition-all duration-300 transform-gpu ${className}`}
      style={{
        animation: 'cinematicEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      {children}
      <style>{`
        @keyframes cinematicEnter {
          0% {
            opacity: 0;
            transform: scale(0.985) translateY(8px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CinematicPageTransition;
