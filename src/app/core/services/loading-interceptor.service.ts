import { Observable, tap, catchError, throwError } from 'rxjs';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpStateService } from './httpState.service';

/**
 * Intercepteur de requête HTTP
 * Permet de connaître l'état de chargement des requête via le service HttpStateService
 */
@Injectable()
export class LoadingInterceptorService implements HttpInterceptor {

  constructor(private loading:HttpStateService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //Quand une requête est en route
    //On prévient le service HttpStateService qu'on est en chargement
    this.loading.load(req.url);
    return next.handle(req).pipe(
      tap((event) => {
        // Fin de la requête
        if(event instanceof HttpResponse) this.loading.complete(req.url);
      }),
      catchError((err:HttpErrorResponse) => {
        // On remonte l'erreur
        this.loading.catchError(err);
        // Et fin de la requête
        this.loading.complete(req.url);
        return throwError(()=> err);
      })
    )
  }
}
