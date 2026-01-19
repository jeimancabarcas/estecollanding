import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente Hero - Sección principal de la landing page
 * Principio de Responsabilidad Única: Solo maneja la presentación del hero
 */
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  protected readonly title = signal('ESTECOL LTDA');
  protected readonly subtitle = signal('Escoltas y Técnicos de Colombia');
  protected readonly tagline = signal('Más de 12 años protegiendo cargas especiales en las carreteras de Colombia');

  /**
   * Scroll suave hacia la sección de servicios
   */
  scrollToServices(): void {
    const servicesSection = document.getElementById('services');
    servicesSection?.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Scroll suave hacia la sección de contacto
   */
  scrollToContact(): void {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  }
}
