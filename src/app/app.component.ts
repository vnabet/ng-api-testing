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


  constructor(private http:HttpClient, public httpState:HttpStateService, private fb:FormBuilder) {

  }

  ngOnInit(): void {
    // this.http.get('bpi/currentprice.json').subscribe(() => {
    // //this.http.get('https://api.coindesk.com/v1/bpi/currentprice.json').subscribe(() => {
    //   console.log('ESSAI FREE')
    // })

    this.form.valueChanges.subscribe((v) => console.log('ccccc', v))

  }


}
