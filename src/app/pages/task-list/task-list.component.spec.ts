import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ListaInterface } from '../../models/lista-tarefa';
import { HeaderComponent } from '../../components/header/header.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const mockTaskList = [
    { id: '1', name: 'Task 1', updatedBy: 'User 1', updateDate: new Date(), endDate: new Date(), status: 'Em andamento' },
    { id: '2', name: 'Task 2', updatedBy: 'User 2', updateDate: new Date(), endDate: new Date(), status: 'Concluida' },
    { id: '3', name: 'Task 3', updatedBy: 'User 3', updateDate: new Date(), endDate: new Date(), status: 'Cancelada' },
  ];


  const mockTask: ListaInterface = {
    id: '1',
    name: 'Test Task',
    updatedBy: 'Test User',
    updateDate: new Date(),
    endDate: new Date(),
    status: 'Em andamento'
  };

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getLista', 'deletarTarefa']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, HeaderComponent],
      declarations: [TaskListComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    mockAuthService.getLista.and.returnValue(of(mockTaskList));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the task list on initialization', () => {
    expect(component.listas).toEqual(mockTaskList);
    expect(component.filteredListas.length).toBe(3);
    expect(component.totalItems).toBe(3);
  });

  it('should filter the task list based on the search term', () => {
    component.searchTerm = 'Task 1';
    component.searchTable();
    expect(component.filteredListas.length).toBe(1);
    expect(component.filteredListas[0].name).toBe('Task 1');
  });

  it('should reset the filtered task list when the search term is empty', () => {
    component.searchTerm = '';
    component.searchTable();
    expect(component.filteredListas.length).toBe(3);
  });

  it('should show no results message when search returns no tasks', () => {
    component.searchTerm = 'Non-existent Task';
    component.searchTable();
    expect(component.filteredListas.length).toBe(0);
    expect(component.noResultsFound).toBeTrue();
  });

  it('should delete a task and update the list', () => {
    mockAuthService.deletarTarefa.and.returnValue(of(mockTask));
    const taskToDelete = mockTaskList[0];

    component.deleteList(taskToDelete.id);

    expect(mockAuthService.deletarTarefa).toHaveBeenCalledWith(taskToDelete.id);
    expect(component.listas.length).toBe(2);
    expect(component.filteredListas.length).toBe(2);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Item excluído com sucesso!', 'Fechar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  });

  it('should show an error message if task deletion fails', () => {
    mockAuthService.deletarTarefa.and.returnValue(throwError(() => new Error('Deletion failed')));

    component.deleteList('1');

    expect(mockSnackBar.open).toHaveBeenCalledWith('Erro ao excluir o item. Tente novamente.', 'Fechar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  });

  it('should open the dialog to confirm deletion', () => {
    const taskToDelete = mockTaskList[0];
    const mockDialogRef = { afterClosed: () => of(true) } as any;
    mockDialog.open.and.returnValue(mockDialogRef);

    component.openDialog(taskToDelete);

    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockAuthService.deletarTarefa).toHaveBeenCalledWith(taskToDelete.id);
  });

  it('should handle pagination correctly', () => {
    component.itemsPerPage = 2;
    component.goToNextPage();
    expect(component.currentPage).toBe(2);

    component.goToPreviousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should navigate to task creation page', () => {
    const navigateSpy = spyOn(component['router'], 'navigate');
    const createTaskButton = fixture.nativeElement.querySelector('.btn-create-task');
    createTaskButton.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/task/new']);
  });
});
