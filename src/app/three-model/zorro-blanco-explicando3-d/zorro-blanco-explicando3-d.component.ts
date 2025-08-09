import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';

// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// @ts-ignore
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as THREE from 'three';

@Component({
  selector: 'app-zorro-blanco-explicando3-d',
  standalone: true,
  imports: [],
  templateUrl: './zorro-blanco-explicando3-d.component.html',
  styleUrl: './zorro-blanco-explicando3-d.component.scss'
})
export class ZorroBlancoExplicando3DComponent implements OnInit {

  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animationId!: number;
  private model!: THREE.Object3D;


  // Variables para que gire sin darle clik siga el cursor
  private targetRotationX = 0;
  private targetRotationY = 0;

  private lastMouseMoveTime = 0;


  ngOnInit() {
    this.initThree();
    this.loadModel();
    this.initMouseControl();
    this.animate();

  }


  private initThree() {
    // Escena: donde estarán todos los objetos, luces y cámara
    this.scene = new THREE.Scene();

    // Cámara en perspectiva
    this.camera = new THREE.PerspectiveCamera(
      75, // Campo de visión (FOV) en grados: cuanto más alto, más “abierta” la vista
      this.canvasContainer.nativeElement.clientWidth / this.canvasContainer.nativeElement.clientHeight, // Relación de aspecto (ancho / alto)
      0.1, // Plano cercano: todo lo más cerca de 0.1 unidades se recorta
      1000 // Plano lejano: todo lo más lejos de 1000 unidades se recorta
    );

    this.camera.position.set(0, 1, 2.4); // Posición de la cámara (X=0, Y=1, Z=3)


    // Render con transparencia y suavizado de bordes
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, // Activa suavizado de bordes en líneas y objetos
      alpha: true      // Permite fondo transparente
    });
    this.renderer.setSize(
      this.canvasContainer.nativeElement.clientWidth, // Ancho igual al contenedor
      this.canvasContainer.nativeElement.clientHeight // Alto igual al contenedor
    );
    this.renderer.shadowMap.enabled = true; // Activa el cálculo de sombras
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombras más suaves y difusas
    this.canvasContainer.nativeElement.appendChild(this.renderer.domElement); // Inserta el canvas de Three.js en el HTML

    // Luz direccional principal (naranja cálido)
    const warmLight1 = new THREE.DirectionalLight(0xffa500, 2.5); // Color naranja y potencia 2.5
    warmLight1.position.set(5, 10, 7); // Ubicación de la luz en el espacio
    warmLight1.castShadow = true;
    warmLight1.shadow.mapSize.width = 2048;  // mayor resolución
    warmLight1.shadow.mapSize.height = 2048;
    warmLight1.shadow.bias = -0.0001; // evita artefactos
    warmLight1.shadow.camera.left = -5;
    warmLight1.shadow.camera.right = 5;
    warmLight1.shadow.camera.top = 5;
    warmLight1.shadow.camera.bottom = -5;

    this.scene.add(warmLight1); // Agrega la luz a la escena

    // Luz direccional secundaria (más suave y dorada)
    const warmLight2 = new THREE.DirectionalLight(0xffe4b5, 4.9); 
    warmLight2.position.set(-5, 8, -5); // Ubicación de la luz
    this.scene.add(warmLight2); // Agrega la luz a la escena

    // Luz ambiental (ilumina todo por igual, sin sombras)
    const ambientLight = new THREE.AmbientLight(0xffe4b5, 1.1); // Color cálido y baja intensidad
    this.scene.add(ambientLight);

    // Loader de texturas
    const textureLoader = new THREE.TextureLoader();

    // Cargar una textura diferente para cada pared
    const wallTextures = [
      textureLoader.load('assets/texturas/pared.jpg'), // Frente
      textureLoader.load('assets/texturas/pared.jpg'), // Atrás
      textureLoader.load('assets/texturas/pared3.png'), // Arriba
      textureLoader.load('assets/texturas/pared4.png'), // Abajo
      textureLoader.load('assets/texturas/pared.jpg'), // Izquierda
      textureLoader.load('assets/texturas/pared2.png')  // Derecha
    ];

    // Configurar que cada textura se repita si quieres
    wallTextures.forEach(tex => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 1);
    });

    // Crear un material distinto para cada cara
    const wallMaterials = wallTextures.map(tex => new THREE.MeshStandardMaterial({
      map: tex,
      side: THREE.BackSide // Interior visible
    }));

    // Crear la habitación
    const roomSize = 5;
    const roomGeometry = new THREE.BoxGeometry(roomSize, roomSize, roomSize);
    const room = new THREE.Mesh(roomGeometry, wallMaterials);

    // Ajustar posición para que el piso quede alineado
    room.position.y = roomSize / 2 - 1;

    room.traverse((child: any) => {
      if (child.isMesh) {
        child.receiveShadow = true;
      }
    });

    // Agregar a la escena
    this.scene.add(room);

    // Controles para mover la cámara con el ratón
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = false; // Desactiva el zoom con scroll o pinza

  }


  private loadModel() {
    const mtlLoader = new MTLLoader();
    mtlLoader.setPath('assets/models/');

    mtlLoader.load('source.mtl', (materials: any) => {
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('assets/models/');
      objLoader.load('source.obj', (object: any) => {
        this.model = object; // 🔹 Guardamos referencia para animarlo
        object.position.set(0, 0, 0);
        object.rotation.x = -Math.PI / 2; // Poner de pie
        object.rotation.z = -Math.PI / 2; // mirar para alfrente
        object.scale.set(2, 2, 2);

        // ✅ Activar sombras en el modelo
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


  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);


    const time = Date.now() * 0.002; // Tiempo en segundos (escalado)

    if (this.model) {
      // Respiración: variación sutil en la escala Y
      const scaleY = 2 + Math.sin(time) * 0.01;
      this.model.scale.set(2, scaleY, 2);


      const timeSinceMouseMove = Date.now() - this.lastMouseMoveTime;

      if (timeSinceMouseMove < 2000) {
        this.model.rotation.x = -Math.PI / 2; // Poner de pie
        this.model.rotation.z = -Math.PI / 2; // mirar para alfrente
        // Rotación suave hacia el mouse
        this.model.rotation.z += (this.targetRotationY - this.model.rotation.z) * 0.12;
        this.model.rotation.x += (this.targetRotationX - this.model.rotation.x) * 0.04;
      }

    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

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

