import { Observable, tap, catchError, throwError } from 'rxjs';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpStateService } from './httpState.service';

@Injectable()
export class LoadingInterceptorService implements HttpInterceptor {

  constructor(private loading:HttpStateService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loading.load();
    return next.handle(req).pipe(
      tap((event) => {
        if(event instanceof HttpResponse) this.loading.complete();
      }),
      catchError((err:HttpErrorResponse) => {
        this.loading.catchError(err);
        this.loading.complete();
        return throwError(()=> err);
      })
    )
  }
}
