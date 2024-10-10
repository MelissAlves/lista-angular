import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Adicionado
import { ModalComponent } from '../../components/modal/modal.component';
import { AuthService } from '../../services/auth.service';
import { ListaInterface } from '../../models/lista-tarefa';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar // Adicionado
  ) {}

  listas: ListaInterface[] = [];
  filteredListas: ListaInterface[] = []; // Lista filtrada para exibição
  searchTerm = '';
  itemsPerPage = 5;
  currentPage = 1;
  totalItems = 0;
  noResultsFound: boolean = false;

  ngOnInit(): void {
    this.authService.getLista().subscribe(
      (data) => {
        if (data && Array.isArray(data)) { // Verifique se data é um array
          this.listas = data; // Atribua diretamente se for um array
        } else {
          console.warn('A lista está vazia ou não é um array:', data);
          this.listas = []; // Caso não seja um array, inicialize como um array vazio
        }
        this.filteredListas = [...this.listas];
        this.totalItems = this.filteredListas.length;
      },
      (error) => {
        console.error('Erro ao buscar a lista de tarefas:', error);
      }
    );
  }

  searchTable(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredListas = [...this.listas]; // Restaura a lista original
      this.noResultsFound = false;
    } else {
      this.filteredListas = this.listas.filter(lista =>
        lista.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        lista.updatedBy.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        lista.status.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.formatDate(lista.updateDate).includes(this.searchTerm) ||
        this.formatDate(lista.endDate).includes(this.searchTerm)
      );
      this.noResultsFound = this.filteredListas.length === 0;
    }
    this.currentPage = 1;
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('pt-BR', options).format(new Date(date));
  }

  get paginatedList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredListas.slice(start, start + this.itemsPerPage);
  }

  goToFirstPage() {
    this.currentPage = 1;
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
  }

  get totalPages() {
    return Math.ceil(this.listas.length / this.itemsPerPage);
  }

  openDialog(lista: ListaInterface): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '250px',
      data: { id: lista.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteList(lista.id);
      }
    });
  }

  deleteList(id: number): void {
    this.authService.deletarTarefa(id).subscribe(
      () => {
        // Se a exclusão for bem-sucedida
        this.listas = this.listas.filter(lista => lista.id !== id);
        this.filteredListas = this.filteredListas.filter(lista => lista.id !== id);
        this.totalItems = this.filteredListas.length;
        this.showSnackBar('Item excluído com sucesso!', 'Fechar');
      },
      error => {
        // Se ocorrer um erro na exclusão
        console.error('Erro ao excluir a lista:', error);
        this.showSnackBar('Erro ao excluir o item. Tente novamente.', 'Fechar');
      }
    );
  }

  showSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // duração do alerta em milissegundos
      verticalPosition: 'top', // posição vertical
      horizontalPosition: 'center' // posição horizontal
    });
  }
}
