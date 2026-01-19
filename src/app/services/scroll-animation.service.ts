import { Injectable } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar el plugin de ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

/**
 * Servicio para manejar animaciones basadas en scroll con GSAP
 * Principio de Responsabilidad Única: Solo maneja animaciones de scroll
 */
@Injectable({
  providedIn: 'root'
})
export class ScrollAnimationService {
  private scrollTriggers: ScrollTrigger[] = [];

  /**
   * Inicializa las animaciones de scroll con GSAP
   */
  initializeScrollAnimations(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Esperar a que el DOM esté completamente cargado
    setTimeout(() => {
      this.setupAnimations();
    }, 100);
  }

  /**
   * Configura todas las animaciones
   */
  private setupAnimations(): void {
    // Refrescar ScrollTrigger para recalcular posiciones
    ScrollTrigger.refresh();
    
    // Animaciones fade-up
    this.animateFadeUp();
    
    // Animaciones fade-in
    this.animateFadeIn();
    
    // Animaciones slide
    this.animateSlides();
    
    // Animaciones scale
    this.animateScale();
    
    // Animaciones stagger
    this.animateStagger();
    
    // Refrescar después de un breve delay para elementos dinámicos
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
  }

  /**
   * Animación fade-up (aparece desde abajo)
   */
  private animateFadeUp(): void {
    const elements = document.querySelectorAll('[data-scroll-animate="fade-up"]');
    
    elements.forEach((element) => {
      const delay = parseFloat(element.getAttribute('data-scroll-delay') || '0') / 1000;
      const duration = parseFloat(element.getAttribute('data-scroll-duration') || '500') / 1000;
      
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 60,
          ease: 'power3.out'
        },
        {
          opacity: 1,
          y: 0,
          duration: duration || 0.5,
          delay: delay,
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
            once: false,
            markers: false // Cambiar a true para debug
          }
        }
      );
    });
  }

  /**
   * Animación fade-in (solo opacidad)
   */
  private animateFadeIn(): void {
    const elements = document.querySelectorAll('[data-scroll-animate="fade-in"]');
    
    elements.forEach((element) => {
      const delay = parseFloat(element.getAttribute('data-scroll-delay') || '0') / 1000;
      const duration = parseFloat(element.getAttribute('data-scroll-duration') || '500') / 1000;
      
      gsap.fromTo(
        element,
        {
          opacity: 0,
          ease: 'power2.out'
        },
        {
          opacity: 1,
          duration: duration || 0.5,
          delay: delay,
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            once: false,
            markers: false
          }
        }
      );
    });
  }

  /**
   * Animaciones slide (left y right)
   */
  private animateSlides(): void {
    // Slide left (desde la derecha)
    const slideLeftElements = document.querySelectorAll('[data-scroll-animate="slide-left"]');
    slideLeftElements.forEach((element) => {
      const delay = parseFloat(element.getAttribute('data-scroll-delay') || '0') / 1000;
      const duration = parseFloat(element.getAttribute('data-scroll-duration') || '500') / 1000;
      
      gsap.fromTo(
        element,
        {
          opacity: 0,
          x: 80,
          ease: 'power3.out'
        },
        {
          opacity: 1,
          x: 0,
          duration: duration || 0.5,
          delay: delay,
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            once: false,
            markers: false
          }
        }
      );
    });

    // Slide right (desde la izquierda)
    const slideRightElements = document.querySelectorAll('[data-scroll-animate="slide-right"]');
    slideRightElements.forEach((element) => {
      const delay = parseFloat(element.getAttribute('data-scroll-delay') || '0') / 1000;
      const duration = parseFloat(element.getAttribute('data-scroll-duration') || '500') / 1000;
      
      gsap.fromTo(
        element,
        {
          opacity: 0,
          x: -80,
          ease: 'power3.out'
        },
        {
          opacity: 1,
          x: 0,
          duration: duration || 0.5,
          delay: delay,
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            once: false,
            markers: false
          }
        }
      );
    });
  }

  /**
   * Animación scale (zoom in)
   */
  private animateScale(): void {
    const elements = document.querySelectorAll('[data-scroll-animate="scale"]');
    
    elements.forEach((element) => {
      const delay = parseFloat(element.getAttribute('data-scroll-delay') || '0') / 1000;
      const duration = parseFloat(element.getAttribute('data-scroll-duration') || '500') / 1000;
      
      gsap.fromTo(
        element,
        {
          opacity: 0,
          scale: 0.85,
          ease: 'back.out(1.2)'
        },
        {
          opacity: 1,
          scale: 1,
          duration: duration || 0.5,
          delay: delay,
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            once: false,
            markers: false
          }
        }
      );
    });
  }

  /**
   * Animación stagger para hijos (aparecen uno tras otro)
   */
  private animateStagger(): void {
    const elements = document.querySelectorAll('[data-scroll-animate="stagger"]');
    
    elements.forEach((parentElement) => {
      const children = Array.from(parentElement.children) as HTMLElement[];
      
      if (children.length === 0) return;
      
      const staggerDelay = parseFloat(parentElement.getAttribute('data-stagger-delay') || '0.1');
      const delay = parseFloat(parentElement.getAttribute('data-scroll-delay') || '0') / 1000;
      
      gsap.fromTo(
        children,
        {
          opacity: 0,
          y: 50,
          ease: 'power3.out'
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: delay,
          stagger: staggerDelay,
          scrollTrigger: {
            trigger: parentElement,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            once: false
          }
        }
      );
    });
  }

  /**
   * Animación parallax para elementos (efecto de profundidad)
   */
  animateParallax(element: HTMLElement, speed: number = 0.5): void {
    gsap.to(element, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  /**
   * Animación de números que cuentan hacia arriba
   */
  animateCounter(element: HTMLElement, targetValue: number, duration: number = 2): void {
    const obj = { value: 0 };
    
    gsap.to(obj, {
      value: targetValue,
      duration: duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
        once: true
      },
      onUpdate: () => {
        if (element) {
          element.textContent = Math.round(obj.value).toString();
        }
      }
    });
  }

  /**
   * Crea una animación de parallax suave para elementos de fondo
   */
  createParallaxEffect(element: HTMLElement, speed: number = 0.3): void {
    gsap.to(element, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  /**
   * Animación de texto que se revela letra por letra (split text effect)
   */
  animateTextReveal(element: HTMLElement): void {
    const text = element.textContent || '';
    const words = text.split(' ');
    
    element.innerHTML = words.map((word, i) => 
      `<span style="display: inline-block; opacity: 0; transform: translateY(20px);" data-word-index="${i}">${word}</span>`
    ).join(' ');
    
    const wordSpans = element.querySelectorAll('[data-word-index]');
    
    gsap.to(wordSpans, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
        once: false
      }
    });
  }

  /**
   * Limpia todas las animaciones y scroll triggers
   */
  cleanup(): void {
    // Limpiar todos los ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    this.scrollTriggers = [];
    
    // Limpiar todas las animaciones de GSAP
    gsap.killTweensOf('*');
    
    // Refrescar ScrollTrigger
    ScrollTrigger.refresh();
  }
}
