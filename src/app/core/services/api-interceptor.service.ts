import { GatewaysService } from './gateways.service';
import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';

/**
 * Intercepteur de requêtes HTTP
 * Permet de compléter les url de requête avec la gateway de l'api
 */
@Injectable()
export class ApiInterceptorService implements HttpInterceptor {

  constructor(private gateways:GatewaysService) { }


  /**
   * Intercepte la requête pour ajouter la gateway à l'url
   * @param req requête
   * @param next handler http
   * @returns renvoie la requête à jour
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //On souscrit à la gateway courante
    return this.gateways.current$.pipe(
      take(1),
      switchMap((currentGateway:string) => {
        let url:string = req.url;
        //On vérifie toute de même que la requête ne commence pas par 'http(s)://
        //Dans l'affirmative, on ne touche pas à la requête
        if(!/^http(s)?:\/\/.*$/.test(url)) {
          //on ajoute la gateway à la requête
          url = currentGateway + '/' + url;
          //on supprimes les '/' superflus
          url = url.replace(/(?<!:)\/+/g, '/');
        }

        //On clone la requête avec la nouvelle url, si elle a été modifiée
        return next.handle(url === req.url?req:req.clone({url}));
    }))
  }
}
