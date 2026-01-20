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

  ngAfterViewInit(): void {
    // Prevenir scroll horizontal
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    // Solo actualizar el estado de scroll, no cerrar el menú
    // Si el menú está abierto, no hacer nada con el scroll
    if (this.isMobileMenuOpen()) {
      return;
    }
    this.isScrolled.set(window.scrollY > 50);
  }
  

  /**
   * Alterna el menú móvil
   */
  toggleMobileMenu(): void {
    const newValue = !this.isMobileMenuOpen();
    this.isMobileMenuOpen.set(newValue);

    // Animar el menú después de que el estado cambie
    setTimeout(() => {
      if (this.mobileMenu?.nativeElement) {
        this.animateMobileMenu(newValue);
      }
    }, 0);
  }

  /**
   * Cierra el menú móvil
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    
    // Animar el cierre
    setTimeout(() => {
      if (this.mobileMenu?.nativeElement) {
        this.animateMobileMenu(false);
      }
    }, 0);
  }

  /**
   * Muestra/oculta el menú móvil sidebar sin animaciones
   */
  private animateMobileMenu(isOpen: boolean): void {
    if (!this.mobileMenu?.nativeElement) return;

    const menu = this.mobileMenu.nativeElement;
    const overlay = this.mobileMenuOverlay?.nativeElement;

    if (isOpen) {
      // Guardar la posición de scroll actual antes de bloquear
      const scrollY = window.scrollY;
      
      // Bloquear scroll del body cuando el menú está abierto, manteniendo overflow-x hidden
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflowY = 'hidden';
      document.body.style.overflowX = 'hidden';
      document.body.style.width = '100%';
      
      // Mover el menú y overlay al body para que tengan su propio contexto de apilamiento
      if (menu.parentElement !== document.body) {
        document.body.appendChild(menu);
      }
      if (overlay && overlay.parentElement !== document.body) {
        document.body.appendChild(overlay);
      }
      
      // Asegurar z-index muy alto para estar por encima de todo
      menu.style.setProperty('z-index', '999999', 'important');
      menu.style.setProperty('position', 'fixed', 'important');
      menu.style.setProperty('top', '0');
      menu.style.setProperty('right', '0');
      menu.style.setProperty('left', 'auto');
      menu.style.setProperty('bottom', 'auto');
      menu.style.setProperty('transform', 'translateX(0)', 'important');
      menu.style.setProperty('display', 'block', 'important');
      menu.style.setProperty('pointer-events', 'auto', 'important');
      menu.style.setProperty('overflow-x', 'hidden', 'important');
      menu.style.setProperty('max-width', '100vw', 'important');
      
      if (overlay) {
        overlay.style.setProperty('z-index', '999998', 'important');
        overlay.style.setProperty('position', 'fixed', 'important');
        overlay.style.setProperty('top', '0');
        overlay.style.setProperty('right', '0');
        overlay.style.setProperty('left', '0');
        overlay.style.setProperty('bottom', '0');
        overlay.style.setProperty('display', 'block', 'important');
        overlay.style.setProperty('pointer-events', 'auto', 'important');
        overlay.style.setProperty('opacity', '1', 'important');
        overlay.style.setProperty('overflow-x', 'hidden', 'important');
        overlay.style.setProperty('max-width', '100vw', 'important');
      }
    } else {
      // Restaurar scroll del body cuando el menú se cierra
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflowY = '';
      document.body.style.overflowX = 'hidden';
      document.body.style.width = '';
      
      // Restaurar la posición de scroll
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
      
      // Ocultar instantáneamente
      menu.style.setProperty('display', 'none', 'important');
      menu.style.setProperty('pointer-events', 'none', 'important');
      menu.style.setProperty('transform', 'translateX(100%)', 'important');
      
      if (overlay) {
        overlay.style.setProperty('display', 'none', 'important');
        overlay.style.setProperty('pointer-events', 'none', 'important');
        overlay.style.setProperty('opacity', '0', 'important');
      }
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
    // Limpiar elementos del DOM si fueron movidos al body
    if (this.mobileMenu?.nativeElement && this.mobileMenu.nativeElement.parentElement === document.body) {
      document.body.removeChild(this.mobileMenu.nativeElement);
    }
    if (this.mobileMenuOverlay?.nativeElement && this.mobileMenuOverlay.nativeElement.parentElement === document.body) {
      document.body.removeChild(this.mobileMenuOverlay.nativeElement);
    }
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
  }
}
