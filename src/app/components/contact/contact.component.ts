import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../../services/email.service';

/**
 * Interfaz para el formulario de contacto
 */
interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

/**
 * Componente Contact - Formulario de contacto
 * Principio de Responsabilidad Única: Solo maneja el formulario de contacto
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  protected readonly form = signal<ContactForm>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  protected readonly isSubmitting = signal(false);
  protected readonly isSubmitted = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  constructor(private emailService: EmailService) {}

  /**
   * Maneja el envío del formulario
   */
  async onSubmit(): Promise<void> {
    if (this.isSubmitting()) return;

    // Validación básica
    const currentForm = this.form();
    if (!currentForm.name || !currentForm.email || !currentForm.message) {
      this.errorMessage.set('Por favor completa todos los campos requeridos');
      setTimeout(() => this.errorMessage.set(null), 5000);
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentForm.email)) {
      this.errorMessage.set('Por favor ingresa un email válido');
      setTimeout(() => this.errorMessage.set(null), 5000);
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    try {
      await this.emailService.sendContactEmail(currentForm);
      
      // Éxito
      this.isSubmitting.set(false);
      this.isSubmitted.set(true);
      
      // Resetear formulario después de 3 segundos
      setTimeout(() => {
        this.form.set({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: ''
        });
        this.isSubmitted.set(false);
      }, 3000);
    } catch (error) {
      // Error
      console.error('Error al enviar el formulario:', error);
      this.isSubmitting.set(false);
      this.errorMessage.set(
        error instanceof Error 
          ? error.message 
          : 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente o contáctanos directamente.'
      );
    }
  }

  /**
   * Actualiza un campo del formulario
   */
  updateField<K extends keyof ContactForm>(field: K, value: ContactForm[K]): void {
    this.form.update(current => ({ ...current, [field]: value }));
  }
}
