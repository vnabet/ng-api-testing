import { combineLatestWith, Observable, map, Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthenticationService, DomainsService } from 'src/app/authentication';
import { HttpStateService, greaterThan } from 'src/app/core';


/**
 * Service associé au formulaire de connexion
 */
@Injectable({
  providedIn: 'root'
})
export class LoginFormService implements OnDestroy {

  // Pour la desouscription aux observables
  private readonly destroy$ = new Subject();

  // Validateurs par défaut des champs du formulaire
  private _validators = [
    Validators.required
  ]

  // FormControls auxquels on va souscrire sur les changements
  private _clientId = new FormControl<string>(localStorage.getItem('clientId') ?? '', {validators: this._validators});
  private _domainId = new FormControl<number>(0, {validators: [...this._validators, greaterThan(0)]});
  private _userLogin = new FormControl<string>(localStorage.getItem('userLogin') || '', {validators: this._validators});

  // Construction du formulaire
  loginForm = this.fb.group({
    gateway: new FormControl<string>('', {validators: this._validators}),
    domainId: this._domainId,
    dataSetLabel: new FormControl<string>(''),
    clientId: this._clientId,
    userLogin: this._userLogin,
    userPassword: new FormControl<string>('', {validators: this._validators})
  })

  // Observable pour désactiver le submit du formulaire
  // Il est désactivé si on est en chargement http (des domaines) ou si le formulaire est invalide
  submitDisabled$:Observable<boolean> = this.loginForm.valueChanges.pipe(
    combineLatestWith(this.httpState.loading),
    map(([values, load]) => load || this.loginForm.invalid ),
  )

  // Liste des domaines
  domains$ = this.domains.list$;

  constructor(
    private fb:FormBuilder,
    private domains:DomainsService,
    private authentication:AuthenticationService,
    private httpState:HttpStateService,
  ) {

    // Lorsque l'on modifie le login, on le stocke en localstorage
    this._userLogin.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((userLogin) => {
      if(userLogin) {
        localStorage.setItem('userLogin', userLogin);
      } else {
        localStorage.removeItem('userLogin');
      }
    })


    // Lorsque le domaine courant est modifié par le service des domaines
    this.domains.current$
    .pipe(takeUntil(this.destroy$))
    .subscribe((domain) => {
      // On a un domaine et le champ n'est pas encore ou n'est plus (valeur 0) initialisé
      if(domain && (this._domainId.value === 0 || this._domainId.value !== domain.domainId)) {
        // On met à jour le champ du domaine avec le domaine courant
        this._domainId.patchValue(domain.domainId);
      } else {

        // Pas de domaine courant, on réinitialise la valeur du champ à 0
        if(!domain) this._domainId.patchValue(0);
      }
    })

    // Lorsque l'on change le domaine depuis le champ du formulaire
    this._domainId.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(domainId => {
      // On met à jour la valeur courante dans le service des domaines
      if(domainId) this.domains.setCurrent(domainId);
    })

    // Lorsque l'on renseigne le champ clientId
    this._clientId.valueChanges
    .pipe(
      takeUntil(this.destroy$),
      // debounce de 500ms sur la saisie
      debounceTime(500),
      // la valeur est différente de la précédente
      distinctUntilChanged(),
      // On supprime les espaces superflus
      map(v => v?.trim())
    )
    .subscribe(clientId => {
      // Si le clientId a une taille de 3 caractères ou plus
      if(!!clientId && clientId.length >= 3) {
        // On met à jour la valeur en localstorage
        localStorage.setItem('clientId', clientId)
        // On informe le service des domaines que le clientId a été modifié => chargement http des domaines
        this.domains.clientId = clientId;
      } else {
        // Sinon on supprime le clientId du localstorage
        localStorage.removeItem('clientId')
        // Et on réinitialise les domaines sur le service des domaines
        this.domains.clear();
      }
    })
  }

  ngOnDestroy(): void {
    // On pense à faire le ménage
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  /**
   * Submit du formulaire
   */
  submit() {
    // Le formulaire doit être valide
    if(this.loginForm.valid) {
      // On s'authentifie
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
