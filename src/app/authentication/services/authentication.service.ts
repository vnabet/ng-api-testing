import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { ILoginPayload } from '../models/login-payload';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IToken } from '../models/token';
import { IJWT } from '../models';
import { IJWTDTO } from '../models/jwt';

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

  constructor(private http:HttpClient) {
    const tokenls = localStorage.getItem('token');

    if(tokenls) {
      this._token = JSON.parse(tokenls);

      this._jwt = this._token?this._parseJwt(this._token.accessToken):null;

      console.log(this._jwt)
    }
  }

  loginV2(payload:ILoginPayload) {

    console.log('payload', payload);

    this.http.post<IToken>(this._urlLoginV2, payload)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: token => {
        this._token = token;
        localStorage.setItem('token', JSON.stringify(token));
        this._jwt = this._parseJwt(token.accessToken);

        console.log(this._jwt)
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
  }



  ngOnDestroy(): void {
      this.destroy$.next(null);
      this.destroy$.complete();
  }

  private _parseJwt(token:string):IJWT {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const dto:IJWTDTO = JSON.parse(jsonPayload);

    return {
      clientId : dto.ClientId,
      dataSetLabel: dto.DataSetLabel,
      domainId: this._filterDomainIds(dto.DomainId),
      domainName: dto.DomainName,
      email: dto.Email,
      exp: this._stringNumberToDate(dto.exp),
      firstName: dto.FirstName,
      iat: this._stringNumberToDate(dto.iat),
      id: dto.Id,
      isApplicationAdmin: dto.IsApplicationAdmin.toLowerCase()==='true'?true:false,
      isRoot: dto.IsRoot.toLowerCase()==='true'?true:false,
      iss: dto.iss,
      lastName: dto.LastName,
      login: dto.Login,
      nbf: this._stringNumberToDate(dto.nbf),
      radical: dto.Radical,
      userClientId: dto.UserClientId
    }
  }

  private _stringNumberToDate(value:string):Date {
    const num:number = parseInt(value) * 1000;

    return new Date(num);
  }

  private _filterDomainIds(ids:string[]):string[] {
    const result:string[] = [];

    ids.forEach((id:string) => {
      if(result.indexOf(id) === -1) result.push(id);
    })

    return result;
  }
}
