import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ILoginPayload } from '../models/login-payload';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IToken } from '../models/token';
import { IJWT } from '../models';
import { AccesstokenToJWTService } from '../converters/accesstoken-to-jwt.service';

/**
 * TODO Commentaires
 * TODO Faire un convertisseur pour le jeton
 */
@Injectable()
export class AuthenticationService implements OnDestroy {

  private _urlLoginV2:string = 'v2/access-tokens/';
  private _urlLoginV1:string = 'v1/access-tokens/';

  private _token:IToken | null = null;
  private _jwt:IJWT | null = null;

  private _error:Subject<string> = new Subject();
  public error:Observable<string> = this._error.asObservable();

  private destroy$ = new Subject();

  constructor(private http:HttpClient, private _tokenToJWT:AccesstokenToJWTService) {
    const tokenls = localStorage.getItem('token');

    if(tokenls) {
      this._token = JSON.parse(tokenls);

      this._jwt = this._token?this._tokenToJWT.decode(this._token.accessToken):null;
    }
  }

  loginV2(payload:ILoginPayload) {

    this.http.post<IToken>(this._urlLoginV2, payload)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: token => {
        this._token = token;
        localStorage.setItem('token', JSON.stringify(token));
        this._jwt = this._tokenToJWT.decode(token.accessToken);
      },
      error: (error:HttpErrorResponse) => {
        if(error.status === 401) {
          this._error.next('utilisateur ou mot de passe incorrect');
        } else {
          this._error.next('Erreur inconnue lors de la connexion');
        }
      }
    })
  }

  logout() {
    this._token = null;
    localStorage.removeItem('token');
    this._jwt = null;
  }



  ngOnDestroy(): void {
      this.destroy$.next(null);
      this.destroy$.complete();
  }
}
