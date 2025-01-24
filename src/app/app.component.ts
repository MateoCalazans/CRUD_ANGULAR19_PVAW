import { Component } from '@angular/core';
import { ListaComponent } from './lista/lista.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [ListaComponent], // Importando o componente standalone para não haver reclamação
})
export class AppComponent {
  title = 'app';
}

