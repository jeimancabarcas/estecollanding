import { Component, signal, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interfaz para los valores corporativos
 */
interface Value {
  icon: string;
  title: string;
  description: string;
}

/**
 * Componente About - Información sobre ESTECOL
 * Principio de Responsabilidad Única: Solo muestra información corporativa
 */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnDestroy {
  protected selectedImage = signal<string | null>(null);
  
  protected openImage(image: string): void {
    this.selectedImage.set(image);
    document.body.style.overflow = 'hidden';
  }
  
  protected closeImage(): void {
    this.selectedImage.set(null);
    document.body.style.overflow = '';
  }
  
  protected nextImage(): void {
    const currentIndex = this.galleryImages().indexOf(this.selectedImage()!);
    if (currentIndex < this.galleryImages().length - 1) {
      this.selectedImage.set(this.galleryImages()[currentIndex + 1]);
    } else {
      this.selectedImage.set(this.galleryImages()[0]);
    }
  }
  
  protected previousImage(): void {
    const currentIndex = this.galleryImages().indexOf(this.selectedImage()!);
    if (currentIndex > 0) {
      this.selectedImage.set(this.galleryImages()[currentIndex - 1]);
    } else {
      this.selectedImage.set(this.galleryImages()[this.galleryImages().length - 1]);
    }
  }
  
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.selectedImage()) return;
    
    switch (event.key) {
      case 'Escape':
        this.closeImage();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
      case 'ArrowLeft':
        this.previousImage();
        break;
    }
  }
  
  ngOnDestroy(): void {
    // Asegurar que el overflow se restaure al destruir el componente
    document.body.style.overflow = '';
  }
  protected readonly mission = signal('Prevenir siniestros viales mediante la implementación de estrategias de seguridad vial y acompañamiento especializado, garantizando la protección de cargas especiales y la integridad de las operaciones logísticas en todo el territorio nacional.');
  
  protected readonly vision = signal('Ser la empresa líder en seguridad vial y acompañamiento de cargas especiales en Colombia para el año 2034, reconocida por nuestra excelencia operativa, innovación tecnológica y compromiso con la seguridad.');
  
  protected readonly galleryImages = signal([
    '/images/016f98b5-4f32-4781-bdf2-ca3ff7f58755.jpg',
    '/images/099f21c6-1e13-40c6-adeb-d6b5cebff87b.jpg',
    '/images/19e09550-01f3-43c7-ba9b-860866274019.jpg',
    '/images/1b17aa85-c17e-4534-90be-6f7afc416ed5.jpg',
    '/images/206b53fe-1b5f-4ba1-9116-b3706f274a55.jpg',
    '/images/22f727fb-a5cf-4b42-be32-356d605eb9c0.jpg',
    '/images/3d0e2c3e-4298-4d38-8aef-2c2b1750f9f2.jpg',
    '/images/45f9bc18-f35b-46ca-93a5-8279c61d42f8.jpg'
  ]);
  
  protected readonly values = signal<Value[]>([
    {
      icon: 'shield',
      title: 'Responsabilidad',
      description: 'Comprometidos con la seguridad y protección en cada operación'
    },
    {
      icon: 'star',
      title: 'Calidad',
      description: 'Excelencia en cada servicio que prestamos'
    },
    {
      icon: 'heart',
      title: 'Honestidad',
      description: 'Transparencia y ética en todas nuestras relaciones'
    },
    {
      icon: 'target',
      title: 'Compromiso',
      description: 'Dedicación total hacia nuestros clientes y su éxito'
    },
    {
      icon: 'users',
      title: 'Trabajo en Equipo',
      description: 'Colaboración y sinergia para alcanzar objetivos comunes'
    }
  ]);
}
