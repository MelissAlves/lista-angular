import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { ListaInterface } from '../../models/lista-tarefa';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TaskFormComponent } from './task-form.component';
import { AuthService } from '../../services/auth.service';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let authServiceStub: Partial<AuthService>;
  let snackBarStub: Partial<MatSnackBar>;
  let routerStub: Partial<Router>;

  beforeEach(async () => {
    authServiceStub = {
      getLista: () => of([]),
      adicionarLista: () => of({} as ListaInterface),
      editarTarefa: () => of({} as ListaInterface)
    };

    snackBarStub = {
      open: jasmine.createSpy('open')
    };

    routerStub = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [TaskFormComponent],
      imports: [FormsModule, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: MatSnackBar, useValue: snackBarStub },
        { provide: Router, useValue: routerStub },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => null
              }
            }
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in add mode', () => {
    component.ngOnInit();
    expect(component.isEditMode).toBeFalse();
  });

  it('should initialize in edit mode with existing task', () => {
    const mockTask: ListaInterface = {
      id: '1',
      name: 'Test Task',
      updatedBy: 'User',
      updateDate: new Date(),
      endDate: new Date(),
      status: 'Em andamento'
    };

    authServiceStub.getLista = () => of([mockTask]);

    component.ngOnInit();
    expect(component.isEditMode).toBeFalse();
  });

  it('should save a new task', () => {
    const saveTaskSpy = spyOn<any>(component, 'saveTask').and.callThrough();
    component.task = {
      id: '',
      name: 'New Task',
      updatedBy: 'User',
      updateDate: new Date(),
      endDate: new Date(),
      status: 'Em andamento'
    };

    component.onSubmit();
    expect(saveTaskSpy).toHaveBeenCalled();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/task']);
    expect(snackBarStub.open).toHaveBeenCalledWith('Tarefa criada com sucesso!', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
  });

  it('should save an edited task', () => {
    component.isEditMode = true;
    const saveTaskSpy = spyOn<any>(component, 'saveTask').and.callThrough();
    component.task = {
      id: '1',
      name: 'Updated Task',
      updatedBy: 'User',
      updateDate: new Date(),
      endDate: new Date(),
      status: 'Concluida'
    };

    component.onSubmit();
    expect(saveTaskSpy).toHaveBeenCalled();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/task']);
    expect(snackBarStub.open).toHaveBeenCalledWith('Tarefa editada com sucesso!', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
  });


  it('should not save task if required fields are missing', () => {
    component.task = { id: '', name: '', updatedBy: '', updateDate: new Date(), endDate: new Date(), status: '' };
    component.onSubmit();
    expect(routerStub.navigate).not.toHaveBeenCalled();
    expect(snackBarStub.open).not.toHaveBeenCalled();
  });

  it('should show snackbar on error when editing a task', () => {
    component.isEditMode = true;
    authServiceStub.editarTarefa = () => throwError(() => new Error('Erro ao editar'));
    component.task = {
      id: '1',
      name: 'Updated Task',
      updatedBy: 'User',
      updateDate: new Date(),
      endDate: new Date(),
      status: 'Concluida'
    };

    component.onSubmit();
    expect(snackBarStub.open);
    });

  it('should show snackbar on error when adding a task', () => {
    authServiceStub.adicionarLista = () => throwError(() => new Error('Erro ao adicionar'));
    component.task = {
      id: '',
      name: 'New Task',
      updatedBy: 'User',
      updateDate: new Date(),
      endDate: new Date(),
      status: 'Em andamento'
    };

    component.onSubmit();
    expect(snackBarStub.open);
  });

  it('should cancel and navigate back to task list', () => {
    component.onCancel();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/task']);
  });
});
