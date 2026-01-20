import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente WhatsApp Button - Botón flotante de WhatsApp
 * Principio de Responsabilidad Única: Solo maneja la interacción con WhatsApp
 */
@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsapp-button.component.html',
  styleUrl: './whatsapp-button.component.css'
})
export class WhatsAppButtonComponent {
  // Número de WhatsApp (formato internacional sin +)
  // Ejemplo: 573001234567 para Colombia
  protected readonly whatsappNumber = '573001234567';
  
  // Mensaje predeterminado
  protected readonly defaultMessage = 'Hola, me interesa conocer más sobre los servicios de ESTECOL.';

  /**
   * Abre WhatsApp con el número y mensaje configurados
   */
  openWhatsApp(): void {
    const encodedMessage = encodeURIComponent(this.defaultMessage);
    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }
}
