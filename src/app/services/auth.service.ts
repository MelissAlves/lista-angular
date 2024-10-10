import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListaInterface } from '../models/lista-tarefa';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiList = 'http://localhost:3000/lista'

  constructor(private http: HttpClient) { }

  adicionarLista(lista: ListaInterface) {
    return this.http.post<ListaInterface>(this.apiList, lista);
  }

  getLista(): Observable<ListaInterface[]> {
    return this.http.get<ListaInterface[]>(this.apiList);
  }

  // Obter uma tarefa específica usando a query string
  getTarefaPorId(id: number): Observable<ListaInterface> {
    return this.http.get<ListaInterface>(`${this.apiList}?id=${id}`);
  }

  deletarTarefa(id: number) {
    return this.http.delete<ListaInterface>(`${this.apiList}/${id}`);
  }

  editarTarefa(lista: ListaInterface) {
    return this.http.put<ListaInterface>(`${this.apiList}?id=${lista.id}`, lista);
  }
}
