import { Component, Renderer2, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { Render3DService } from './service/render3-d.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent],
  providers: [HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portafolio2025';
  cargandoModoOscuro = false

  isDarkMode = false;
  videoOscuro = false

 

  constructor(private renderer: Renderer2, public home: HomeComponent, private render3DService:Render3DService) { }

  toggleTheme(): void {
    this.cargandoModoOscuro = true;

    setTimeout(() => {
      const contenedor = document.getElementById('contenedorVideo')!;
      const video = document.getElementById('videoModoOscuro')!;

      video.classList.remove('opacity-0');
      video.classList.add('animate__bounceInLeft');

      contenedor.classList.remove('opacity-0');
      contenedor.classList.add('animate__bounceInLeft');

      setTimeout(() => {
        this.isDarkMode = !this.isDarkMode;
        this.refrecar3D()
        this.home.modoOscuro = this.isDarkMode;

        const themeClass = this.isDarkMode ? 'dark-theme' : 'light-theme';

        this.renderer.removeClass(document.body, 'light-theme');
        this.renderer.removeClass(document.body, 'dark-theme');
        this.renderer.addClass(document.body, themeClass);


      }, 1000);

      setTimeout(() => {
        video.classList.remove('animate__bounceInLeft');
        video.classList.add('animate__bounceOutRight');

        contenedor.classList.remove('animate__bounceInLeft');
        contenedor.classList.add('animate__bounceOutRight');

        setTimeout(() => {
          video.classList.add('opacity-0');
          video.classList.remove('animate__bounceOutRight');
          this.cargandoModoOscuro = false;

          contenedor.classList.add('opacity-0');
          contenedor.classList.remove('animate__bounceOutRight');


          this.videoOscuro = this.isDarkMode
        }, 1000);

      }, 5000);
    }, 100);
  }

  refrecar3D(){

    this.render3DService.setModoOscuro(this.isDarkMode)
  
    
  }

  ngOnInit() {
    // Activar tema claro por defecto
    this.renderer.addClass(document.body, 'light-theme');
  }



}
