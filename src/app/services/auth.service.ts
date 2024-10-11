import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListaInterface } from '../models/lista-tarefa';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiList = 'http://localhost:3000/lista';

  constructor(private http: HttpClient) { }

  adicionarLista(lista: ListaInterface) {
    return this.http.post<ListaInterface>(this.apiList, lista);
  }

  getLista(): Observable<ListaInterface[]> {
    return this.http.get<ListaInterface[]>(this.apiList);
  }

  getTarefaPorId(id: number): Observable<ListaInterface> {
    return this.http.get<ListaInterface>(`${this.apiList}/${id}`);
  }

  deletarTarefa(id: number) {
    // Usando query string para deletar
    return this.http.delete<ListaInterface>(`${this.apiList}?id=${id}`);
  }

  editarTarefa(lista: ListaInterface) {
    return this.http.put<ListaInterface>(`${this.apiList}/${lista.id}`, lista);
  }
}
