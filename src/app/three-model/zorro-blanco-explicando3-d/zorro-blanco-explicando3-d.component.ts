import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// @ts-ignore
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as THREE from 'three';
import { Render3DService } from '../../service/render3-d.service';

@Component({
  selector: 'app-zorro-blanco-explicando3-d',
  standalone: true,
  imports: [],
  templateUrl: './zorro-blanco-explicando3-d.component.html',
  styleUrl: './zorro-blanco-explicando3-d.component.scss'
})
export class ZorroBlancoExplicando3DComponent implements OnInit, OnDestroy {

  // Obtiene el contenedor del canvas del DOM para poder inyectar el renderizador de Three.js
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  // Variables privadas para los elementos de Three.js
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animationId!: number;
  private model!: THREE.Object3D;
  private modoOscuroSubscription!: Subscription;

  // Variables para controlar la rotación del modelo con el mouse
  private targetRotationX = 0;
  private targetRotationY = 0;
  private lastMouseMoveTime = 0;

  constructor(public render3DService: Render3DService) {}

  // Este método se ejecuta cuando el componente se inicializa
  ngOnInit() {
    // Nos suscribimos al servicio para estar atentos a los cambios en 'modoOscuroRender3D'.
    // Esto es el corazón de la actualización dinámica. La primera vez que se suscribe,
    // se ejecuta con el valor inicial, construyendo la escena.
    this.modoOscuroSubscription = this.render3DService.modoOscuroRender3D$.subscribe(
      isModoOscuro => {
        this.refresh3DScene(isModoOscuro);
      }
    );
    // Inicializa el control del mouse para la rotación del modelo.
    this.initMouseControl();
  }

  // Este método se ejecuta justo antes de que el componente sea destruido
  ngOnDestroy() {
    // Es crucial desuscribirse para evitar fugas de memoria.
    if (this.modoOscuroSubscription) {
      this.modoOscuroSubscription.unsubscribe();
    }
    // Detiene la animación de Three.js para que el `requestAnimationFrame` no se ejecute infinitamente.
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    // Llama a la función de limpieza para liberar los recursos de la GPU.
    this.disposeScene();
    // Libera el renderizador y elimina el elemento canvas del DOM.
    if (this.renderer) {
      this.renderer.dispose();
      this.canvasContainer.nativeElement.removeChild(this.renderer.domElement);
    }
  }

  // ---

  /**
   * Refresca completamente la escena 3D en función del modo oscuro.
   * Este método se llama en cada cambio del tema.
   * @param isModoOscuro indica si la escena debe ser oscura o clara.
   */
  private refresh3DScene(isModoOscuro: boolean) {
    // 1. Limpiamos la escena anterior para no superponer objetos.
    this.disposeScene();

    // 2. Si el renderizador ya existe, eliminamos su canvas para que no queden dos.
    if (this.renderer) {
      this.canvasContainer.nativeElement.removeChild(this.renderer.domElement);
    }

    // 3. Volvemos a inicializar toda la escena con las nuevas configuraciones.
    this.initThree(isModoOscuro);
    this.loadModel(isModoOscuro);

    // 4. Aseguramos que la animación se inicie solo una vez, en la primera carga.
    if (!this.animationId) {
      this.animate();
    }
  }

  // ---

  /**
   * Libera todos los recursos de la GPU (geometrías, materiales, texturas).
   * Esto es vital para evitar fugas de memoria.
   */
  private disposeScene() {
    if (this.scene) {
      // Recorremos cada objeto de la escena.
      this.scene.traverse((object: any) => {
        // Si el objeto tiene una geometría, la liberamos.
        if (object.isMesh && object.geometry) {
          object.geometry.dispose();
        }

        // Si el objeto tiene un material, lo liberamos.
        if (object.isMesh && object.material) {
          if (object.material.isMaterial) {
            this.disposeMaterial(object.material);
          } else if (Array.isArray(object.material)) {
            for (const material of object.material) {
              this.disposeMaterial(material);
            }
          }
        }
      });

      // Liberamos la textura del fondo si existe.
      if (this.scene.background && (this.scene.background as any).dispose) {
        (this.scene.background as any).dispose();
      }

      // Eliminamos todos los objetos de la escena.
      while (this.scene.children.length > 0) {
        const child = this.scene.children[0];
        this.scene.remove(child);
      }
    }
  }

  // ---

  /**
   * Libera un material y todas sus texturas asociadas.
   * @param material El material a liberar.
   */
  private disposeMaterial(material: THREE.Material) {
    for (const key of Object.keys(material)) {
      const value = (material as any)[key];
      // Si la propiedad es una textura, la liberamos.
      if (value && typeof value === 'object' && 'isTexture' in value) {
        value.dispose();
      }
    }
    // Finalmente, liberamos el material en sí.
    material.dispose();
  }

  // ---

  /**
   * Configura la escena, la cámara, el renderizador, las luces y la "habitación".
   * @param isModoOscuro Define si se usan los colores y texturas del modo oscuro o claro.
   */
  private initThree(isModoOscuro: boolean) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvasContainer.nativeElement.clientWidth / this.canvasContainer.nativeElement.clientHeight,
      0.1,
      1000
    );

    this.camera.position.set(0, 1, 2.4);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(
      this.canvasContainer.nativeElement.clientWidth,
      this.canvasContainer.nativeElement.clientHeight
    );

    this.canvasContainer.nativeElement.appendChild(this.renderer.domElement);

    let intensidadLuz = 2.5;
    const warmLight1 = new THREE.DirectionalLight(0xffa500, intensidadLuz);
    warmLight1.position.set(5, 10, 7);
    this.scene.add(warmLight1);

    intensidadLuz = 4.9;
    const warmLight2 = new THREE.DirectionalLight(0xffe4b5, intensidadLuz);
    warmLight2.position.set(-5, 8, -5);
    this.scene.add(warmLight2);

    intensidadLuz = 1.1;
    const ambientLight = new THREE.AmbientLight(0xffe4b5, intensidadLuz);
    this.scene.add(ambientLight);

    const textureLoader = new THREE.TextureLoader();
    let wallTextures = [
      textureLoader.load('assets/texturas/pared.jpg'),
      textureLoader.load('assets/texturas/pared.jpg'),
      textureLoader.load('assets/texturas/pared3.png'),
      textureLoader.load('assets/texturas/pared4.png'),
      textureLoader.load('assets/texturas/pared.jpg'),
      textureLoader.load('assets/texturas/pared2.png')
    ];

    if (isModoOscuro) {
      const centerLight = new THREE.SpotLight(0xffffff, 50, 10, Math.PI / 8, 0.5, 2);
      centerLight.position.set(0, 5, 0);
      centerLight.target.position.set(0, 0, 0);
      this.scene.add(centerLight);
      this.scene.add(centerLight.target);

      warmLight1.color.set(0x0a1530);
      warmLight1.intensity = 0.2;
      warmLight2.color.set(0x0a1530);
      warmLight2.intensity = 0.2;
      ambientLight.color.set(0x0a1530);
      ambientLight.intensity = 0.4;

      wallTextures = [
        textureLoader.load('assets/texturas/3.png'),
        textureLoader.load('assets/texturas/2.png'),
        textureLoader.load('assets/texturas/cieloNocturno.jpg'),
        textureLoader.load('assets/texturas/piso.png'),
        textureLoader.load('assets/texturas/n.jpg'),
        textureLoader.load('assets/texturas/atras.jpg')
      ];

      this.scene.background = new THREE.Color(0x000000);
    }

    wallTextures.forEach(tex => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 1);
    });

    const wallMaterials = wallTextures.map(tex => new THREE.MeshStandardMaterial({
      map: tex,
      side: THREE.BackSide
    }));

    const roomSize = 5;
    const roomGeometry = new THREE.BoxGeometry(roomSize, roomSize, roomSize);
    const room = new THREE.Mesh(roomGeometry, wallMaterials);
    room.position.y = roomSize / 2 - 1;
    room.traverse((child: any) => {
      if (child.isMesh) {
        child.receiveShadow = true;
      }
    });

    this.scene.add(room);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = false;
  }

  // ---

  /**
   * Carga el modelo 3D del zorro según el modo oscuro actual.
   * @param isModoOscuro Define si se carga el modelo oscuro o claro.
   */
  private loadModel(isModoOscuro: boolean) {
    let pathPersonaje = 'assets/models/zorroModoClaro/'

    if (isModoOscuro) {
      pathPersonaje = 'assets/models/zorroModoOscuro/'
    }

    const mtlLoader = new MTLLoader();
    mtlLoader.setPath(pathPersonaje);

    mtlLoader.load('source.mtl', (materials: any) => {
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath(pathPersonaje);
      objLoader.load('source.obj', (object: any) => {
        this.model = object;
        object.position.set(0, 0, 0);
        object.rotation.x = -Math.PI / 2;
        object.rotation.z = -Math.PI / 2;
        object.scale.set(2, 2, 2);

        object.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.scene.add(object);
      });
    });
  }

  // ---

  /**
   * Bucle de animación principal. Se llama en cada frame para actualizar la escena.
   */
  private animate = () => {
    // Solicita al navegador que vuelva a llamar a este método en el siguiente frame.
    this.animationId = requestAnimationFrame(this.animate);
    const time = Date.now() * 0.002;

    if (this.model) {
      // Efecto de "respiración" moviendo la escala Y del modelo.
      const scaleY = 2 + Math.sin(time) * 0.01;
      this.model.scale.set(2, scaleY, 2);

      const timeSinceMouseMove = Date.now() - this.lastMouseMoveTime;

      // Si el mouse se ha movido recientemente, rotamos el modelo para que siga al cursor.
      if (timeSinceMouseMove < 2000) {
        this.model.rotation.x = -Math.PI / 2;
        this.model.rotation.z = -Math.PI / 2;
        this.model.rotation.z += (this.targetRotationY - this.model.rotation.z) * 0.12;
        this.model.rotation.x += (this.targetRotationX - this.model.rotation.x) * 0.04;
      }
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  // ---

  /**
   * Configura los listeners del mouse para rotar el modelo.
   */
  private initMouseControl() {
    window.addEventListener('mousemove', (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      this.targetRotationY = x * Math.PI * 0.25;
      this.targetRotationX = y * Math.PI * 0.1;
      this.lastMouseMoveTime = Date.now();
    });
  }
}