import { Component, OnInit, OnDestroy, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { FeaturesComponent } from './components/features/features.component';
import { ServicesComponent } from './components/services/services.component';
import { OperationalModelComponent } from './components/operational-model/operational-model.component';
import { ComplianceComponent } from './components/compliance/compliance.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { ScrollAnimationService } from './services/scroll-animation.service';

/**
 * Componente principal de la aplicación
 * Principio de Responsabilidad Única: Orquesta los componentes principales
 */
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    FeaturesComponent,
    ServicesComponent,
    OperationalModelComponent,
    ComplianceComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  constructor(private scrollAnimationService: ScrollAnimationService) {
    afterNextRender(() => {
      this.scrollAnimationService.initializeScrollAnimations();
    });
  }

  ngOnInit(): void {
    // Las animaciones se inicializan en afterNextRender
  }

  ngOnDestroy(): void {
    this.scrollAnimationService.cleanup();
  }
}
