import { NgClass } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren, Input } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  @Input() modoOscuro = false;

  conocimientosArray = [
    { nombre: "HTML", imagen: "https://portafolio-puk64inbr-kevinfrile.vercel.app/assets/html.svg", descripcion: "Lo utilizo para estructurar el contenido de páginas web." },
    { nombre: "CSS", imagen: "https://portafolio-puk64inbr-kevinfrile.vercel.app/assets/css.svg", descripcion: "Lo uso para darle estilo y diseño visual a las interfaces web." },
    { nombre: "JavaScript", imagen: "https://portafolio-puk64inbr-kevinfrile.vercel.app/assets/js.svg", descripcion: "Lenguaje con el que añado interactividad y lógica a las aplicaciones web." },
    { nombre: "MySQL", imagen: "https://portafolio-puk64inbr-kevinfrile.vercel.app/assets/mysql.svg", descripcion: "Lo utilizo para gestionar bases de datos relacionales y hacer consultas." },
    { nombre: "Angular", imagen: "https://portafolio-puk64inbr-kevinfrile.vercel.app/assets/angular.svg", descripcion: "Framework que utilizo para desarrollar aplicaciones web SPA robustas." },
    { nombre: "Ionic", imagen: "https://portafolio-puk64inbr-kevinfrile.vercel.app/assets/ionic.svg", descripcion: "Lo uso para crear aplicaciones móviles híbridas con tecnologías web." },
    { nombre: "Bootstrap", imagen: "https://portafolio-puk64inbr-kevinfrile.vercel.app/assets/bootstrap.svg", descripcion: "Framework que utilizo para construir interfaces web responsivas rápidamente." },
    { nombre: "", imagen: "", descripcion: "" },
    { nombre: "Figma", imagen: "https://portafolio-puk64inbr-kevinfrile.vercel.app/assets/figma.svg", descripcion: "Herramienta que utilizo para diseñar prototipos UI/UX de interfaces." },
    { nombre: "Spline", imagen: "https://portafolio-puk64inbr-kevinfrile.vercel.app/assets/spline.svg", descripcion: "Lo uso para crear y animar elementos 3D interactivos para la web." },
    { nombre: "GSAP", imagen: "https://portafolio-puk64inbr-kevinfrile.vercel.app/assets/gsap.svg", descripcion: "Librería que utilizo para hacer animaciones fluidas y personalizadas en sitios web." },
    { nombre: "Python", imagen: "https://img.icons8.com/ios7/600/FFFFFF/python.png", descripcion: "Lenguaje que uso para lógica backend, automatización y procesamiento de datos." },
    { nombre: "Flask", imagen: "https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/3/flask-oabo4nn8vibtrqvucoolel.png/flask-bcpzvlxe9vryvu8v3etb.png?_a=DATAdtAAZAA0", descripcion: "Microframework de Python que utilizo para crear APIs y servicios web." }
  ];

  zorroVideoSaludoSaludo = true;
  zorroVideoConocimientos = true;

  segundos = 6;
  videoDuration = 8;

  @ViewChild('zorroVideoSaludoSaludo') zorroVideoSaludo!: ElementRef<HTMLVideoElement>;
  @ViewChild('zorroVideoConocimientos', { static: true }) zorroVideoConocimiento!: ElementRef<HTMLVideoElement>;
  @ViewChild('scrollImage', { static: true }) scrollImageRef!: ElementRef<HTMLImageElement>;
  @ViewChild('scrollContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('card') cards!: QueryList<ElementRef>;

  totalFrames = 232;
  preloadedImages: HTMLImageElement[] = [];

  ngAfterViewInit(): void {
    this.preloadFrames().then(() => {
      this.inicializarVideoScroll();
    });

    this.setupVideoObserver();
    this.animacionCard();
  }

  async preloadFrames(): Promise<void> {
    this.preloadedImages = [];

    this.totalFrames = this.modoOscuro ? 240 : 232;

    const promises = [];

    for (let i = 0; i < this.totalFrames; i++) {
      const padded = String(i).padStart(3, '0');
      const path = this.modoOscuro
        ? `assets/scroll-video-oscuro/frame_${padded}.jpg`
        : `assets/scroll-video/frame_${padded}.jpg`;

      const img = new Image();
      img.src = path;

      const promise = new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // evita que una imagen falle todo
      });

      this.preloadedImages.push(img);
      promises.push(promise);
    }

    await Promise.all(promises);
  }

  iniciarDesde(): void {
    const video = this.zorroVideoSaludo.nativeElement;
    video.currentTime = this.segundos;
    this.segundos = 0;
  }

  private setupVideoObserver(): void {
    const video = document.getElementById('zorroVideoConocimientos') as HTMLVideoElement;
    const caja = document.getElementById('contenedorVideoConocimientos')!;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        video.currentTime = 0;
        video.play();

        if (entry.isIntersecting) {
          caja.classList.remove('opacity-0');
          caja.classList.add('animate__bounceInRight');
          setTimeout(() => caja.classList.remove('animate__bounceInRight'), 1000);
        } else {
          caja.classList.add('opacity-0');
          video.currentTime = 0;
        }
      });
    }, { threshold: 0.1 });

    observer.observe(video);
  }

  checkTime(zorro: string): void {
    if (zorro === 'saludo' && this.zorroVideoSaludo?.nativeElement.currentTime >= 6) {
      this.zorroVideoSaludo.nativeElement.pause();
    }

    if (zorro === 'conocimientos') {
      const video = document.getElementById('zorroVideoConocimientos') as HTMLVideoElement;
      if (video.currentTime >= 5.7) video.pause();
    }
  }

  reproducir(video: string): void {
    if (video === 'saludo') {
      this.zorroVideoSaludoSaludo = false;
      setTimeout(() => this.zorroVideoSaludoSaludo = true, 100);
    }

    if (video === 'conocimientos') {
      setTimeout(() => this.ngAfterViewInit(), 100);
    }
  }

  videoSrcConocimientos() {
    return this.modoOscuro
      ? './assets/misConocimientosModoOscuro.mp4'
      : './assets/conocimientos.mp4';
  }

  inicializarVideoScroll(): void {
    const image = this.scrollImageRef.nativeElement;
    const container = this.containerRef.nativeElement;

    const obj = { frame: 0 };

    gsap.to(obj, {
      frame: this.totalFrames - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5
      },
      onUpdate: () => {
        const currentFrame = Math.floor(obj.frame);
        const preloaded = this.preloadedImages[currentFrame];
        if (preloaded?.src) {
          image.src = preloaded.src;
        }
      }
    });
  }

  animacionCard(): void {
    this.cards.forEach((cardRef: ElementRef, index: number) => {
      const el = cardRef.nativeElement;

      const animationStep = index % 4;
      let fromVars: any = { opacity: 0 };

      switch (animationStep) {
        case 0: fromVars.x = -100; break;
        case 1:
        case 2: fromVars.y = 100; break;
        case 3: fromVars.x = 100; break;
      }

      gsap.fromTo(
        el,
        fromVars,
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom 10%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );
    });
  }
}
