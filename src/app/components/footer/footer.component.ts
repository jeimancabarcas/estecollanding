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
        { title: 'Carga Extradimensionada', href: '#features' },
        { title: 'Cargas críticas', href: '#features' },
        { title: 'Asistencia Técnico en Salud', href: '#features' },
        { title: 'Gestión de Rutas', href: '#features' }
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
        { title: 'PESV', href: 'https://normativa.colpensiones.gov.co/compilacion/docs/decreto_1609_2002.htm?utm_source=chatgpt.com' },
        { title: 'Ley 769 de 2002', href: 'https://www.runt.gov.co/sites/default/files/normas/Ley_769_2002.pdf?utm_source=chatgpt.com' },
        { title: 'Resolución 1565', href: 'https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/pdf/resolucion_mintransporte_1565_2014.pdf?utm_source=chatgpt.com' },
        { title: 'Decreto 1609', href: 'https://normativa.colpensiones.gov.co/compilacion/docs/decreto_1609_2002.htm?utm_source=chatgpt.com' },
        { title: 'Decreto 1072 de 2015', href: 'https://www.reincorporacion.gov.co/es/agencia/Documentos%20Normatividad%20Complementaria/Decreto%201072%20de%202015.pdf?utm_source=chatgpt.com' }
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
