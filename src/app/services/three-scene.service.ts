import { Injectable } from '@angular/core';
import * as THREE from 'three';

/**
 * Servicio responsable de crear y gestionar la escena Three.js
 * Principio de Responsabilidad Única: Solo maneja la lógica de Three.js
 */
@Injectable({
  providedIn: 'root'
})
export class ThreeSceneService {
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private animationId: number | null = null;
  private particles: THREE.Points | null = null;
  private particleSystem: { positions: Float32Array; velocities: Float32Array; originalPositions: Float32Array } | null = null;
  private time = 0;
  private mouse = new THREE.Vector2();

  /**
   * Inicializa la escena Three.js con partículas animadas mejoradas
   */
  initializeScene(container: HTMLElement): void {
    if (this.scene) {
      this.cleanup();
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Crear escena con fondo blanco minimalista
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparente para mostrar el fondo blanco del componente

    // Crear cámara
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    // Crear renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Crear partículas mejoradas con tema de rutas
    this.createRouteParticles();

    // Event listeners para interacción
    container.addEventListener('mousemove', (e) => this.onMouseMove(e, container));
    
    // Iniciar animación
    this.animate();

    // Manejar resize
    window.addEventListener('resize', () => this.handleResize(container));
  }

  /**
   * Crea un sistema de partículas temático de rutas y transporte
   */
  private createRouteParticles(): void {
    if (!this.scene) return;

    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Colores temáticos: grises oscuros que simulan rutas y vehículos
    const color1 = new THREE.Color(0x1a1a1a); // Gris muy oscuro (ruta principal)
    const color2 = new THREE.Color(0x2a2a2a); // Gris oscuro (ruta secundaria)
    const color3 = new THREE.Color(0x404040); // Gris medio (marcadores)
    const color4 = new THREE.Color(0x303030); // Gris oscuro alternativo

    // Crear patrones de rutas (líneas que simulan carreteras)
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Crear patrones de rutas horizontales y verticales
      let x: number, y: number, z: number;
      
      if (i < particleCount * 0.3) {
        // Rutas horizontales (simulando carreteras)
        const routeIndex = Math.floor(i / (particleCount * 0.3 / 3));
        y = (routeIndex - 1) * 3 + (Math.random() - 0.5) * 0.5;
        x = (Math.random() - 0.5) * 20;
        z = (Math.random() - 0.5) * 2;
      } else if (i < particleCount * 0.6) {
        // Rutas verticales
        const routeIndex = Math.floor((i - particleCount * 0.3) / (particleCount * 0.3 / 3));
        x = (routeIndex - 1) * 3 + (Math.random() - 0.5) * 0.5;
        y = (Math.random() - 0.5) * 20;
        z = (Math.random() - 0.5) * 2;
      } else {
        // Partículas de fondo (simulando vehículos o puntos de referencia)
        const radius = 12 + Math.random() * 4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta);
        z = radius * Math.cos(phi);
      }
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      
      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;
      
      // Velocidades que simulan movimiento de vehículos en rutas
      if (i < particleCount * 0.6) {
        // Movimiento en rutas (direccional)
        velocities[i3] = (Math.random() - 0.5) * 0.08;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.08;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      } else {
        // Movimiento orgánico para partículas de fondo
        velocities[i3] = (Math.random() - 0.5) * 0.05;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.05;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.05;
      }

      // Colores según el tipo de partícula
      const randomColor = Math.random();
      let color: THREE.Color;
      if (i < particleCount * 0.3) {
        color = color1; // Rutas horizontales
      } else if (i < particleCount * 0.6) {
        color = color2; // Rutas verticales
      } else if (randomColor < 0.5) {
        color = color3; // Marcadores
      } else {
        color = color4;
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Tamaños variados: más grandes para rutas, más pequeños para fondo
      if (i < particleCount * 0.6) {
        sizes[i] = Math.random() * 0.2 + 0.1; // Partículas de ruta más grandes
      } else {
        sizes[i] = Math.random() * 0.15 + 0.05; // Partículas de fondo
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Shader material personalizado con efectos más llamativos
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vSize;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Efecto de pulso dinámico que simula movimiento de vehículos
          float pulse = sin(time * 4.0 + position.x * 0.3 + position.y * 0.2) * 0.4 + 1.0;
          float sizeVariation = sin(time * 3.0 + position.z * 0.15) * 0.3 + 1.0;
          
          vSize = size * (450.0 / -mvPosition.z) * pulse * sizeVariation;
          gl_PointSize = vSize;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vSize;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float distanceToCenter = length(center);
          
          // Círculo más definido y visible
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          
          // Efecto de brillo más intenso
          float glow = exp(-distanceToCenter * 5.0);
          
          // Añadir un borde más visible
          float edge = 1.0 - smoothstep(0.25, 0.5, distanceToCenter);
          
          vec3 finalColor = vColor * glow * (1.0 + edge * 0.6);
          gl_FragColor = vec4(finalColor, alpha * 0.98);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    // Guardar datos para animación
    this.particleSystem = {
      positions,
      velocities,
      originalPositions
    };
  }

  /**
   * Maneja el movimiento del mouse para interacción
   */
  private onMouseMove(event: MouseEvent, container: HTMLElement): void {
    this.mouse.x = (event.clientX / container.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / container.clientHeight) * 2 + 1;
  }

  /**
   * Loop de animación mejorado con efectos dinámicos y más llamativos
   */
  private animate(): void {
    if (!this.scene || !this.camera || !this.renderer) return;

    this.animationId = requestAnimationFrame(() => this.animate());
    this.time += 0.025; // Velocidad aumentada para movimiento más visible

    if (this.particles && this.particleSystem) {
      const positions = this.particleSystem.positions;
      const velocities = this.particleSystem.velocities;
      const originalPositions = this.particleSystem.originalPositions;
      const geometry = this.particles.geometry as THREE.BufferGeometry;
      const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;

      // Animar partículas con movimiento que simula tráfico en rutas
      for (let i = 0; i < positions.length; i += 3) {
        const index = i / 3;
        
        // Movimiento base con velocidad
        positions[i] += velocities[i] * 2.0;
        positions[i + 1] += velocities[i + 1] * 2.0;
        positions[i + 2] += velocities[i + 2] * 1.5;
        
        // Efectos de onda más pronunciados que simulan movimiento de vehículos
        let waveX: number, waveY: number, waveZ: number;
        
        if (index < positions.length / 3 * 0.6) {
          // Movimiento más lineal para partículas de ruta (simulando vehículos)
          waveX = Math.sin(this.time * 1.5 + originalPositions[i] * 0.2) * 1.2;
          waveY = Math.cos(this.time * 1.3 + originalPositions[i + 1] * 0.2) * 1.2;
          waveZ = Math.sin(this.time * 0.8 + originalPositions[i + 2] * 0.15) * 0.5;
        } else {
          // Movimiento orgánico para partículas de fondo
          const waveX1 = Math.sin(this.time * 1.0 + originalPositions[i] * 0.18) * 1.0;
          const waveX2 = Math.cos(this.time * 1.4 + originalPositions[i] * 0.1) * 0.5;
          waveX = waveX1 + waveX2;
          
          const waveY1 = Math.cos(this.time * 1.1 + originalPositions[i + 1] * 0.18) * 1.0;
          const waveY2 = Math.sin(this.time * 1.3 + originalPositions[i + 1] * 0.1) * 0.5;
          waveY = waveY1 + waveY2;
          
          waveZ = Math.sin(this.time * 0.9 + originalPositions[i + 2] * 0.12) * 0.8;
        }
        
        // Posición final con ondas
        positionAttribute.array[i] = originalPositions[i] + waveX;
        positionAttribute.array[i + 1] = originalPositions[i + 1] + waveY;
        positionAttribute.array[i + 2] = originalPositions[i + 2] + waveZ;
        
        // Efecto de atracción hacia el mouse más visible
        const mouseInfluence = 2.0;
        const dx = this.mouse.x * 18 - positionAttribute.array[i];
        const dy = this.mouse.y * 18 - positionAttribute.array[i + 1];
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 10) {
          const force = (10 - distance) / 10;
          positionAttribute.array[i] += dx * force * mouseInfluence * 0.03;
          positionAttribute.array[i + 1] += dy * force * mouseInfluence * 0.03;
        }
      }
      
      positionAttribute.needsUpdate = true;
      
      // Rotación más visible
      this.particles.rotation.x += 0.0012;
      this.particles.rotation.y += 0.0018;
      this.particles.rotation.z += 0.0008;
      
      // Actualizar tiempo en el shader
      if (this.particles.material instanceof THREE.ShaderMaterial) {
        this.particles.material.uniforms['time'].value = this.time;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Maneja el redimensionamiento de la ventana
   */
  private handleResize(container: HTMLElement): void {
    if (!this.camera || !this.renderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Limpia los recursos de Three.js
   */
  cleanup(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.particles) {
      this.particles.geometry.dispose();
      if (Array.isArray(this.particles.material)) {
        this.particles.material.forEach(m => m.dispose());
      } else {
        this.particles.material.dispose();
      }
      this.particles = null;
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
    this.particleSystem = null;
    this.time = 0;
  }
}
