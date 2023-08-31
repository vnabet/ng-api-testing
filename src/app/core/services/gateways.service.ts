import { Observable, ReplaySubject, Subject } from 'rxjs';
import { IEnvironment } from '../models';
import { ENVIRONMENT } from './../tokens';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class GatewaysService {

  private _list:Subject<string[]> = new ReplaySubject<string[]>(1);
  list$:Observable<string[]> = this._list.asObservable();

  private _current:Subject<string> = new ReplaySubject<string>(1);
  current$:Observable<string> = this._current.asObservable();

  constructor(@Inject(ENVIRONMENT)environment:IEnvironment) {
    const lsGateways:string|null = localStorage.getItem('gateways');
    const lsCurrent:string|null = localStorage.getItem('current_gateway');
    let gateways:string[] = [...(environment.gateways ?? [])];
    let current:string = gateways.length?gateways[0]:'';

    if(lsGateways) {
      gateways = JSON.parse(lsGateways);
    } else {
      localStorage.setItem('gateways', JSON.stringify(gateways));
    }

    if(lsCurrent) {
      current = lsCurrent;
    } else {
      localStorage.setItem('current_gateway', current)
    }


    this._list.next(gateways);
    this._current.next(current);

  }
}
