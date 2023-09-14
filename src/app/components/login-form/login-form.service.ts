import { combineLatestWith, Observable, map, Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthenticationService, DomainsService } from 'src/app/authentication';
import { HttpStateService, greaterThan } from 'src/app/core';


/**
 * TODO Ajouter les commentaire
 */
@Injectable({
  providedIn: 'root'
})
export class LoginFormService implements OnDestroy {

  private readonly destroy$ = new Subject();

  private _validators = [
    Validators.required
  ]

  private _clientId = new FormControl<string>(localStorage.getItem('clientId') ?? '', {validators: this._validators});
  // domainId = new FormControl<number>({value: 0, disabled: true}, {validators: this._validators});
  private _domainId = new FormControl<number>(0, {validators: [...this._validators, greaterThan(0)]});
  private _userLogin = new FormControl<string>(localStorage.getItem('userLogin') || '', {validators: this._validators});

  loginForm = this.fb.group({
    gateway: new FormControl<string>('', {validators: this._validators}),
    domainId: this._domainId,
    dataSetLabel: new FormControl<string>(''),
    clientId: this._clientId,
    userLogin: this._userLogin,
    userPassword: new FormControl<string>('', {validators: this._validators})
  })

  submitDisabled$:Observable<boolean> = this.loginForm.valueChanges.pipe(
    combineLatestWith(this.httpState.loading),
    map(([values, load]) => load || this.loginForm.invalid ),
  )

  domains$ = this.domains.list$;

  constructor(
    private fb:FormBuilder,
    private domains:DomainsService,
    private authentication:AuthenticationService,
    private httpState:HttpStateService,
  ) {

    this._userLogin.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((userLogin) => {
      if(userLogin) {
        localStorage.setItem('userLogin', userLogin);
      } else {
        localStorage.removeItem('userLogin');
      }
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

  submit() {
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
