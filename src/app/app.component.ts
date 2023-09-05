import { DomainService } from './authentication/services/domain.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpStateService } from './core';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'api-testing';

  form = this.fb.group({
    gateway: new FormControl<string>('')
  })


  constructor(public httpState:HttpStateService, private fb:FormBuilder, private domain:DomainService) {

  }

  ngOnInit(): void {
    // this.http.get('bpi/currentprice.json').subscribe(() => {
    // //this.http.get('https://api.coindesk.com/v1/bpi/currentprice.json').subscribe(() => {
    //   console.log('ESSAI FREE')
    // })

    this.form.valueChanges.subscribe((v) => console.log('ccccc', v))

  }

  test() {
    this.domain.test().subscribe(() => console.log('klmklmkmk'))
  }


}
