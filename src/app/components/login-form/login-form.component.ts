import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Subject, takeUntil, tap, combineLatestWith, switchMap, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication';
import { DomainsService } from 'src/app/authentication/services/domains.service';
import { HttpStateService, greaterThan } from 'src/app/core';

/**
 * TODO Ajouter les commentaire
 * TODO Sauvgarder le login
 */
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject();

  private _validators = [
    Validators.required
  ]


  private _clientId = new FormControl<string>(localStorage.getItem('clientId') ?? '', {validators: this._validators});

  // domainId = new FormControl<number>({value: 0, disabled: true}, {validators: this._validators});
  private _domainId = new FormControl<number>(0, {validators: [...this._validators, greaterThan(0)]});

  loginForm = this.fb.group({
    gateway: new FormControl<string>('', {validators: this._validators}),
    domainId: this._domainId,
    dataSetLabel: new FormControl<string>(''),
    clientId: this._clientId,
    userLogin: new FormControl<string>('', {validators: this._validators}),
    userPassword: new FormControl<string>('', {validators: this._validators})
  })

  submitDisabled$:Observable<boolean> = this.loginForm.valueChanges.pipe(
    combineLatestWith(this.httpState.loading),
    map(([values, load]) => load || this.loginForm.invalid ),
  )

  constructor(
    private fb:FormBuilder,
    public domains:DomainsService,
    private authentication:AuthenticationService,
    private httpState:HttpStateService,
    ){
  }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe((vc) => {
      console.log('FORM', vc, this.loginForm.getRawValue());
    })


    this.domains.current$
    .pipe(takeUntil(this.destroy$))
    .subscribe((domain) => {
      if(domain && (this._domainId.value === 0 || this._domainId.value !== domain.domainId)) {
        this._domainId.patchValue(domain.domainId);
      } else {

        if(!domain) this._domainId.patchValue(0);
      }
    })

    this._domainId.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(domainId => {
      if(domainId) this.domains.setCurrent(domainId);
    })

    this._clientId.valueChanges
    .pipe(
      takeUntil(this.destroy$),
      debounceTime(500),
      distinctUntilChanged(),
      map(v => v?.trim())
    )
    .subscribe(clientId => {
      if(!!clientId && clientId.length >= 3) {
        localStorage.setItem('clientId', clientId)
        this.domains.clientId = clientId;
      } else {
        localStorage.removeItem('clientId')
        this.domains.clear();
      }
    })
  }

  ngOnDestroy(): void {
      this.destroy$.next(null);
      this.destroy$.complete();
  }

  onSubmit() {
    if(this.loginForm.valid) {
      this.authentication.loginV2({
        clientId: this.loginForm.value.clientId || '',
        dataSetLabel: '',
        domainId: this.loginForm.value.domainId?.toString() || '',
        userLogin: this.loginForm.value.userLogin || '',
        userPassword: this.loginForm.value.userPassword || ''
      })
    }
  }

}
