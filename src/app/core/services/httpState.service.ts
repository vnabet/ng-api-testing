import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

/**
 * Service d'état des requêtes HTTP
 * Mis à jour grâce à l'intercepteur LoadingInterceptorService
 */
@Injectable()
export class HttpStateService {

  private _loading:BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _error:Subject<string> = new Subject();
  // liste de requêtes en cours
  // Rq: un compteur ne marche pas, car une requête peut être annulée
  private _requests:string[] = [];

  // A true si on a au moins une requête en cours
  public loading:Observable<boolean> = this._loading.asObservable();
  // Remonte les éventuelles erreurs
  public error:Observable<string> = this._error.asObservable();

  constructor() { }

  // On incrémente une requête
  load(request:string) {
    if(this._requests.indexOf(request) === -1) this._requests.push(request);
    this._loading.next(true);
  }

  // On décrémente les requêtes
  complete(request:string) {
    const index:number = this._requests.indexOf(request);
    if(index > -1) this._requests.splice(index, 1);
    // Si plus de requête en attente, on passe loading à false
    if(!this._requests.length) {
      this._loading.next(false);
    }
  }

  // Remontée des erreurs
  catchError(err:HttpErrorResponse) {
    this._error.next(`${err.status} - ${err.message}`);
  }


}
