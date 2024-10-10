import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formLogar! : FormGroup;
  mensagemErro = "";
  submetido = false;

  constructor(
    private fb: FormBuilder,
    private service: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formLogar = this.fb.group({
      email: ['',[ Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  btnInscrever(){
    this.router.navigateByUrl("/register")
  }

  logar(): void {
    this.submetido = true;
    if (this.formLogar.valid) {
      const form = this.formLogar.value;
      this.service.login(form.email, form.password).subscribe((resposta: boolean) => {
        if (resposta) {
          this.router.navigateByUrl("/task");
        } else {
          this.mensagemErro = "Usuário ou password inválido";
        }
      });
    }
  }
}
