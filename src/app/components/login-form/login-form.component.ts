import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';
import { DomainsService } from 'src/app/authentication/services/domains.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject();


  clientId = new FormControl<string>(localStorage.getItem('clientId') ?? '');

  domainId = new FormControl<number>(0);

  form = this.fb.group({
    gateway: new FormControl<string>(''),
    domainId: this.domainId,
    dataSetLabel: new FormControl<string>(''),
    clientId: this.clientId,
    userLogin: new FormControl<string>(''),
    userPassword: new FormControl<string>('')
  })

  constructor(private fb:FormBuilder, public domains:DomainsService){

  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((vc) => console.log('FORM', vc))


    this.domains.current$
    .pipe(takeUntil(this.destroy$))
    .subscribe((domain) => {
      //TODO
      if(domain && (this.domainId.value === 0 || this.domainId.value !== domain.domainId)) {
        this.domainId.patchValue(domain.domainId);
      } else {

        if(!domain) this.domainId.patchValue(0);
      }
    })

    this.domainId.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(domainId => {
      if(domainId) this.domains.setCurrent(domainId);
    })

    this.clientId.valueChanges
    .pipe(
      takeUntil(this.destroy$),
      debounceTime(500),
      distinctUntilChanged(),
      //filter(v => {return !!v && !!v.trim() && v.trim().length >= 3}),
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



}
