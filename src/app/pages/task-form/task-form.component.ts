import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ListaInterface } from '../../models/lista-tarefa';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  task: ListaInterface = {
    id: 0, // Inicialize como 0, será atualizado ao criar
    name: '',
    updatedBy: '',
    updateDate: new Date(),
    endDate: new Date(),
    status: ''
  };
  isEditMode = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    console.log('ID da Tarefa:', taskId);
    if (taskId) {
      this.isEditMode = true;
      this.authService.getLista().subscribe((lista: ListaInterface[]) => {
        console.log('Lista de Tarefas:', lista);
        const taskToEdit = lista.find(task => task.id === Number(taskId));
        if (taskToEdit) {
          this.task = { ...taskToEdit };
          console.log('Tarefa encontrada:', taskToEdit); // Mostra a tarefa encontrada
        } else {
          console.log('Tarefa não encontrada');
        }
      });
    }
  }

  onSubmit(): void {
    if (!this.task.name || !this.task.updatedBy || !this.task.updateDate || !this.task.endDate || !this.task.status) {
      return;
    }

    // Atribuir novo ID se não estiver em modo de edição
    if (!this.isEditMode) {
      this.authService.getLista().subscribe((lista: ListaInterface[]) => {
        const existingIds = lista.map(task => task.id);
        this.task.id = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1; // Atribuir novo ID
        this.saveTask();
      });
    } else {
      this.saveTask();
    }
  }

  private saveTask(): void {
    const saveTask$ = this.isEditMode
      ? this.authService.editarTarefa(this.task)
      : this.authService.adicionarLista(this.task);

    saveTask$.subscribe(() => {
      this.showSnackBar('Tarefa criada com sucesso!', 'Fechar');
      this.router.navigate(['/task']);
    }, (error) => {
      this.showSnackBar('Erro ao criar a tarefa: ' + error.message, 'Fechar');
    });
  }

  showSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  onCancel(): void {
    this.router.navigate(['/task']);
  }
}
