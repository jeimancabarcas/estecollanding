import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    if (this.isSubmitting()) return;

    // Validación básica
    const currentForm = this.form();
    if (!currentForm.name || !currentForm.email || !currentForm.message) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    this.isSubmitting.set(true);

    // Simulación de envío (en producción sería una llamada HTTP)
    setTimeout(() => {
      console.log('Formulario enviado:', currentForm);
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
    }, 1000);
  }

  /**
   * Actualiza un campo del formulario
   */
  updateField<K extends keyof ContactForm>(field: K, value: ContactForm[K]): void {
    this.form.update(current => ({ ...current, [field]: value }));
  }
}
