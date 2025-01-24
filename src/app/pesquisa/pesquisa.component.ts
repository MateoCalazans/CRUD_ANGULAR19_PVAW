import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { MatCheckboxModule } from '@angular/material/checkbox'; 

@Component({
  selector: 'app-pesquisar',
  templateUrl: './pesquisa.component.html',
  styleUrl: './pesquisa.component.scss',
  standalone: true,
  imports: [FormsModule, MatCheckboxModule],  
})
export class PesquisaComponent {
  @Output() filter = new EventEmitter<any>();

  selectedCategories = {
    terror: false,
    fantasia: false,
    biografia: false,
    infantil: false,
    suspense: false,
    romance: false,
  };
  onCategoryChange() {
    this.filter.emit(this.selectedCategories);
  }
  filterGames() {
    console.log(this.selectedCategories);
  }
}
