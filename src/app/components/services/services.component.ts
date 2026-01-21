import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interfaz para los servicios ofrecidos
 */
interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  image?: string;
  modalContent?: {
    description: string;
    normative: string[];
    value: string[];
  };
}

/**
 * Componente Services - Muestra los servicios de ESTECOL
 * Principio de Responsabilidad Única: Solo muestra servicios
 */
@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  protected readonly services = signal<Service[]>([
    {
      id: 'extradimensionada',
      title: 'Carga Extradimensionada',
      description: 'Manejo especializado de cargas que superan las dimensiones y pesos legales',
      features: [
        'Rutas especiales diseñadas',
        'Gestión de permisos y autorizaciones',
        'Escoltas especializados',
        'Monitoreo GPS en tiempo real',
        'Coordinación con autoridades'
      ],
      icon: 'truck',
      image: '/servicios/cargas_extradimensionadas.jpeg',
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
      id: 'peligrosas',
      title: 'Cargas críticas',
      description: 'Transporte seguro bajo normativa Decreto 1609 de 2002',
      features: [
        'Cumplimiento normativo estricto',
        'Protocolos de seguridad especializados',
        'Personal certificado ADR',
        'Equipos de emergencia',
        'Documentación completa'
      ],
      icon: 'warning',
      image: '/servicios/sustancias_criticas.jpeg',
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
      id: 'medico',
      title: 'Asistencia Técnico en Salud',
      description: 'Servicio especializado para operaciones críticas',
      features: [
        'Control psicofísico del conductor',
        'Atención médica en ruta',
        'Personal médico certificado',
        'Equipos médicos especializados',
        'Soporte 24/7'
      ],
      icon: 'medical',
      image: '/servicios/asistencia_medica.jpeg',
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
      id: 'logistica',
      title: 'Gestión de Rutas y Logística',
      description: 'Análisis y coordinación integral de trayectos',
      features: [
        'Análisis detallado de rutas',
        'Identificación de riesgos',
        'Optimización de trayectos',
        'Coordinación logística',
        'Trazabilidad total'
      ],
      icon: 'route',
      image: '/servicios/gestion_de_rutas_logisticas.jpeg',
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
      id: 'monitoreo',
      title: 'Monitoreo Tecnológico y Personal Certificado',
      description: 'Monitoreo permanente con tecnología y personal certificado',
      features: [
        'Monitoreo en tiempo real',
        'Personal certificado y entrenado',
        'Trazabilidad completa',
        'Comunicación constante',
        'Reportes operativos'
      ],
      icon: 'monitor',
      image: '/servicios/monitoreo_tecnologico.jpeg',
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
    }
  ]);

  protected readonly selectedService = signal<string | null>(null);

  /**
   * Selecciona un servicio para ver más detalles
   */
  selectService(serviceId: string): void {
    this.selectedService.set(
      this.selectedService() === serviceId ? null : serviceId
    );
  }

  /**
   * Scroll suave hacia la sección de contacto
   */
  scrollToContact(): void {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  }
}
