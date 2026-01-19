import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

/**
 * Servicio para crear animación Three.js controlada por scroll en el Hero
 * Principio de Responsabilidad Única: Solo maneja la animación del hero con scroll
 */
@Injectable({
  providedIn: 'root'
})
export class HeroScrollAnimationService {
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private animationId: number | null = null;
  private particles: THREE.Points | null = null;
  private meshGroup: THREE.Group | null = null;
  private logoMesh: THREE.Mesh | null = null;
  private logoTexture: THREE.Texture | null = null;
  private scrollProgress = 0;
  private scrollTrigger: ScrollTrigger | null = null;

  /**
   * Inicializa la animación con Three.js y GSAP ScrollTrigger
   */
  initializeAnimation(container: HTMLElement, heroSection: HTMLElement): void {
    if (this.scene) {
      this.cleanup();
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Crear escena
    this.scene = new THREE.Scene();
    this.scene.background = null;

    // Crear cámara (ajustada para navbar más pequeño)
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 3;
    this.camera.position.y = 0.2; // Ligeramente arriba para centrar en navbar

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
    container.appendChild(this.renderer.domElement);

    // Cargar logo y crear geometría animada
    this.loadLogo().then(() => {
      this.createAnimatedGeometry();
      
      // Configurar ScrollTrigger con GSAP
      this.setupScrollTrigger(heroSection);
      
      // Iniciar animación
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
          resolve(); // Continuar sin logo si falla
        }
      );
    });
  }

  /**
   * Crea geometría animada que se forma con el scroll
   */
  private createAnimatedGeometry(): void {
    this.meshGroup = new THREE.Group();
    this.scene?.add(this.meshGroup);

    // Logo principal en el centro
    if (this.logoTexture && this.logoTexture.image) {
      // Calcular relación de aspecto del logo para mantener proporciones
      const image = this.logoTexture.image as HTMLImageElement;
      const logoAspect = image.width / image.height;
      const logoWidth = 1.2; // Más pequeño para navbar
      const logoHeight = logoWidth / logoAspect;
      
      const logoGeometry = new THREE.PlaneGeometry(logoWidth, logoHeight);
      const logoMaterial = new THREE.MeshBasicMaterial({
        map: this.logoTexture,
        transparent: true,
        opacity: 1, // Siempre visible en navbar
        side: THREE.DoubleSide,
        alphaTest: 0.1, // Para manejar transparencia del PNG
        depthWrite: false
      });
      
      this.logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
      this.logoMesh.position.z = 0;
      this.meshGroup.add(this.logoMesh);
    }

    // Geometría 1: Partículas minimalistas alrededor del logo
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color1 = new THREE.Color(0x3b82f6); // Azul
    const color2 = new THREE.Color(0x6366f1); // Indigo
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Partículas en anillos simples alrededor del logo
      const ringIndex = Math.floor(i / (particleCount / 3)); // 3 anillos
      const particlesPerRing = particleCount / 3;
      const angle = ((i % particlesPerRing) / particlesPerRing) * Math.PI * 2;
      
      const baseRadius = 1.5 + ringIndex * 0.3; // Más pequeño para navbar
      const radius = baseRadius + Math.random() * 0.1;
      const height = (Math.random() - 0.5) * 0.8;
      
      positions[i3] = radius * Math.cos(angle);
      positions[i3 + 1] = height;
      positions[i3 + 2] = radius * Math.sin(angle);
      
      // Colores simples azul/indigo
      const color = new THREE.Color().lerpColors(color1, color2, Math.random());
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = 0.04 + Math.random() * 0.02;
    }
    
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Shader personalizado para partículas más brillantes
    const vertexShader = `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
    
    const fragmentShader = `
      varying vec3 vColor;
      
      void main() {
        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
        float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
        gl_FragColor = vec4(vColor, alpha * 0.9);
      }
    `;
    
    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    this.particles = new THREE.Points(particleGeometry, particleMaterial);
    this.meshGroup.add(this.particles);
  }

  /**
   * Configura GSAP ScrollTrigger para controlar la animación
   */
  private setupScrollTrigger(heroSection: HTMLElement): void {
    // Para el navbar, la animación debe estar siempre activa basada en el scroll general
    this.scrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        this.scrollProgress = self.progress;
      }
    });
  }

  /**
   * Loop de animación
   */
  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    if (!this.scene || !this.camera || !this.renderer || !this.meshGroup) return;

    const time = Date.now() * 0.001;

    // Animar logo: siempre visible con efecto corazón
    if (this.logoMesh) {
      const logoMaterial = this.logoMesh.material as THREE.MeshBasicMaterial;
      logoMaterial.opacity = 1; // Siempre visible
      
      // Escala base del logo (más pequeño para el navbar)
      const baseScale = 0.3;
      
      // Efecto corazón (pulso rítmico)
      const heartbeat = Math.abs(Math.sin(time * 2.5)) * 0.1 + 1;
      const heartScale = baseScale * heartbeat;
      this.logoMesh.scale.set(heartScale, heartScale, 1);
    }

    // Efecto corazón en el grupo completo (sin rotación, más pequeño para navbar)
    const baseScale = 0.25;
    const heartbeat = Math.abs(Math.sin(time * 2.5)) * 0.08 + 1;
    const finalScale = baseScale * heartbeat;
    this.meshGroup.scale.set(finalScale, finalScale, finalScale);

    // Animar partículas: movimiento aleatorio y orgánico
    if (this.particles) {
      const positions = this.particles.geometry.attributes['position'] as THREE.BufferAttribute;
      const sizes = this.particles.geometry.attributes['size'] as THREE.BufferAttribute;
      
      // Guardar posiciones originales si no están guardadas
      if (!this.particles.userData['originalPositions']) {
        this.particles.userData['originalPositions'] = new Float32Array(positions.array);
      }
      
      const originalPositions = this.particles.userData['originalPositions'] as Float32Array;
      
      for (let i = 0; i < positions.count; i++) {
        const i3 = i * 3;
        
        // Movimiento aleatorio basado en el índice de la partícula (para que sea consistente)
        const randomSeed = i * 0.01;
        const randomX = Math.sin(time * 0.8 + randomSeed * 7.3) * 0.15;
        const randomY = Math.cos(time * 0.6 + randomSeed * 5.1) * 0.12;
        const randomZ = Math.sin(time * 0.7 + randomSeed * 3.7) * 0.1;
        
        // Movimiento orbital adicional
        const orbitSpeed = 0.3 + (i % 10) * 0.05;
        const orbitRadius = 0.08;
        const orbitX = Math.cos(time * orbitSpeed + i * 0.1) * orbitRadius;
        const orbitZ = Math.sin(time * orbitSpeed + i * 0.1) * orbitRadius;
        
        // Combinar posición original con movimientos aleatorios
        positions.array[i3] = originalPositions[i3] + randomX + orbitX;
        positions.array[i3 + 1] = originalPositions[i3 + 1] + randomY;
        positions.array[i3 + 2] = originalPositions[i3 + 2] + randomZ + orbitZ;
      }
      
      positions.needsUpdate = true;
    }

    // Cámara estática para navbar (no se mueve con scroll)
    if (this.camera) {
      this.camera.position.z = 3;
      this.camera.position.y = 0.2;
    }

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Maneja el resize de la ventana
   */
  handleResize(): void {
    if (!this.camera || !this.renderer) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    
    // Refrescar ScrollTrigger después del resize
    if (this.scrollTrigger) {
      ScrollTrigger.refresh();
    }
  }

  /**
   * Limpia recursos
   */
  cleanup(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
      this.scrollTrigger = null;
    }

    if (this.renderer && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }

    if (this.particles) {
      this.particles.geometry.dispose();
      if (this.particles.material instanceof THREE.Material) {
        this.particles.material.dispose();
      }
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

    if (this.meshGroup) {
      this.meshGroup.clear();
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.logoMesh = null;
    this.logoTexture = null;
    this.meshGroup = null;
  }
}
