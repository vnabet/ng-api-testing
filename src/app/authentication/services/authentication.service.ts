import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { ILoginPayload } from '../models/login-payload';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IToken } from '../models/token';
import { IJWT } from '../models';
import { AccesstokenToJWTConverter } from '../converters/accesstoken-to-jwt.service';

/**
 * Service d'authentification
 */
@Injectable()
export class AuthenticationService implements OnDestroy {

  // Urls de login
  private _urlLoginV2:string = 'v2/access-tokens/';
  private _urlLoginV1:string = 'v1/access-tokens/';

  // Token
  private _token:IToken | null = null;
  // JWT, traduit depuis le token
  private _jwt:IJWT | null = null;

  // Erreur éventuellement levée lors du login
  private _error:Subject<string> = new Subject();
  public error$:Observable<string> = this._error.asObservable();

  // Pour la désouscription des observables
  private destroy$ = new Subject();

  constructor(private http:HttpClient, private _tokenToJWT:AccesstokenToJWTConverter) {
    // On récupère éventuellement le token depuis le localstorage
    const tokenls = localStorage.getItem('token');

    // On initialise le token et le jwt depuis la valeur du localstorage
    if(tokenls) {
      this._token = JSON.parse(tokenls);
      this._jwt = this._token?this._tokenToJWT.decode(this._token.accessToken):null;
    }
  }

  /**
   * Connexion à l'api en V2
   * @param payload informations de connexion
   */
  loginV2(payload:ILoginPayload) {

    //réinitialisation de l'erreur
    this._error.next('');

    // On passe le payload à l'api
    this.http.post<IToken>(this._urlLoginV2, payload)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      // Mise à jour du token et du jwt
      next: token => {
        this._token = token;
        localStorage.setItem('token', JSON.stringify(token));
        this._jwt = this._tokenToJWT.decode(token.accessToken);
      },
      // En cas d'erreur on met à jour l'observable des erreurs
      error: (error:HttpErrorResponse) => {
        if(error.status === 401) {
          this._error.next('utilisateur ou mot de passe incorrect');
        } else {
          this._error.next('Erreur inconnue lors de la connexion');
        }
      }
    })
  }

  /**
   * Déconnexion
   */
  logout() {
    // On supprime les informations locales
    this._token = null;
    localStorage.removeItem('token');
    this._jwt = null;
  }

  ngOnDestroy(): void {
    // On pense à faire le ménage
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
