import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GatewaysService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'api-testing';

  constructor(private http:HttpClient, public gateways:GatewaysService) {
    //console.log('gateways', gateways.list)
    this.gateways.list$.subscribe
    ((rr) => console.log('RRRRRR', rr))

  }

  ngOnInit(): void {
    this.http.get('https://api.apis.guru/v2/list.json').subscribe(() => {
      console.log('ESSAI FREE')
    })
  }


}
