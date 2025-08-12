import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Render3DService {

 // Inicializamos el valor de modoOscuroRender3D con false
  private modoOscuroSubject = new BehaviorSubject<boolean>(false);
  
  // Exponemos el Observable para que otros componentes puedan suscribirse
  public modoOscuroRender3D$ = this.modoOscuroSubject.asObservable();

  // Método para cambiar el estado del modo oscuro
  public setModoOscuro(isModoOscuro: boolean) {
    this.modoOscuroSubject.next(isModoOscuro);
  }


}
