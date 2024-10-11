import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../models/login';
import { AuthenticationService } from '../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  formulario!: FormGroup;
  submetido = false;

  constructor(
    private fb: FormBuilder,
    private service: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.formulario = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[!@#$%¨&*])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[!@#$%¨&*])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]),
    });
  }

  formularioHasErrors(): boolean {
    let errors = 0;
    if ((this.formulario.get('name')?.touched || this.submetido) && this.formulario.get('name')?.errors?.['required']) {
      errors++;
    }
    if ((this.formulario.get('email')?.touched || this.submetido) && this.formulario.get('email')?.errors?.['required']) {
      errors++;
    }
    if ((this.formulario.get('password')?.touched || this.submetido) && this.formulario.get('password')?.errors?.['required']) {
      errors++;
    }
    if ((this.formulario.get('passwordConfirm')?.touched || this.submetido) && this.formulario.get('passwordConfirm')?.errors?.['required']) {
      errors++;
    }
    return errors > 0;
  }

  registrar(): void {
    console.log(this.formulario.controls);
    this.submetido = true;

    if (this.formulario.valid) {
      const form = this.formulario.value;
      const id = Math.floor(Date.now() * Math.random());
      const usuario: Login = {
        id: id,
        name: form.name,
        email: form.email,
        password: form.password,
        token: Math.random().toString(36).substring(2)
      };

      this.service.registrar(usuario).subscribe({
        next: () => {
          this.router.navigateByUrl("/login");
        },
        error: (err) => {
          console.error('Erro ao registrar usuário:', err);
          this.snackBar.open('Erro ao registrar usuário. Tente novamente!', 'Fechar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      });
    } else {
      console.warn('Formulário inválido:', this.formulario.errors);
    }
  }
}
