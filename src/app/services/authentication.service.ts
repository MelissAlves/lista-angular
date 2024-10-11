import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../models/login';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apLogin = 'http://localhost:5000/usuarios';

  constructor(private http: HttpClient) {}

  registrar(usuario: Login) {
    usuario.token = Math.random().toString(36).substring(2);
    return this.http.post<Login>(this.apLogin, usuario);
  }

  login(email: string, password: string) {
    return this.http.get<Login[]>(`${this.apLogin}?email=${email}`).pipe(
      map((resposta: Login[]) => {
        if (resposta.length && resposta[0].password === password) {
          // Token gerado e armazenando token e name no sessionStorage
          const token = Math.random().toString(36).substring(2);
          sessionStorage.setItem('auth-token', token);
          sessionStorage.setItem('user-name', resposta[0].name);
          return true;
        }
        return false;
      })
    );
  }

  logout() {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('user-name');
  }

  obterUsuarioLogado() {
    return sessionStorage.getItem('user-name');
  }

  getUsuarios() {
    return this.http.get<Array<Login>>(this.apLogin);
  }
}
