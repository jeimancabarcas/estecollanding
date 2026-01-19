import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interfaz para los servicios especializados
 */
interface Service {
  icon: string;
  title: string;
  description: string;
  colorClass: string;
  iconColorClass: string;
  borderColorClass: string;
  image?: string;
}

/**
 * Componente Features - Muestra los servicios especializados de ESTECOL
 * Principio de Responsabilidad Única: Solo muestra servicios
 */
@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css'
})
export class FeaturesComponent {
  protected readonly services = signal<Service[]>([
    {
      icon: 'truck',
      title: 'Carga Extradimensionada',
      description: 'Manejo especializado de pesos y medidas que superan lo legal, con rutas especiales y gestión de permisos',
      colorClass: 'blue',
      iconColorClass: 'text-gray-400',
      borderColorClass: 'hover:border-gray-200',
      image: '/images/8c36488b-487f-4f22-91f0-4ff992dfb1cd.jpg'
    },
    {
      icon: 'warning',
      title: 'Cargas Peligrosas',
      description: 'Transporte bajo normativas estrictas (Decreto 1609 de 2002) con protocolos de seguridad especializados',
      colorClass: 'red',
      iconColorClass: 'text-gray-400',
      borderColorClass: 'hover:border-gray-200',
      image: '/images/a2fec391-3477-464e-b320-98e1c20f262f.jpg'
    },
    {
      icon: 'medical',
      title: 'Acompañamiento Médico',
      description: 'Servicio especializado para operaciones críticas y control psicofísico del conductor',
      colorClass: 'green',
      iconColorClass: 'text-gray-400',
      borderColorClass: 'hover:border-gray-200',
      image: '/images/a96b8fa7-56cf-4344-95b7-ca3fc339b7e0.jpg'
    },
    {
      icon: 'route',
      title: 'Gestión de Rutas y Logística',
      description: 'Análisis detallado de trayectos y coordinación integral para operaciones seguras',
      colorClass: 'purple',
      iconColorClass: 'text-gray-400',
      borderColorClass: 'hover:border-gray-200',
      image: '/images/bfd4ac6b-7ccd-4568-8614-e2392879a190.jpg'
    },
    {
      icon: 'monitor',
      title: 'Monitoreo Tecnológico',
      description: 'Tecnología avanzada para monitoreo constante y trazabilidad total de operaciones',
      colorClass: 'indigo',
      iconColorClass: 'text-gray-400',
      borderColorClass: 'hover:border-gray-200',
      image: '/images/c073dd70-07c3-4c39-b3cf-40b4c7d3d8e9.jpg'
    },
    {
      icon: 'certificate',
      title: 'Personal Certificado',
      description: 'Técnicos en seguridad vial y escoltas operativos altamente capacitados y certificados',
      colorClass: 'orange',
      iconColorClass: 'text-gray-400',
      borderColorClass: 'hover:border-gray-200',
      image: '/images/c6023aa3-0cba-4a3f-9abd-820fce1f781b.jpg'
    }
  ]);
}
