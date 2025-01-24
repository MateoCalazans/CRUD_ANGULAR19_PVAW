import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PesquisaComponent } from '../pesquisa/pesquisa.component';
import {MatPaginator} from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { HttpClientModule,HttpClient} from '@angular/common/http';



interface Biblioteca {
  name: string;
  historia: string;
  price: number;
  tipos: string[];
  autores: string;
  edited: boolean;
  id: number;
}

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    MatCheckboxModule,
    PesquisaComponent,
    MatPaginator,
    MatDialogModule,
    HttpClientModule,
  ],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
})

export class ListaComponent {

  private http= inject(HttpClient);

  Biblioteca: Biblioteca[] = [];
  paginatedLivros: Biblioteca[] = [];
  itemsPerPage = 5;
  pageIndex=0;

  formData: any = { name: '', historia: '', price: null, tipos: [], autores: '' };
  TipoLivros: string[] = ['biografia', 'fantasia', 'infantil', 'suspense','terror','romance'];
  showForm: boolean = false;
  filteredLivros: Biblioteca[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.loadBiblioteca();
  }

  loadBiblioteca() {
    this.http.get<Biblioteca[]>('http://localhost:3000/biblioteca').subscribe({
      next: (data: Biblioteca[]) => {
        this.Biblioteca = data;
        this.filteredLivros = [...this.Biblioteca];
        this.updatePaginatedLivros();
      },
      error: (err: any) => {
        console.error('Erro ao carregar os livros:', err);
      },
    });
  }

  ngOnChanges() {
    this.updatePaginatedLivros();
  }


  updatePaginatedLivros() {
    if (!this.paginator) return;

    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;

    this.paginatedLivros = this.filteredLivros.slice(startIndex, endIndex);
  }

  filterLivros(selectedCategories: any) {
    this.filteredLivros = this.Biblioteca.filter(livro =>
      livro.tipos.some(tipos => selectedCategories[tipos]=== true)
    );
    this.pageIndex = 0; 
    this.updatePaginatedLivros(); 
  }

  
  pageChanged(event: any) {
    this.pageIndex = event.pageIndex;
    this.updatePaginatedLivros();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }


  addLivros() {
    this.http.get<any[]>('http://localhost:3000/biblioteca').subscribe((livros) => {
    const lastId = livros.length > 0 ? Math.max(...livros.map(livro => livro.id)) : 0;
    
    const newLivro = { ...this.formData, id: lastId + 1 };

    this.http.post('http://localhost:3000/biblioteca', newLivro).subscribe(() => {
      this.loadBiblioteca();
      this.formData = { name: '', historia: '', price: null, tipos: [], autores: '' };
      this.toggleForm();
      this.showForm = false;
    });
  });
  }

  onTiposChange(tipos: string, isChecked: boolean) {
    if (isChecked) {
      this.formData.tipos.push(tipos);
    } else {
      this.formData.tipos = this.formData.tipos.filter((t: string) => t !== tipos);
    }
  }

  deleteLivros(index: number): void {
    const livroToDelete = this.filteredLivros[index];
    console.log('ID do livro:', livroToDelete.id);
    this.http.delete(`http://localhost:3000/biblioteca/${livroToDelete.id}`).subscribe({
      next: () => {
        console.log('Livro deletado com sucesso');
        this.loadBiblioteca();
      },
      error: (err) => {
        console.error('Erro ao deletar livro:', err);
      }
    });
  }
  

  editLivros(index: number) {
    this.formData = { ...this.filteredLivros[index] };
    this.showForm = true;

    const livroToEdit = this.filteredLivros[index];
    this.http.put(`http://localhost:3000/biblioteca/${livroToEdit.name}`, this.formData).subscribe(() => {
      this.loadBiblioteca();
    });
  }
}