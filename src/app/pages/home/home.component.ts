import { NgClass } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren, Input, OnInit } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ZorroBlancoExplicando3DComponent } from "../../three-model/zorro-blanco-explicando3-d/zorro-blanco-explicando3-d.component";
import CSSRulePlugin from 'gsap/CSSRulePlugin';

gsap.registerPlugin(ScrollTrigger, CSSRulePlugin);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgClass, ZorroBlancoExplicando3DComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {

  @Input() modoOscuro = false;
  currentYear = new Date().getFullYear();

  // ==========================================
  // DATOS DEL PORTAFOLIO
  // ==========================================
  conocimientosArray = [
    { nombre: "HTML",       imagen: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", descripcion: "Estructura semántica web." },
    { nombre: "CSS",        imagen: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", descripcion: "Diseño visual e interfaces." },
    { nombre: "JavaScript", imagen: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", descripcion: "Lógica e interactividad." },
    { nombre: "TypeScript", imagen: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", descripcion: "JS tipado para proyectos robustos." },
    { nombre: "Angular",    imagen: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg", descripcion: "Framework principal para web SPA." },
    { nombre: "Ionic",      imagen: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ionic/ionic-original.svg", descripcion: "Apps móviles híbridas." },
    { nombre: "MySQL",      imagen: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", descripcion: "Bases de datos relacionales." },
    { nombre: "Firebase",   imagen: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg", descripcion: "Backend as a Service y Auth." },
    { nombre: "Python",     imagen: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", descripcion: "Procesamiento de datos y backend." },
    { nombre: "Flask",      imagen: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg", descripcion: "Microframework para APIs REST." },
    { nombre: "Node.js",    imagen: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", descripcion: "Entorno de ejecución backend." },
    { nombre: "Git",        imagen: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", descripcion: "Control de versiones." },
    { nombre: "Bootstrap",  imagen: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg", descripcion: "Maquetación ágil." },
    { nombre: "Figma",      imagen: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", descripcion: "Diseño UI/UX." }, 
    { nombre: "Spline",     imagen: "https://portafolio-puk64inbr-kevinfrile.vercel.app/assets/spline.svg", descripcion: "Modelado 3D interactivo." },
    { nombre: "GSAP",       imagen: "https://portafolio-puk64inbr-kevinfrile.vercel.app/assets/gsap.svg", descripcion: "Animaciones web avanzadas." }
  ];

  proyectosSecundarios = [
  {
    id: 'tender',
    kicker: 'Laboral · Zona Logística',
    nombre: 'Tender WMS Support',
    desc: 'Middleware de alto rendimiento para WMS. Especializado en consultas personalizadas ágiles, picking avanzado para clientes y rastreo IoT de equipos de frío para Bavaria.',
    tags: ['Angular', 'Flask', 'MySQL'],
    link: 'https://tenderzl.zonalogistica.com.co/#/inicio',
    linkLabel: 'Ver plataforma'
  },
  {
    id: 'udec-eventos',
    kicker: 'Universidad de Cundinamarca',
    nombre: 'Udec Eventos',
    desc: 'Sistema de gestión y control de eventos universitarios. Automatización de registros, asistencia y generación de certificados para la comunidad académica.',
    tags: ['Angular', 'Node.js', 'PostgreSQL'],
    link: '#', // Añadir link si aplica
    linkLabel: 'Ver proyecto'
  },
  {
    id: 'sga',
    kicker: 'Laboral · Zona Logística',
    nombre: 'Sistema SGA',
    desc: 'Trazabilidad de rutas y vehículos. Migración de datos manuales a un modelo estructurado relacional con procesamiento en tiempo real.',
    tags: ['Angular', 'MySQL', 'Full Stack'],
    link: 'https://sgazl.zonalogistica.com.co/#/',
    linkLabel: 'Ver sistema'
  },
  {
    id: 'inspector',
    kicker: 'Freelance',
    nombre: 'Inspector Systems',
    desc: 'Plataforma de gestión de siniestros. Liderazgo en el frontend integrando WebSockets y Diagrama de Gantt interactivo para el seguimiento de casos.',
    tags: ['Ionic', 'Angular', 'Gantt'],
    link: 'https://www.inspector.systems/auth/login',
    linkLabel: 'Sitio oficial'
  },
  {
    id: 'atarabi',
    kicker: 'Berraco Dev',
    nombre: 'Atarabi AI',
    desc: 'Aplicación de registro emocional por voz. Implementa IA para el análisis de sentimiento y recomendaciones personalizadas de bienestar.',
    tags: ['Ionic', 'Firebase', 'IA'],
    link: 'https://play.google.com/store/apps/details?id=com.atarabi.app&hl=es',
    linkLabel: 'Play Store'
  }
];

  formacion = [
    { titulo: 'Ingeniería de Software', inst: 'Universidad de Cundinamarca', fecha: '2023 – Actualidad', nota: 'Cursando 6° semestre. Enfoque en arquitectura.' },
    { titulo: 'Tecnólogo ADSI', inst: 'SENA', fecha: '2020 – 2023', nota: 'Análisis y Desarrollo de Sistemas de Información.' },
    { titulo: 'Técnico Desarrollo de Software', inst: 'SENA', fecha: '2019 – 2020', nota: 'Fundamentos en lógica de programación y bases de datos.' },
    { titulo: 'Subcampeón Nacional SenaSoft', inst: 'SENA Mosquera', fecha: '2021', nota: 'Segundo puesto a nivel nacional en competencias de desarrollo demostrando capacidad de trabajo bajo presión.', link: 'https://www.facebook.com/SENAMosqueraOficial/photos/234115825376074' }
  ];

  // ==========================================
  // ESTADOS Y REFERENCIAS
  // ==========================================
  zorroVideoSaludoSaludo = true;
  zorroVideoConocimientos = true;
  segundos = 6;
  totalFrames = 232;

  preloadedFramesClaro: HTMLImageElement[] = [];
  preloadedFramesOscuro: HTMLImageElement[] = [];

  @ViewChild('zorroVideoSaludoSaludo') zorroVideoSaludo!: ElementRef<HTMLVideoElement>;
  @ViewChild('scrollImage', { static: true }) scrollImageRef!: ElementRef<HTMLImageElement>;
  @ViewChild('scrollContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  @ViewChildren('card') cards!: QueryList<ElementRef>;
  @ViewChildren('proyCard') proyCards!: QueryList<ElementRef>;
  @ViewChildren('estItem') estItems!: QueryList<ElementRef>;
  @ViewChildren('contItem') contItems!: QueryList<ElementRef>;

  constructor() {}

  // Detecta si el viewport es móvil/tablet (< 992px)
  private get isMobile(): boolean {
    return window.innerWidth < 992;
  }

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
    this.iniciarLoader();
  }

  ngAfterViewInit(): void {
    this.preloadFrames();
    this.setupVideoObserver();
    this.inicializarVideoScroll();
    
    setTimeout(() => {
      this.animacionCard();
      this.setupScrollAnimations();
      this.setupNarrativaScroll();
    }, 2800);

    gsap.fromTo('.blur-layer',
      { backdropFilter: 'blur(20px)', background: 'rgba(0, 0, 0, 0.2)' },
      {
        backdropFilter: 'blur(0px)', background: 'rgba(255,255,255,0)',
        scrollTrigger: {
          trigger: '.modelo3d', start: 'top 8%', end: 'top 30%', scrub: true
        }
      }
    );
  }

  iniciarLoader(): void {
    const overlay = document.getElementById('loaderOverlay');
    if (!overlay) return;

    gsap.delayedCall(2.5, () => {
      gsap.to(overlay, {
        opacity: 0, 
        duration: 0.8, 
        ease: 'power2.inOut',
        onComplete: () => {
          overlay.style.display = 'none';
          document.body.style.overflow = ''; 
          this.animarEntradaHero();
        }
      });
    });
  }

  private animarEntradaHero(): void {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo('.zorro-wrapper', { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 1 })
      .fromTo('.hero-text-anim', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }, '-=0.5');
  }

  private setupScrollAnimations(): void {
    document.querySelectorAll<HTMLElement>('.titulo-animado').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 35 }, {
        opacity: 1, y: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
      });
    });

    if (this.proyCards.length) {
      const els = this.proyCards.toArray().map(c => c.nativeElement);
      gsap.fromTo(els, { opacity: 0, y: 60, scale: 0.95 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.2)', stagger: 0.2,
        scrollTrigger: { trigger: els[0], start: 'top 85%', toggleActions: 'play none none reverse' }
      });
    }

    if (this.estItems.length) {
      const els = this.estItems.toArray().map(i => i.nativeElement);
      gsap.fromTo(els, { opacity: 0, x: -50 }, {
        opacity: 1, x: 0, duration: 0.8, ease: 'power2.out', stagger: 0.2,
        scrollTrigger: { trigger: els[0], start: 'top 85%', toggleActions: 'play none none reverse' }
      });
    }

    if (this.contItems.length) {
      const els = this.contItems.toArray().map(i => i.nativeElement);
      gsap.fromTo(els, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.2)', stagger: 0.15,
        scrollTrigger: { trigger: els[0], start: 'top 88%', toggleActions: 'play none none reverse' }
      });
    }
  }

  animacionCard() {
    this.cards.forEach((cardRef: ElementRef, index: number) => {
      const el = cardRef.nativeElement;
      const animationStep = index % 4;
      let fromVars: any = { opacity: 0, scale: 0.8 };

      if (animationStep === 0) fromVars.x = -80;
      else if (animationStep === 3) fromVars.x = 80;
      else fromVars.y = 80;

      gsap.fromTo(el, fromVars, {
        x: 0, y: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
      });
    });
  }

  private setupNarrativaScroll(): void {
    const ncards = [
      document.getElementById('ncard0'),
      document.getElementById('ncard1'),
      document.getElementById('ncard2'),
      document.getElementById('ncard3'),
    ].filter(Boolean) as HTMLElement[];

    if (!ncards.length) return;

    // En móvil: las 4 ncards se muestran apiladas visibles (CSS las controla).
    // No registramos ningún ScrollTrigger para evitar el bug de superposición
    // y el conflicto con el scroll táctil del sistema.
    if (this.isMobile) {
      ncards.forEach(card => {
        card.classList.add('active');
        card.style.opacity = '1';
        card.style.position = 'relative';
        card.style.transform = 'none';
      });
      return;
    }

    const container = this.containerRef.nativeElement;
    let currentIdx = 0;
    ncards[0].classList.add('active');
    gsap.set(ncards[0], { opacity: 1, y: 0 });

    const activar = (idx: number) => {
      if (idx === currentIdx) return;
      const prev = ncards[currentIdx];
      const next = ncards[idx];

      gsap.to(prev, { opacity: 0, y: -30, duration: 0.4, onComplete: () => prev.classList.remove('active') });
      next.classList.add('active');
      gsap.fromTo(next, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
      currentIdx = idx;
    };

    ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      onUpdate: (self) => {
        const p = self.progress;
        if (p >= 0.75) activar(3);
        else if (p >= 0.50) activar(2);
        else if (p >= 0.25) activar(1);
        else activar(0);
      }
    });
  }

  iniciarDesde(): void {
    const video = this.zorroVideoSaludo?.nativeElement;
    if(video) { video.currentTime = this.segundos; this.segundos = 0; }
  }

  private setupVideoObserver(): void {
    setTimeout(() => {
      const video = document.getElementById('zorroVideoConocimientos') as HTMLVideoElement;
      const caja = document.getElementById('contenedorVideoConocimientos');
      if(!video || !caja) return;

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            caja.classList.remove('opacity-0');
            caja.classList.add('animate__animated', 'animate__bounceInRight');
            video.currentTime = 0;
            video.play().catch(()=>{});
            setTimeout(() => caja.classList.remove('animate__bounceInRight'), 1000);
          } else {
            caja.classList.add('opacity-0');
            video.pause();
            video.currentTime = 0;
          }
        });
      }, { threshold: 0.2 });
      observer.observe(video);
    }, 500);
  }

  checkTime(zorro: string): void {
    if (zorro === 'saludo' && this.zorroVideoSaludo?.nativeElement.currentTime >= 6) this.zorroVideoSaludo.nativeElement.pause();
    if (zorro === 'conocimientos') {
      const video = document.getElementById('zorroVideoConocimientos') as HTMLVideoElement;
      if (video && video.currentTime >= 5.7) video.pause();
    }
  }

  reproducir(video: string): void {
    if (video === 'saludo') {
      this.zorroVideoSaludoSaludo = false;
      setTimeout(() => this.zorroVideoSaludoSaludo = true, 100);
    }
    if (video === 'conocimientos') {
      const v = document.getElementById('zorroVideoConocimientos') as HTMLVideoElement;
      if (v) { v.currentTime = 0; v.play().catch(()=>{}); }
    }
  }

  videoSrcConocimientos() {
    return this.modoOscuro ? './assets/misConocimientosModoOscuro.mp4' : './assets/conocimientos.mp4';
  }

  preloadFrames(): void {
    // En móvil no hay animación de scroll de frames: evitar
    // cargar 480 imágenes innecesariamente (memoria + red).
    if (this.isMobile) return;

    for (let i = 0; i < 240; i++) {
      const padded = String(i).padStart(3, '0');
      const imgClaro = new Image(); imgClaro.src = `assets/scroll-video/frame_${padded}.jpg`;
      const imgOscuro = new Image(); imgOscuro.src = `assets/scroll-video-oscuro/frame_${padded}.jpg`;
      this.preloadedFramesClaro.push(imgClaro);
      this.preloadedFramesOscuro.push(imgOscuro);
    }
  }

  framePath(index: number): string {
    const padded = String(index).padStart(3, '0');
    this.totalFrames = this.modoOscuro ? 240 : 232;
    return this.modoOscuro ? `assets/scroll-video-oscuro/frame_${padded}.jpg` : `assets/scroll-video/frame_${padded}.jpg`;
  }

  inicializarVideoScroll(): void {
    // En móvil la narrativa es columna única: no hay columna derecha "sticky",
    // el ScrollTrigger de 350vh rompe el layout y el scrub compite con el
    // scroll táctil. Se muestra la primera frame estáticamente.
    if (this.isMobile) {
      const image = this.scrollImageRef?.nativeElement;
      if (image) image.src = this.framePath(0);
      return;
    }

    const image = this.scrollImageRef.nativeElement;
    const container = this.containerRef.nativeElement;
    const obj = { frame: 0 };

    gsap.to(obj, {
      frame: () => this.totalFrames - 1,
      ease: 'none',
      scrollTrigger: { trigger: container, start: 'top top', end: 'bottom bottom', scrub: 0.5 },
      onUpdate: () => {
        const currentFrame = Math.floor(obj.frame);
        const images = this.modoOscuro ? this.preloadedFramesOscuro : this.preloadedFramesClaro;
        if (images[currentFrame]?.src) image.src = images[currentFrame].src;
      }
    });
  }
}