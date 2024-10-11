import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TaskListComponent } from './task-list.component';
import { ModalComponent } from '../../components/modal/modal.component';

class MockAuthService {
  getLista() {
    return of([{ id: '1', name: 'Task 1', updatedBy: 'User 1', updateDate: new Date(), endDate: new Date(), status: 'Concluida' }]);
  }

  deletarTarefa(id: string) {
    return of(null);
  }
}

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

class MockMatSnackBar {
  open() {}
}

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let authService: AuthService;
  let dialog: MatDialog;
  let snackBar: MatSnackBar;
  let router: Router;

  beforeEach(async () => {
    TestBed.overrideProvider(AuthService, { useValue: new MockAuthService() });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [TaskListComponent, ModalComponent],
      providers: [
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: MatSnackBar, useClass: MockMatSnackBar }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    dialog = TestBed.inject(MatDialog);
    snackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch tasks on init', () => {
    const getListaSpy = spyOn(authService, 'getLista').and.callThrough();
    component.ngOnInit();
    expect(getListaSpy).toHaveBeenCalled();
    expect(component.listas.length).toBeGreaterThan(0);
  });

  it('should handle empty task list gracefully', () => {
    component.ngOnInit();

    expect(component.listas);
    expect(component.filteredListas);
    expect(component.totalItems).toEqual(1);
  });

  it('should filter tasks based on search term', () => {
    component.searchTerm = 'Task 1';
    component.searchTable();
    expect(component.filteredListas.length).toBe(1);
    expect(component.noResultsFound).toBeFalse();
  });

  it('should show no results when search term does not match', () => {
    component.searchTerm = 'Non-existent task';
    component.searchTable();
    expect(component.filteredListas.length).toBe(0);
    expect(component.noResultsFound).toBeTrue();
  });

  it('should open the delete dialog and delete task', () => {
    const deleteTaskSpy = spyOn(component, 'deleteList').and.callThrough();
    const openDialogSpy = spyOn(dialog, 'open').and.callThrough();
    component.openDialog({ id: '1', name: 'Task 1', updatedBy: 'User 1', updateDate: new Date(), endDate: new Date(), status: 'Concluida' });

    expect(openDialogSpy).toHaveBeenCalled();
    expect(deleteTaskSpy).toHaveBeenCalledWith('1');
  });

  it('should handle delete task error', () => {
    const errorService = new MockAuthService();
    spyOn(errorService, 'deletarTarefa').and.returnValue(throwError('Error deleting task'));
    spyOn(snackBar, 'open');
    component.deleteList('1');

    expect(snackBar.open);
  });


  it('should show success message when task is deleted', () => {
    spyOn(snackBar, 'open');
    component.deleteList('1');
    expect(snackBar.open).toHaveBeenCalledWith('Item excluído com sucesso!', 'Fechar', jasmine.any(Object));
  });
});
