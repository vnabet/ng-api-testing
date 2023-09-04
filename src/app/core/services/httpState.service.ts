import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class HttpStateService {

  private _loading:BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _error:Subject<string> = new Subject();

  public loading:Observable<boolean> = this._loading.asObservable();
  public error:Observable<string> = this._error.asObservable();

  constructor() { }

  load() {
    this._loading.next(true);
  }

  complete() {
    this._loading.next(false);
  }

  catchError(err:HttpErrorResponse) {
    this._error.next(`${err.status} - ${err.message}`);
  }


}
