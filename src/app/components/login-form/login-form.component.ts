import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { DomainsService } from 'src/app/authentication/services/domains.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {


  clientId = new FormControl<string>('');

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
    this.domains.current$.subscribe((domain) => {
      //TODO
      if(domain && (this.domainId.value === 0 || this.domainId.value !== domain.domainId)) {
        this.domainId.patchValue(domain.domainId);
      } else {

        if(!domain) this.domainId.patchValue(0);
      }
    })

    this.domainId.valueChanges.subscribe(domainId => {
      if(domainId) this.domains.setCurrent(domainId);
    })

    this.clientId.valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      //filter(v => {return !!v && !!v.trim() && v.trim().length >= 3}),
      map(v => v?.trim())
    )
    .subscribe(clientId => {
      if(!!clientId && clientId.length >= 3) {
        this.domains.clientId = clientId;
      } else {
        this.domains.clear();
      }
    })
  }



}
