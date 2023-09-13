import { DomainsService } from './authentication/services/domains.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpStateService } from './core';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounce, debounceTime, distinctUntilChanged, filter, map } from 'rxjs';
import { IDomain } from './authentication/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'api-testing';




  constructor(public httpState:HttpStateService) {

    // this.domains.current.subscribe((d) => console.log('CURRENT', d));
    // this.domains.list.subscribe((l) => console.log('LIST', l))

  }

  ngOnInit(): void {



  }

  test() {
    //this.domains.clientId = 'ISAES22236T';
  }


}
