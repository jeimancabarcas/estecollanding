import { Component, OnInit, OnDestroy, ElementRef, ViewChild, afterNextRender, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
// Importar módulos de post-procesamiento
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

/**
 * Componente LogoAnimation - Animación 3D del logo ESTECOL
 * Principio de Responsabilidad Única: Solo maneja la animación del logo
 */
@Component({
  selector: 'app-logo-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logo-animation.component.html',
  styleUrl: './logo-animation.component.css'
})
export class LogoAnimationComponent implements OnInit, OnDestroy {
  @ViewChild('logoContainer', { static: true }) logoContainer!: ElementRef<HTMLDivElement>;
  @Input() logoPath: string = ''; // Ruta opcional al logo

  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private composer: EffectComposer | null = null;
  private logoMesh: THREE.Mesh | null = null;
  private particleSystem: THREE.Points | null = null;
  private animationId: number | null = null;
  private mouse = new THREE.Vector2();
  private targetRotation = new THREE.Vector2();
  private currentRotation = new THREE.Vector2();
  private time = 0;
  private isHovered = false;
  private baseRotationSpeed = 0.001;
  private hoverRotationSpeed = 0.004;

  constructor() {
    afterNextRender(() => {
      this.initializeScene();
    });
  }

  ngOnInit(): void {
    // El inicializado se hace en afterNextRender
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  /**
   * Inicializa la escena Three.js con el logo y partículas
   */
  private initializeScene(): void {
    if (!this.logoContainer?.nativeElement) return;

    const width = this.logoContainer.nativeElement.clientWidth || 600;
    const height = this.logoContainer.nativeElement.clientHeight || 600;

    // Crear escena
    this.scene = new THREE.Scene();
    this.scene.background = null;

    // Crear cámara
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 8);

    // Crear renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.logoContainer.nativeElement.appendChild(this.renderer.domElement);

    // Agregar luces
    this.setupLights();

    // Crear logo con textura
    this.createLogo().then(() => {
      // Crear escudo de partículas después de que el logo esté listo
      this.createParticleShield();
      
      // Configurar post-procesamiento
      this.setupPostProcessing();
      
      // Event listeners
      this.setupEventListeners();
      
      // Iniciar animación
      this.animate();
    });
  }

  /**
   * Configura las luces de la escena
   */
  private setupLights(): void {
    if (!this.scene) return;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    this.scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, -5, 5);
    this.scene.add(directionalLight2);
  }

  /**
   * Crea el logo como un plano con textura
   */
  private async createLogo(): Promise<void> {
    if (!this.scene) return;

    let texture: THREE.Texture;

    if (this.logoPath) {
      // Cargar logo desde archivo
      const loader = new THREE.TextureLoader();
      texture = await new Promise((resolve, reject) => {
        loader.load(
          this.logoPath,
          (tex) => resolve(tex),
          undefined,
          () => {
            // Si falla, crear logo programático
            resolve(this.createProgrammaticLogo());
          }
        );
      });
    } else {
      // Crear logo programático (simulando el logo de ESTECOL)
      texture = this.createProgrammaticLogo();
    }

    // Crear material con emisión para el efecto glow
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      emissive: 0xffffff,
      emissiveIntensity: 0.4,
      emissiveMap: texture,
      roughness: 0.3,
      metalness: 0.1
    });

    // Crear geometría del plano
    const geometry = new THREE.PlaneGeometry(3, 3);
    this.logoMesh = new THREE.Mesh(geometry, material);
    this.logoMesh.position.set(0, 0, 0);
    this.scene.add(this.logoMesh);
  }

  /**
   * Crea un logo programático usando Canvas (simulando el logo de ESTECOL)
   */
  private createProgrammaticLogo(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Fondo transparente
    ctx.clearRect(0, 0, 1024, 1024);

    // Dibujar silueta de Colombia (simplificada pero reconocible)
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    // Forma simplificada de Colombia
    ctx.moveTo(200, 100);
    ctx.lineTo(800, 100);
    ctx.lineTo(840, 400);
    ctx.lineTo(800, 800);
    ctx.lineTo(400, 900);
    ctx.lineTo(200, 800);
    ctx.lineTo(160, 400);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Dibujar pickup truck simplificado pero detallado
    // Cuerpo principal del camión
    ctx.fillStyle = '#f5f5f5';
    ctx.beginPath();
    ctx.rect(300, 500, 400, 160);
    ctx.fill();
    
    // Cabina
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.rect(560, 500, 160, 160);
    ctx.fill();

    // Detalles del camión
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.rect(300, 500, 400, 40);
    ctx.fill();

    // Ruedas (más grandes y detalladas)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(360, 680, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(640, 680, 40, 0, Math.PI * 2);
    ctx.fill();

    // Llantas
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.arc(360, 680, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(640, 680, 25, 0, Math.PI * 2);
    ctx.fill();

    // Ventanas (blancas para glow)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.rect(580, 520, 120, 80);
    ctx.fill();

    // Parabrisas
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.rect(320, 520, 200, 60);
    ctx.fill();

    // Crear textura desde canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  /**
   * Crea el escudo de partículas que orbita alrededor del logo
   */
  private createParticleShield(): void {
    if (!this.scene) return;

    const particleCount = 4000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Colores grises oscuros para el escudo de seguridad
    const color1 = new THREE.Color(0x2a2a2a);
    const color2 = new THREE.Color(0x404040);
    const color3 = new THREE.Color(0x1a1a1a);
    const color4 = new THREE.Color(0x303030);

    // Crear esfera de partículas alrededor del logo
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Esfera con radio mayor que el logo (escudo protector)
      const radius = 2.8 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // Colores aleatorios para variación
      const randomColor = Math.random();
      let color: THREE.Color;
      if (randomColor < 0.3) {
        color = color1;
      } else if (randomColor < 0.6) {
        color = color2;
      } else if (randomColor < 0.85) {
        color = color3;
      } else {
        color = color4;
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.1 + 0.04;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Material con shader para mejor efecto
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Pulso sutil que transmite seguridad
          float pulse = sin(time * 1.5 + position.x * 0.15) * 0.15 + 1.0;
          gl_PointSize = size * (350.0 / -mvPosition.z) * pulse;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          
          // Efecto de brillo para el escudo
          float glow = exp(-distanceToCenter * 5.0);
          
          gl_FragColor = vec4(vColor * glow, alpha * 0.85);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  /**
   * Configura el post-procesamiento para efecto Bloom/Glow
   */
  private setupPostProcessing(): void {
    if (!this.renderer || !this.scene || !this.camera) return;

    this.composer = new EffectComposer(this.renderer);
    
    // Render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Bloom pass para el efecto glow en las partes blancas del logo
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(
        this.logoContainer.nativeElement.clientWidth || 600,
        this.logoContainer.nativeElement.clientHeight || 600
      ),
      2.0, // strength - más intenso para mejor glow
      0.5, // radius
      0.9  // threshold - solo las partes más brillantes (blancas)
    );
    this.composer.addPass(bloomPass);
  }

  /**
   * Configura los event listeners
   */
  private setupEventListeners(): void {
    if (!this.logoContainer?.nativeElement) return;

    this.logoContainer.nativeElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.logoContainer.nativeElement.addEventListener('mouseenter', () => this.onMouseEnter());
    this.logoContainer.nativeElement.addEventListener('mouseleave', () => this.onMouseLeave());
    window.addEventListener('resize', () => this.handleResize());
  }

  /**
   * Maneja el movimiento del mouse (parallax 3D)
   */
  private onMouseMove(event: MouseEvent): void {
    if (!this.logoContainer?.nativeElement) return;

    const rect = this.logoContainer.nativeElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Calcular rotación objetivo (parallax 3D)
    this.targetRotation.x = this.mouse.y * 0.4;
    this.targetRotation.y = this.mouse.x * 0.4;
  }

  /**
   * Maneja el hover del mouse
   */
  private onMouseEnter(): void {
    this.isHovered = true;
  }

  /**
   * Maneja la salida del mouse
   */
  private onMouseLeave(): void {
    this.isHovered = false;
    this.targetRotation.set(0, 0);
  }

  /**
   * Loop de animación
   */
  private animate(): void {
    if (!this.scene || !this.camera || !this.renderer) return;

    this.animationId = requestAnimationFrame(() => this.animate());
    this.time += 0.015;

    // Rotación suave del logo (parallax 3D)
    if (this.logoMesh) {
      this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
      this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;
      
      this.logoMesh.rotation.x = this.currentRotation.x;
      this.logoMesh.rotation.y = this.currentRotation.y;
    }

    // Rotación de partículas (acelera cuando hay hover)
    if (this.particleSystem) {
      const rotationSpeed = this.isHovered ? this.hoverRotationSpeed : this.baseRotationSpeed;
      this.particleSystem.rotation.x += rotationSpeed;
      this.particleSystem.rotation.y += rotationSpeed * 1.5;
      this.particleSystem.rotation.z += rotationSpeed * 0.7;

      // Actualizar tiempo en shader
      if (this.particleSystem.material instanceof THREE.ShaderMaterial) {
        this.particleSystem.material.uniforms['time'].value = this.time;
      }
    }

    // Renderizar con post-procesamiento
    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /**
   * Maneja el redimensionamiento
   */
  private handleResize(): void {
    if (!this.camera || !this.renderer || !this.logoContainer?.nativeElement) return;

    const width = this.logoContainer.nativeElement.clientWidth || 600;
    const height = this.logoContainer.nativeElement.clientHeight || 600;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    if (this.composer) {
      this.composer.setSize(width, height);
    }
  }

  /**
   * Limpia los recursos
   */
  private cleanup(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.particleSystem) {
      this.particleSystem.geometry.dispose();
      if (Array.isArray(this.particleSystem.material)) {
        this.particleSystem.material.forEach(m => m.dispose());
      } else {
        this.particleSystem.material.dispose();
      }
      this.particleSystem = null;
    }

    if (this.logoMesh) {
      this.logoMesh.geometry.dispose();
      if (Array.isArray(this.logoMesh.material)) {
        this.logoMesh.material.forEach(m => m.dispose());
      } else {
        (this.logoMesh.material as THREE.Material).dispose();
      }
      this.logoMesh = null;
    }

    if (this.renderer) {
      this.renderer.dispose();
      const canvas = this.renderer.domElement;
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      this.renderer = null;
    }

    this.scene = null;
    this.camera = null;
    this.composer = null;
  }
}
