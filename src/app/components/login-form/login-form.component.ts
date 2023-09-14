import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Subject, takeUntil, tap, combineLatestWith, switchMap, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication';
import { DomainsService } from 'src/app/authentication/services/domains.service';
import { HttpStateService, greaterThan } from 'src/app/core';
import { LoginFormService } from './login-form.service';

/**
 * TODO Ajouter les commentaire
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
