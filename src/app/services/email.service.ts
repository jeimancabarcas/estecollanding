import { Injectable } from '@angular/core';

/**
 * Interfaz para los datos del formulario de contacto
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

/**
 * Servicio Email - Maneja el envío de correos electrónicos usando Web3Forms
 * Principio de Responsabilidad Única: Solo maneja el envío de correos
 * 
 * Web3Forms es completamente GRATIS e ILIMITADO:
 * - Requiere API key (gratis en https://web3forms.com/)
 * - Sin límites de envíos
 * - Muy confiable y rápido
 * 
 * CONFIGURACIÓN:
 * La API key y el email de destino (admin@estecol.com) ya están configurados.
 */
@Injectable({
  providedIn: 'root'
})
export class EmailService {
  // API Key de Web3Forms (gratis e ilimitado)
  private readonly WEB3FORMS_API_KEY = '19455502-9da1-4571-9b7b-abf455984bfe';
  
  // Email de destino donde se recibirán los correos
  private readonly TO_EMAIL = 'admin@estecol.com';
  
  // URL de Web3Forms
  private readonly WEB3FORMS_URL = 'https://api.web3forms.com/submit';

  /**
   * Envía un correo electrónico con los datos del formulario de contacto usando Web3Forms
   * @param formData Datos del formulario de contacto
   * @returns Promise que se resuelve cuando el correo se envía exitosamente
   */
  async sendContactEmail(formData: ContactFormData): Promise<void> {
    try {
      const emailBody = this.formatEmailBody(formData);
      
      const response = await fetch(this.WEB3FORMS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: this.WEB3FORMS_API_KEY,
          subject: `Nuevo contacto desde la web - ${formData.company || formData.name}`,
          from_name: formData.name,
          email: formData.email,
          to: this.TO_EMAIL,
          message: emailBody,
          phone: formData.phone || 'No proporcionado',
          company: formData.company || 'No proporcionado'
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error al enviar el correo');
      }
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('No se pudo enviar el correo. Por favor, intenta nuevamente.');
    }
  }

  /**
   * Formatea el cuerpo del email con todos los datos del formulario
   */
  private formatEmailBody(formData: ContactFormData): string {
    return `
Nuevo mensaje de contacto desde la web

Nombre: ${formData.name}
Email: ${formData.email}
Teléfono: ${formData.phone || 'No proporcionado'}
Empresa: ${formData.company || 'No proporcionado'}

Mensaje:
${formData.message}
    `.trim();
  }
}
