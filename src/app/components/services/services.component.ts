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
      image: '/images/4754f521-0fd8-4e37-909a-07c004dd19e3.jpg'
    },
    {
      id: 'peligrosas',
      title: 'Cargas Peligrosas',
      description: 'Transporte seguro bajo normativa Decreto 1609 de 2002',
      features: [
        'Cumplimiento normativo estricto',
        'Protocolos de seguridad especializados',
        'Personal certificado ADR',
        'Equipos de emergencia',
        'Documentación completa'
      ],
      icon: 'warning',
      image: '/images/53624248-3849-4eea-9fea-6f11db7687d6.jpg'
    },
    {
      id: 'medico',
      title: 'Acompañamiento Médico',
      description: 'Servicio especializado para operaciones críticas',
      features: [
        'Control psicofísico del conductor',
        'Atención médica en ruta',
        'Personal médico certificado',
        'Equipos médicos especializados',
        'Soporte 24/7'
      ],
      icon: 'medical',
      image: '/images/749f8913-58ab-4e90-9afc-07376bad67c9.jpg'
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
      image: '/images/798909f4-d1a7-4a88-9450-9bc502b18c5c.jpg'
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
