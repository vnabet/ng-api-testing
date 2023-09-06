import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DomainsService {

  constructor(private http:HttpClient) { }

  test() {
    // this.http.get('bpi/currentprice.json').subscribe(() => {
    // //this.http.get('https://api.coindesk.com/v1/bpi/currentprice.json').subscribe(() => {
    //   console.log('ESSAI FREE')
    // })

    return this.http.get('bpi/currentprice.json');
  }
}
