import React, { useState, useEffect, useRef } from 'react';

const AnimatedNumber = ({
  value = 0,
  duration = 1200,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const target = typeof value === 'number' ? value : parseFloat(value) || 0;
    if (isNaN(target)) {
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          let startTime = null;

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = target * easeProgress;
            setDisplayValue(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setDisplayValue(target);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.15 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, duration]);

  const formatted =
    typeof displayValue === 'number'
      ? displayValue.toLocaleString('en-IN', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : displayValue;

  return (
    <span ref={elementRef} className={`inline-block font-mono ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default AnimatedNumber;
