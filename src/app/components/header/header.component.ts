import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  userName: string | null = null;
  isDarkMode: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.userName = this.authenticationService.obterUsuarioLogado() || 'Usuário Desconhecido';

    // Verificar o estado inicial
    const savedMode = localStorage.getItem('darkMode');
    this.isDarkMode = savedMode === 'true';

    // Aplicar o estado inicial do body
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    // Salvar a preferência do usuário
    localStorage.setItem('darkMode', this.isDarkMode.toString());

    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }

  deslogar() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
