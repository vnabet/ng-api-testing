import { DomainsService } from './authentication/services/domains.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpStateService } from './core';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounce, debounceTime, distinctUntilChanged, filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'api-testing';


  clientId = new FormControl<string>('');

  form = this.fb.group({
    gateway: new FormControl<string>(''),
    clientId: this.clientId
  })


  constructor(public httpState:HttpStateService, private fb:FormBuilder, private domains:DomainsService) {

    // this.domains.current.subscribe((d) => console.log('CURRENT', d));
    // this.domains.list.subscribe((l) => console.log('LIST', l))

  }

  ngOnInit(): void {

    //this.form.valueChanges.subscribe((v) => console.log('ccccc', v))

    this.clientId.valueChanges
    .pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      //filter(v => {return !!v && !!v.trim() && v.trim().length >= 3}),
      map(v => v?.trim())
    )
    .subscribe(clientId => {
      if(!!clientId && clientId.trim().length >= 3) {
        this.domains.clientId = clientId;
      }
    })

  }

  test() {
    this.domains.clientId = 'ISAES22236T';
  }


}
