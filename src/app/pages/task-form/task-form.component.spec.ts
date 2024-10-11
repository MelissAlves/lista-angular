import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListaInterface } from '../../models/lista-tarefa';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: ''
})
class MockHeaderComponent {}

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockActivatedRoute: any;

  const mockTask: ListaInterface = {
    id: '1',
    name: 'Test Task',
    updatedBy: 'Test User',
    updateDate: new Date(),
    endDate: new Date(),
    status: 'Em andamento'
  };

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getLista', 'adicionarLista', 'editarTarefa']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null)
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, MatSnackBarModule, BrowserAnimationsModule],
      declarations: [TaskFormComponent, MockHeaderComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in add mode if no taskId is provided', () => {
    expect(component.isEditMode).toBe(false);
  });

  it('should initialize in edit mode if taskId is provided', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
    mockAuthService.getLista.and.returnValue(of([mockTask]));

    component.ngOnInit();

    expect(component.isEditMode).toBe(true);
    expect(component.task).toEqual(mockTask);
  });

  it('should handle task not found scenario in edit mode', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('999');
    mockAuthService.getLista.and.returnValue(of([]));

    component.ngOnInit();

    expect(component.task.name).toBe('');
  });

  it('should save a new task', () => {
    const taskList = [{ id:' 1', name: 'Existing Task', updatedBy: 'User', updateDate: new Date(), endDate: new Date(), status: 'Em andamento' }];
    mockAuthService.getLista.and.returnValue(of(taskList));
    mockAuthService.adicionarLista.and.returnValue(of(mockTask));

    component.onSubmit();

    expect(mockAuthService.adicionarLista).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/task']);
  });

  it('should edit an existing task', () => {
    component.isEditMode = true;
    mockAuthService.editarTarefa.and.returnValue(of(mockTask));

    component.onSubmit();

    expect(mockAuthService.editarTarefa).toHaveBeenCalledWith(component.task);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/task']);
  });

  it('should show error message on save task failure', () => {
    mockAuthService.adicionarLista.and.returnValue(throwError(() => new Error('Save failed')));

    component.onSubmit();

    expect(mockSnackBar.open).toHaveBeenCalledWith('Erro ao criar a tarefa: Save failed', 'Fechar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  });

  it('should navigate to /task on cancel', () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/task']);
  });

  it('should show error messages if form fields are empty on submit', () => {
    component.task = { id: '0', name: '', updatedBy: '', updateDate: new Date(), endDate: new Date(), status: '' };
    component.onSubmit();

    expect(mockAuthService.adicionarLista).not.toHaveBeenCalled();
    expect(mockAuthService.editarTarefa).not.toHaveBeenCalled();
  });
});
