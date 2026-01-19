import { Component, signal, HostListener, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

/**
 * Componente Navbar - Barra de navegación
 * Principio de Responsabilidad Única: Solo maneja la navegación
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mobileMenu', { static: false }) mobileMenu!: ElementRef<HTMLDivElement>;
  @ViewChild('mobileMenuOverlay', { static: false }) mobileMenuOverlay!: ElementRef<HTMLDivElement>;

  protected readonly isScrolled = signal(false);
  protected readonly isMobileMenuOpen = signal(false);
  
  private menuAnimation: gsap.core.Timeline | null = null;

  ngAfterViewInit(): void {
    // Prevenir scroll horizontal
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }

  /**
   * Alterna el menú móvil
   */
  toggleMobileMenu(): void {
    const newValue = !this.isMobileMenuOpen();
    this.isMobileMenuOpen.set(newValue);
    
    // Prevenir scroll del body cuando el menú está abierto
    if (newValue) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Animar el menú después de que el estado cambie
    setTimeout(() => {
      if (this.mobileMenu?.nativeElement && this.mobileMenuOverlay?.nativeElement) {
        this.animateMobileMenu(newValue);
      }
    }, 0);
  }

  /**
   * Cierra el menú móvil
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    document.body.style.overflow = '';
    
    // Animar el cierre
    setTimeout(() => {
      if (this.mobileMenu?.nativeElement && this.mobileMenuOverlay?.nativeElement) {
        this.animateMobileMenu(false);
      }
    }, 0);
  }

  /**
   * Anima el menú móvil con GSAP
   */
  private animateMobileMenu(isOpen: boolean): void {
    if (!this.mobileMenu?.nativeElement || !this.mobileMenuOverlay?.nativeElement) return;

    const menu = this.mobileMenu.nativeElement;
    const overlay = this.mobileMenuOverlay.nativeElement;
    const menuItems = menu.querySelectorAll('.mobile-menu-item');

    // Limpiar animación anterior
    if (this.menuAnimation) {
      this.menuAnimation.kill();
      this.menuAnimation = null;
    }

    if (isOpen) {
      // Habilitar pointer events inmediatamente
      gsap.set([overlay, menu], { 
        pointerEvents: 'auto',
        display: 'block'
      });
      
      // Animación de apertura
      this.menuAnimation = gsap.timeline();
      
      // Overlay fade in
      this.menuAnimation.fromTo(overlay, 
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' }
      );

      // Menú slide desde la derecha
      this.menuAnimation.fromTo(menu,
        { x: '100%', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out' },
        '-=0.15'
      );

      // Items con stagger
      this.menuAnimation.fromTo(menuItems,
        { x: 40, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.25, 
          stagger: 0.04,
          ease: 'power2.out'
        },
        '-=0.2'
      );
    } else {
      // Animación de cierre - más rápida y fluida
      this.menuAnimation = gsap.timeline({
        onComplete: () => {
          gsap.set([overlay, menu], { 
            pointerEvents: 'none',
            display: 'none'
          });
        }
      });

      // Todo se cierra simultáneamente para mayor fluidez
      this.menuAnimation.to(menuItems,
        { 
          x: 20, 
          opacity: 0, 
          duration: 0.15, 
          stagger: 0.02,
          ease: 'power2.in'
        },
        0
      );

      this.menuAnimation.to(menu,
        { x: '100%', opacity: 0, duration: 0.25, ease: 'power2.in' },
        0
      );

      this.menuAnimation.to(overlay,
        { opacity: 0, duration: 0.2, ease: 'power2.in' },
        0
      );
    }
  }

  /**
   * Scroll suave a una sección
   */
  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      this.closeMobileMenu();
    }
  }

  /**
   * Scroll suave hacia la sección de contacto
   */
  scrollToContact(): void {
    this.scrollToSection('contact');
  }

  ngOnDestroy(): void {
    // Limpiar animación del menú si existe
    if (this.menuAnimation) {
      this.menuAnimation.kill();
    }
  }
}
