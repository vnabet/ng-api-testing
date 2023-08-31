import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class ApiInterceptorService implements HttpInterceptor {

  constructor() { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //^http(s)?:\/\/.*$

    //(?<!:)\/+ pour remplacer les /, //, /// ... par /

    const url = 'https://www.free.fr//klklm/frfr/ffff///fff/'

    console.log('MES', req.url, url.replace(/(?<!:)\/+/g, '/'), /^http(s)?:\/\/.*$/.test(url));
    return next.handle(req);
  }
}
