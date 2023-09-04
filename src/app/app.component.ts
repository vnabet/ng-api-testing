import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GatewaysService, HttpStateService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'api-testing';

  constructor(private http:HttpClient, public gateways:GatewaysService, public httpState:HttpStateService) {

  }

  ngOnInit(): void {
    //this.http.get('bpi/currentprice.json').subscribe(() => {
    this.http.get('https://api.coindesk.com/v1/bpi/currentprice.json').subscribe(() => {
      console.log('ESSAI FREE')
    })
  }


}
