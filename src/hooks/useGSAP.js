import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Custom hook for GSAP animations
export const useGSAP = () => {
  const timelineRef = useRef();

  useEffect(() => {
    timelineRef.current = gsap.timeline();
    
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return {
    timeline: timelineRef.current,
    gsap,
    ScrollTrigger
  };
};

// Scroll-triggered animations
export const useScrollAnimations = () => {
  useEffect(() => {
    // Fade in elements on scroll
    gsap.utils.toArray('.fade-in').forEach((element) => {
      gsap.fromTo(element, 
        { 
          opacity: 0, 
          y: 50 
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Slide in from left
    gsap.utils.toArray('.slide-in-left').forEach((element) => {
      gsap.fromTo(element,
        {
          opacity: 0,
          x: -100
        },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Slide in from right
    gsap.utils.toArray('.slide-in-right').forEach((element) => {
      gsap.fromTo(element,
        {
          opacity: 0,
          x: 100
        },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Scale up animation
    gsap.utils.toArray('.scale-up').forEach((element) => {
      gsap.fromTo(element,
        {
          opacity: 0,
          scale: 0.8
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Stagger animation for lists
    gsap.utils.toArray('.stagger-container').forEach((container) => {
      const items = container.querySelectorAll('.stagger-item');
      gsap.fromTo(items,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Parallax effect
    gsap.utils.toArray('.parallax').forEach((element) => {
      gsap.to(element, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    // Text reveal animation
    gsap.utils.toArray('.text-reveal').forEach((element) => {
      const text = element.textContent;
      element.innerHTML = text.split('').map(char => 
        `<span style="display: inline-block; opacity: 0; transform: translateY(50px);">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');
      
      const chars = element.querySelectorAll('span');
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.05,
        stagger: 0.02,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
};

// Magnetic button effect
export const useMagneticEffect = (ref, strength = 0.3) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(element, {
        x: x * strength,
        y: y * strength,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);
};

// Loading animation
export const useLoadingAnimation = (isLoading) => {
  useEffect(() => {
    if (!isLoading) {
      const tl = gsap.timeline();
      
      tl.to('.loading-screen', {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
      })
      .set('.loading-screen', { display: 'none' })
      .from('.hero-content', {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: "power3.out"
      }, "-=0.3")
      .from('.nav-item', {
        opacity: 0,
        y: -30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=1");
    }
  }, [isLoading]);
};

// Hover animations
export const useHoverAnimations = () => {
  useEffect(() => {
    // Card hover effects
    gsap.utils.toArray('.hover-card').forEach((card) => {
      const tl = gsap.timeline({ paused: true });
      
      tl.to(card, {
        y: -10,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(card.querySelector('.card-glow'), {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      }, 0);

      card.addEventListener('mouseenter', () => tl.play());
      card.addEventListener('mouseleave', () => tl.reverse());
    });

    // Button hover effects
    gsap.utils.toArray('.hover-btn').forEach((btn) => {
      const tl = gsap.timeline({ paused: true });
      
      tl.to(btn, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out"
      })
      .to(btn.querySelector('.btn-bg'), {
        scale: 1.1,
        opacity: 0.8,
        duration: 0.2,
        ease: "power2.out"
      }, 0);

      btn.addEventListener('mouseenter', () => tl.play());
      btn.addEventListener('mouseleave', () => tl.reverse());
    });

    return () => {
      gsap.killTweensOf('.hover-card, .hover-btn');
    };
  }, []);
};

// Scroll progress indicator
export const useScrollProgress = () => {
  useEffect(() => {
    gsap.to('.scroll-indicator', {
      scaleX: 1,
      transformOrigin: "left center",
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
};

// Typewriter effect
export const useTypewriter = (ref, text, speed = 50) => {
  useEffect(() => {
    const element = ref.current;
    if (!element || !text) return;

    element.textContent = '';
    
    gsap.to(element, {
      duration: text.length * speed / 1000,
      text: text,
      ease: "none"
    });
  }, [text, speed]);
};

