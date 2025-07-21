import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMagneticEffect } from '../hooks/useGSAP';

gsap.registerPlugin(ScrollTrigger);

// Animated counter component
export const AnimatedCounter = ({ end, duration = 2, suffix = '', prefix = '' }) => {
  const counterRef = useRef();

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;

    const counter = { value: 0 };
    
    gsap.to(counter, {
      value: end,
      duration: duration,
      ease: "power2.out",
      onUpdate: () => {
        element.textContent = prefix + Math.round(counter.value) + suffix;
      },
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  }, [end, duration, suffix, prefix]);

  return <span ref={counterRef}>0</span>;
};

// Magnetic button component
export const MagneticButton = ({ children, className = '', onClick, strength = 0.3 }) => {
  const buttonRef = useRef();
  useMagneticEffect(buttonRef, strength);

  return (
    <button
      ref={buttonRef}
      className={`magnetic-btn ${className}`}
      onClick={onClick}
    >
      <div className="btn-bg absolute inset-0 rounded-inherit bg-gradient-to-r from-purple-600 to-pink-600 opacity-0"></div>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

// Floating card component
export const FloatingCard = ({ children, className = '', delay = 0 }) => {
  const cardRef = useRef();

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    // Initial animation
    gsap.fromTo(element,
      {
        opacity: 0,
        y: 100,
        rotationX: -15
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1.2,
        delay: delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Floating animation
    gsap.to(element, {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      delay: delay
    });

    // Hover effect
    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: 1.05,
        rotationY: 5,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        rotationY: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`hover-card interactive-card ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="card-glow absolute inset-0 rounded-inherit bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0"></div>
      {children}
    </div>
  );
};

// Text reveal component
export const TextReveal = ({ children, className = '', stagger = 0.02 }) => {
  const textRef = useRef();

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const text = element.textContent;
    const chars = text.split('').map(char => 
      `<span class="inline-block opacity-0 translate-y-12">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
    
    element.innerHTML = chars;
    const spans = element.querySelectorAll('span');

    gsap.to(spans, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: stagger,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  }, [stagger]);

  return (
    <div ref={textRef} className={`text-reveal ${className}`}>
      {children}
    </div>
  );
};

// Morphing shape component
export const MorphingShape = ({ className = '' }) => {
  const shapeRef = useRef();

  useEffect(() => {
    const element = shapeRef.current;
    if (!element) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    tl.to(element, {
      borderRadius: "50%",
      rotation: 180,
      scale: 1.2,
      duration: 3,
      ease: "power2.inOut"
    })
    .to(element, {
      borderRadius: "20%",
      rotation: 360,
      scale: 0.8,
      duration: 3,
      ease: "power2.inOut"
    })
    .to(element, {
      borderRadius: "0%",
      rotation: 540,
      scale: 1,
      duration: 3,
      ease: "power2.inOut"
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={shapeRef}
      className={`w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 ${className}`}
    />
  );
};

// Parallax container
export const ParallaxContainer = ({ children, speed = 0.5, className = '' }) => {
  const containerRef = useRef();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    gsap.to(element, {
      yPercent: -100 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }, [speed]);

  return (
    <div ref={containerRef} className={`parallax ${className}`}>
      {children}
    </div>
  );
};

// Glitch text effect
export const GlitchText = ({ children, className = '' }) => {
  const textRef = useRef();

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    
    tl.to(element, {
      skewX: 10,
      duration: 0.1,
      ease: "power2.inOut"
    })
    .to(element, {
      skewX: -10,
      scaleX: 1.1,
      duration: 0.1,
      ease: "power2.inOut"
    })
    .to(element, {
      skewX: 0,
      scaleX: 1,
      duration: 0.1,
      ease: "power2.inOut"
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <span ref={textRef} className={`inline-block ${className}`}>
      {children}
    </span>
  );
};

// Scroll-triggered section
export const ScrollSection = ({ children, className = '', animation = 'fadeIn' }) => {
  const sectionRef = useRef();

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    let animationProps = {};

    switch (animation) {
      case 'fadeIn':
        animationProps = {
          from: { opacity: 0, y: 50 },
          to: { opacity: 1, y: 0 }
        };
        break;
      case 'slideLeft':
        animationProps = {
          from: { opacity: 0, x: -100 },
          to: { opacity: 1, x: 0 }
        };
        break;
      case 'slideRight':
        animationProps = {
          from: { opacity: 0, x: 100 },
          to: { opacity: 1, x: 0 }
        };
        break;
      case 'scaleUp':
        animationProps = {
          from: { opacity: 0, scale: 0.8 },
          to: { opacity: 1, scale: 1 }
        };
        break;
      default:
        animationProps = {
          from: { opacity: 0 },
          to: { opacity: 1 }
        };
    }

    gsap.fromTo(element, animationProps.from, {
      ...animationProps.to,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  }, [animation]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
};

// Interactive timeline
export const InteractiveTimeline = ({ items = [] }) => {
  const timelineRef = useRef();

  useEffect(() => {
    const element = timelineRef.current;
    if (!element) return;

    const timelineItems = element.querySelectorAll('.timeline-item');
    
    gsap.fromTo(timelineItems,
      {
        opacity: 0,
        x: -50
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Add hover effects
    timelineItems.forEach((item) => {
      const handleMouseEnter = () => {
        gsap.to(item, {
          scale: 1.05,
          x: 10,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        gsap.to(item, {
          scale: 1,
          x: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      item.addEventListener('mouseenter', handleMouseEnter);
      item.addEventListener('mouseleave', handleMouseLeave);
    });
  }, [items]);

  return (
    <div ref={timelineRef} className="space-y-6">
      {items.map((item, index) => (
        <div key={index} className="timeline-item flex items-center space-x-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <div>
            <h3 className="font-semibold text-white">{item.title}</h3>
            <p className="text-gray-300 text-sm">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

