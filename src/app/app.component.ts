
import { Component, OnInit } from '@angular/core';
import { HttpStateService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'api-testing';




  constructor(public httpState:HttpStateService) {

  }

  ngOnInit(): void {



  }

  test() {
    //this.domains.clientId = 'ISAES22236T';
  }


}
