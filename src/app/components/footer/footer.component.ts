import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interfaz para los enlaces del footer
 */
interface FooterLink {
  title: string;
  href: string;
}

/**
 * Interfaz para las secciones del footer
 */
interface FooterSection {
  title: string;
  links: FooterLink[];
}

/**
 * Componente Footer - Pie de página
 * Principio de Responsabilidad Única: Solo muestra el footer
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  protected readonly currentYear = signal(new Date().getFullYear());
  
  protected readonly footerSections = signal<FooterSection[]>([
    {
      title: 'Servicios',
      links: [
        { title: 'Carga Extradimensionada', href: '#services' },
        { title: 'Cargas Peligrosas', href: '#services' },
        { title: 'Acompañamiento Médico', href: '#services' },
        { title: 'Gestión de Rutas', href: '#services' }
      ]
    },
    {
      title: 'Empresa',
      links: [
        { title: 'Quiénes Somos', href: '#about' },
        { title: 'Misión y Visión', href: '#about' },
        { title: 'Valores', href: '#about' },
        { title: 'Modelo Operativo', href: '#operational-model' }
      ]
    },
    {
      title: 'Cumplimiento',
      links: [
        { title: 'PESV', href: '#compliance' },
        { title: 'Ley 769 de 2002', href: '#compliance' },
        { title: 'Resolución 1565', href: '#compliance' },
        { title: 'Decreto 1609', href: '#compliance' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { title: 'Política de Privacidad', href: '#privacy' },
        { title: 'Términos de Servicio', href: '#terms' },
        { title: 'Cookies', href: '#cookies' },
        { title: 'Aviso Legal', href: '#legal' }
      ]
    }
  ]);

  protected readonly socialLinks = signal([
    { name: 'Facebook', icon: 'facebook', href: '#' },
    { name: 'Twitter', icon: 'twitter', href: '#' },
    { name: 'LinkedIn', icon: 'linkedin', href: '#' },
    { name: 'Instagram', icon: 'instagram', href: '#' }
  ]);
}
