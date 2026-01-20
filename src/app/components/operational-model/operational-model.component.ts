import { Component, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interfaz para los pilares del modelo operativo
 */
interface Pillar {
  number: string;
  title: string;
  description: string;
  image?: string;
}

/**
 * Componente OperationalModel - Modelo OP de ESTECOL
 * Principio de Responsabilidad Única: Solo muestra el modelo operativo
 */
@Component({
  selector: 'app-operational-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './operational-model.component.html',
  styleUrl: './operational-model.component.css'
})
export class OperationalModelComponent implements AfterViewInit, OnDestroy {
  private elfsightScriptLoaded = false;
  protected readonly pillars = signal<Pillar[]>([
    {
      number: '01',
      title: 'Planificación de Ruta',
      description: 'Análisis detallado del trayecto, identificación de riesgos y diseño de estrategias de seguridad personalizadas',
      image: '/images/d6adb5b0-8915-4d73-a0e3-d83857c98073.jpg'
    },
    {
      number: '02',
      title: 'Verificación de Condiciones',
      description: 'Inspección exhaustiva de vehículos, cargas y documentación antes del inicio de la operación',
      image: '/images/dc3558e0-ad27-4d55-a8cd-a14316459896.jpg'
    },
    {
      number: '03',
      title: 'Acompañamiento en Tiempo Real',
      description: 'Monitoreo continuo durante todo el trayecto con comunicación constante y respuesta inmediata',
      image: '/images/e32f2994-af97-4be2-88c0-3b30564746cc.jpg'
    },
    {
      number: '04',
      title: 'Informes de Operación',
      description: 'Documentación completa y detallada de cada operación para trazabilidad y mejora continua',
      image: '/images/edb2803d-3618-4c2c-b850-f919b5eed660.jpg'
    },
    {
      number: '05',
      title: 'Retroalimentación',
      description: 'Análisis post-operación para identificar oportunidades de mejora y optimización de procesos',
      image: '/images/8e5555f6-f3d3-4cf5-bd0e-24683651ec38.jpg'
    }
  ]);

  protected readonly availability = signal({
    title: 'Disponibilidad 24/7',
    services: [
      'Cargue',
      'Tránsito',
      'Descargue',
      'Retorno'
    ]
  });

  ngAfterViewInit(): void {
    // Cargar el script de Elfsight si no está cargado
    if (!this.elfsightScriptLoaded && !document.querySelector('script[src*="elfsightcdn.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      document.head.appendChild(script);
      this.elfsightScriptLoaded = true;
    }
  }

  ngOnDestroy(): void {
    // El script se mantiene en el head para que funcione en toda la aplicación
  }
}
