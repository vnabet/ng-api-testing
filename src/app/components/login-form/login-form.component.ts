import { Component } from '@angular/core';
import { LoginFormService } from './login-form.service';

/**
 * TODO Ajouter les commentaire
 * TODO Remonter l'erreur à la connexion
 */
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {

  constructor(
    public loginFormService:LoginFormService
    ){
  }

  onSubmit() {
    this.loginFormService.submit();
  }

}
