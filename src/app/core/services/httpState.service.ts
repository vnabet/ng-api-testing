import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class HttpStateService {

  private _loading:BehaviorSubject<boolean> = new BehaviorSubject(false);

  public loading:Observable<boolean> = this._loading.asObservable();

  constructor() { }

  load() {
    this._loading.next(true);
  }

  complete() {
    this._loading.next(false);
  }


}
