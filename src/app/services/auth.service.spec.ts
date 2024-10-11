import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { ListaInterface } from '../models/lista-tarefa';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiList = 'http://localhost:3000/lista';

  const mockTask: ListaInterface = {
    id: '1',
    name: 'Test Task',
    updatedBy: 'User',
    updateDate: new Date(),
    endDate: new Date(),
    status: 'Em andamento'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica se todas as requisições foram satisfeitas
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a task (adicionarLista)', () => {
    service.adicionarLista(mockTask).subscribe((response) => {
      expect(response).toEqual(mockTask);
    });

    const req = httpMock.expectOne(apiList);
    expect(req.request.method).toBe('POST');
    req.flush(mockTask);
  });

  it('should get the task list (getLista)', () => {
    const mockTaskList: ListaInterface[] = [mockTask];

    service.getLista().subscribe((response) => {
      expect(response.length).toBe(1);
      expect(response).toEqual(mockTaskList);
    });

    const req = httpMock.expectOne(apiList);
    expect(req.request.method).toBe('GET');
    req.flush(mockTaskList);
  });

  it('should get a task by ID (getTarefaPorId)', () => {
    service.getTarefaPorId('1').subscribe((response) => {
      expect(response).toEqual(mockTask);
    });

    const req = httpMock.expectOne(`${apiList}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);
  });

  it('should delete a task (deletarTarefa)', () => {
    service.deletarTarefa('1').subscribe((response) => {
      expect(response).toEqual(mockTask);
    });

    const req = httpMock.expectOne(`${apiList}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockTask);
  });

  it('should edit a task (editarTarefa)', () => {
    service.editarTarefa(mockTask).subscribe((response) => {
      expect(response).toEqual(mockTask);
    });

    const req = httpMock.expectOne(`${apiList}/${mockTask.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockTask);
  });
});
