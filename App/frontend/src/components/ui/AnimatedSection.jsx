import React, { useEffect, useRef } from 'react';

const AnimatedSection = ({ children, delay = 0, className = '' }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add(
                'animate-fadeInUp',
                'duration-500',
                'ease-out'
              );
            }, delay);
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [delay]);

  return (
    <div
      ref={sectionRef}
      className={`opacity-0 translate-y-6 ${className}`}
      style={{ animationFillMode: 'both' }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;