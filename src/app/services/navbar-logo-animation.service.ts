import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { gsap } from 'gsap';

/**
 * Servicio para animar el logo del navbar con Three.js y GSAP
 * Principio de Responsabilidad Única: Solo maneja la animación del logo del navbar
 */
@Injectable({
  providedIn: 'root'
})
export class NavbarLogoAnimationService {
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private animationId: number | null = null;
  private logoMesh: THREE.Mesh | null = null;
  private logoTexture: THREE.Texture | null = null;
  private logoGroup: THREE.Group | null = null;
  private mouse = new THREE.Vector2();
  private targetRotation = new THREE.Vector2();
  private currentRotation = new THREE.Vector2();
  private time = 0;
  private isHovered = false;

  /**
   * Inicializa la animación del logo
   */
  initializeAnimation(container: HTMLElement, logoElement: HTMLElement): void {
    if (this.scene) {
      this.cleanup();
    }

    // Obtener dimensiones del logo original
    const rect = logoElement.getBoundingClientRect();
    const width = rect.width || 120;
    const height = rect.height || 48;

    // Crear escena
    this.scene = new THREE.Scene();
    this.scene.background = null;

    // Crear cámara
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    // Crear renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(this.renderer.domElement);

    // Ocultar imagen original
    gsap.set(logoElement, { opacity: 0 });

    // Cargar logo y crear geometría
    this.loadLogo().then(() => {
      this.createLogoGeometry();
      
      // Animación de entrada con GSAP
      this.animateEntry();
      
      // Event listeners
      this.setupEventListeners(container);
      
      // Iniciar loop de animación
      this.animate();
    });
  }

  /**
   * Carga el logo como textura
   */
  private loadLogo(): Promise<void> {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        '/logo.png',
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          this.logoTexture = texture;
          resolve();
        },
        undefined,
        (error) => {
          console.warn('Error cargando logo:', error);
          resolve();
        }
      );
    });
  }

  /**
   * Crea la geometría del logo
   */
  private createLogoGeometry(): void {
    if (!this.scene || !this.logoTexture || !this.logoTexture.image) return;

    this.logoGroup = new THREE.Group();
    this.scene.add(this.logoGroup);

    // Calcular relación de aspecto
    const image = this.logoTexture.image as HTMLImageElement;
    const logoAspect = image.width / image.height;
    const logoWidth = 3;
    const logoHeight = logoWidth / logoAspect;

    // Crear plano con el logo
    const logoGeometry = new THREE.PlaneGeometry(logoWidth, logoHeight);
    const logoMaterial = new THREE.MeshBasicMaterial({
      map: this.logoTexture,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      alphaTest: 0.1,
      depthWrite: false
    });

    this.logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
    this.logoGroup.add(this.logoMesh);
  }

  /**
   * Animación de entrada con GSAP
   */
  private animateEntry(): void {
    if (!this.logoMesh || !this.logoGroup) return;

    const logoMaterial = this.logoMesh.material as THREE.MeshBasicMaterial;
    
    // Inicializar en escala pequeña y rotado
    this.logoGroup.scale.set(0.5, 0.5, 1);
    this.logoGroup.rotation.y = -0.3;
    logoMaterial.opacity = 0;

    // Animación de entrada
    gsap.to(this.logoGroup.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
      ease: 'back.out(1.7)'
    });

    gsap.to(this.logoGroup.rotation, {
      y: 0,
      duration: 1,
      ease: 'power2.out'
    });

    gsap.to(logoMaterial, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    });
  }

  /**
   * Configura event listeners
   */
  private setupEventListeners(container: HTMLElement): void {
    container.addEventListener('mouseenter', () => {
      this.isHovered = true;
      this.onHoverEnter();
    });

    container.addEventListener('mouseleave', () => {
      this.isHovered = false;
      this.onHoverLeave();
    });

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });
  }

  /**
   * Efecto hover enter
   */
  private onHoverEnter(): void {
    // El efecto de corazón ya está activo, no necesitamos hacer nada adicional
  }

  /**
   * Efecto hover leave
   */
  private onHoverLeave(): void {
    if (!this.logoGroup) return;

    // Solo resetear la rotación, el pulso continúa
    gsap.to(this.logoGroup.rotation, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  /**
   * Loop de animación
   */
  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    if (!this.scene || !this.camera || !this.renderer || !this.logoGroup || !this.logoMesh) return;

    this.time += 0.01;

    // Efecto de corazón (pulso rítmico)
    const heartbeat = Math.abs(Math.sin(this.time * 2.5)) * 0.1 + 1;
    
    // Aplicar pulso al logo
    this.logoMesh.scale.set(heartbeat, heartbeat, 1);

    // Rotación suave basada en mouse (solo en hover)
    if (this.isHovered) {
      this.targetRotation.x = this.mouse.y * 0.15;
      this.targetRotation.y = this.mouse.x * 0.15;
    } else {
      this.targetRotation.x = 0;
      this.targetRotation.y = 0;
    }

    // Interpolación suave de rotación
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.1;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.1;

    if (this.logoGroup) {
      this.logoGroup.rotation.x = this.currentRotation.x;
      this.logoGroup.rotation.y = this.currentRotation.y;
    }

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Maneja el resize
   */
  handleResize(logoElement: HTMLElement): void {
    if (!this.camera || !this.renderer) return;

    const rect = logoElement.getBoundingClientRect();
    const width = rect.width || 120;
    const height = rect.height || 48;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Limpia recursos
   */
  cleanup(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.renderer && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }

    if (this.logoMesh) {
      this.logoMesh.geometry.dispose();
      if (this.logoMesh.material instanceof THREE.Material) {
        this.logoMesh.material.dispose();
      }
    }

    if (this.logoTexture) {
      this.logoTexture.dispose();
    }

    if (this.logoGroup) {
      this.logoGroup.clear();
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.logoMesh = null;
    this.logoTexture = null;
    this.logoGroup = null;
  }
}
