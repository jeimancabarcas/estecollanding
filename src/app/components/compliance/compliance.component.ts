import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interfaz para las normativas
 */
interface Regulation {
  name: string;
  description: string;
  icon: string;
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
      icon: 'document'
    },
    {
      name: 'Ley 769 de 2002',
      description: 'Código Nacional de Tránsito - Cumplimiento total de normativas de tránsito',
      icon: 'law'
    },
    {
      name: 'Resolución 1565 de 2014',
      description: 'Normativa de seguridad vial para transporte de carga - Adherencia estricta',
      icon: 'shield'
    },
    {
      name: 'Decreto 1609 de 2002',
      description: 'Reglamento para el transporte de mercancías peligrosas - Protocolos especializados',
      icon: 'warning'
    }
  ]);

  protected readonly certifications = signal([
    'Personal certificado en seguridad vial',
    'Técnicos especializados en escoltas operativos',
    'Cobertura nacional en puertos y zonas francas',
    'Trazabilidad total de operaciones'
  ]);
}
