import { Component, signal, HostListener, OnDestroy } from '@angular/core';
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
  modalContent?: {
    description: string;
    normative: string[];
    value: string[];
  };
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
export class FeaturesComponent implements OnDestroy {
  protected readonly selectedService = signal<Service | null>(null);
  protected readonly services = signal<Service[]>([
    {
      icon: 'truck',
      title: 'Cargas Extradimensionadas',
      description: 'Manejo especializado de pesos y medidas que superan lo legal, con rutas especiales y gestión de permisos',
      colorClass: 'blue',
      iconColorClass: 'text-gray-400',
      borderColorClass: 'hover:border-gray-200',
      image: '/images/8c36488b-487f-4f22-91f0-4ff992dfb1cd.jpg',
      modalContent: {
        description: 'ESTECOL brinda acompañamiento vial especializado para el transporte de cargas extradimensionadas y extrapesadas, garantizando seguridad, control operativo y cumplimiento normativo durante toda la ruta. Nuestro servicio contempla análisis previo del trayecto, coordinación con autoridades, escoltas viales certificadas y control permanente de riesgos asociados a dimensiones, peso y maniobrabilidad de la carga.',
        normative: [
          'Resolución 4100 de 2004 – MinTransporte',
          'Resolución 4959 de 2006',
          'Manual de Señalización Vial',
          'Lineamientos del PESV'
        ],
        value: [
          'Reducción de incidentes en vía',
          'Cumplimiento de permisos y condiciones técnicas',
          'Protección de la infraestructura vial y terceros',
          'Operaciones coordinadas, seguras y trazables'
        ]
      }
    },
    {
      icon: 'warning',
      title: 'Cargas de Sustancias Críticas',
      description: 'Transporte bajo normativas estrictas (Decreto 1609 de 2002) con protocolos de seguridad especializados',
      colorClass: 'red',
      iconColorClass: 'text-gray-400',
      borderColorClass: 'hover:border-gray-200',
      image: '/images/a2fec391-3477-464e-b320-98e1c20f262f.jpg',
      modalContent: {
        description: 'Acompañamiento especializado para el transporte de sustancias peligrosas, químicas, inflamables, tóxicas o de alto riesgo, asegurando el control del factor humano, el entorno y la carga. Incluye escoltas viales capacitadas, monitoreo constante y protocolos de reacción ante incidentes.',
        normative: [
          'Decreto 1609 de 2002',
          'Resolución 1223 de 2014',
          'NTC 1692',
          'PESV – Resolución 40595 de 2022'
        ],
        value: [
          'Prevención de emergencias mayores',
          'Control estricto del riesgo operativo',
          'Cumplimiento normativo demostrable',
          'Mayor confianza ante autoridades y aseguradoras'
        ]
      }
    },
    {
      icon: 'medical',
      title: 'Acompañamiento Médico Técnico',
      description: 'Servicio especializado para operaciones críticas y control psicofísico del conductor',
      colorClass: 'green',
      iconColorClass: 'text-gray-400',
      borderColorClass: 'hover:border-gray-200',
      image: '/images/a96b8fa7-56cf-4344-95b7-ca3fc339b7e0.jpg',
      modalContent: {
        description: 'ESTECOL integra un acompañante médico técnico para verificar y controlar la aptitud física y mental del conductor antes y durante la operación. Este servicio incluye pruebas de sustancias psicoactivas, evaluación de signos vitales y seguimiento preventivo en rutas críticas.',
        normative: [
          'PESV – Resolución 40595 de 2022',
          'Decreto 1609 de 2002',
          'Lineamientos de seguridad para transporte de material peligroso y explosivo'
        ],
        value: [
          'Reducción de riesgos por fatiga o consumo de SPA',
          'Protección de la carga y del conductor',
          'Soporte documental para auditorías',
          'Servicio diferencial en el sector'
        ]
      }
    },
    {
      icon: 'route',
      title: 'Gestión de Ruta Logística',
      description: 'Análisis detallado de trayectos y coordinación integral para operaciones seguras',
      colorClass: 'purple',
      iconColorClass: 'text-gray-400',
      borderColorClass: 'hover:border-gray-200',
      image: '/images/bfd4ac6b-7ccd-4568-8614-e2392879a190.jpg',
      modalContent: {
        description: 'Planeación, análisis y control integral de rutas logísticas, enfocada en seguridad, eficiencia y cumplimiento normativo. Incluye identificación de puntos críticos, rutas alternas, evaluación de riesgos y coordinación operativa antes, durante y después del viaje.',
        normative: [
          'PESV – Gestión del riesgo vial',
          'Manual de Seguridad Vial',
          'Lineamientos del Ministerio de Transporte'
        ],
        value: [
          'Optimización de tiempos y recursos',
          'Menor exposición al riesgo',
          'Operaciones más predecibles',
          'Mejora continua de la logística del cliente'
        ]
      }
    },
    {
      icon: 'monitor',
      title: 'Monitoreo Técnológico y Personal Certificado',
      description: 'Tecnología avanzada para monitoreo constante y trazabilidad total de operaciones',
      colorClass: 'indigo',
      iconColorClass: 'text-gray-400',
      borderColorClass: 'hover:border-gray-200',
      image: '/images/c073dd70-07c3-4c39-b3cf-40b4c7d3d8e9.jpg',
      modalContent: {
        description: 'Monitoreo permanente de la operación mediante tecnología y personal certificado, garantizando trazabilidad, control y reacción inmediata ante cualquier novedad. Se integra seguimiento en tiempo real, comunicación constante y reportes operativos.',
        normative: [
          'PESV – Control y seguimiento de operaciones',
          'Buenas prácticas en gestión de riesgos',
          'Requisitos de trazabilidad operativa'
        ],
        value: [
          'Visibilidad total de la operación',
          'Respuesta oportuna ante incidentes',
          'Personal entrenado y certificado',
          'Mayor control y transparencia para el cliente'
        ]
      }
    },
  ]);

  /**
   * Abre el modal con los detalles del servicio
   */
  openServiceModal(service: Service): void {
    if (service.modalContent) {
      this.selectedService.set(service);
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Cierra el modal
   */
  closeServiceModal(): void {
    this.selectedService.set(null);
    document.body.style.overflow = '';
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.selectedService()) return;
    
    if (event.key === 'Escape') {
      this.closeServiceModal();
    }
  }

  ngOnDestroy(): void {
    // Asegurar que el overflow se restaure al destruir el componente
    document.body.style.overflow = '';
  }
}
