import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interfaz para las normativas
 */
interface Regulation {
  name: string;
  description: string;
  icon: string;
  href?: string;
}

/**
 * Componente Compliance - Cumplimiento Normativo
 * Principio de Responsabilidad Única: Solo muestra información de cumplimiento
 */
@Component({
  selector: 'app-compliance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compliance.component.html',
  styleUrl: './compliance.component.css'
})
export class ComplianceComponent {
  protected readonly regulations = signal<Regulation[]>([
    {
      name: 'PESV',
      description: 'Plan Estratégico de Seguridad Vial - Implementación completa y certificación',
      icon: 'document',
      href: 'https://normativa.colpensiones.gov.co/compilacion/docs/decreto_1609_2002.htm?utm_source=chatgpt.com'
    },
    {
      name: 'Ley 769 de 2002',
      description: 'Código Nacional de Tránsito - Cumplimiento total de normativas de tránsito',
      icon: 'law',
      href: 'https://www.runt.gov.co/sites/default/files/normas/Ley_769_2002.pdf?utm_source=chatgpt.com'
    },
    {
      name: 'Resolución 1565 de 2014',
      description: 'Normativa de seguridad vial para transporte de carga - Adherencia estricta',
      icon: 'shield',
      href: 'https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/pdf/resolucion_mintransporte_1565_2014.pdf?utm_source=chatgpt.com'
    },
    {
      name: 'Decreto 1609 de 2002',
      description: 'Reglamento para el transporte de mercancías peligrosas - Protocolos especializados',
      icon: 'warning',
      href: 'https://normativa.colpensiones.gov.co/compilacion/docs/decreto_1609_2002.htm?utm_source=chatgpt.com'
    },
    {
      name: 'Decreto 1072 de 2015',
      description: 'Decreto Único Reglamentario del Sector Trabajo - Cumplimiento normativo laboral',
      icon: 'document',
      href: 'https://www.reincorporacion.gov.co/es/agencia/Documentos%20Normatividad%20Complementaria/Decreto%201072%20de%202015.pdf?utm_source=chatgpt.com'
    }
  ]);

  protected readonly certifications = signal([
    'Personal certificado en seguridad vial',
    'Técnicos especializados en escoltas operativos',
    'Cobertura nacional en puertos y zonas francas',
    'Trazabilidad total de operaciones'
  ]);
}
