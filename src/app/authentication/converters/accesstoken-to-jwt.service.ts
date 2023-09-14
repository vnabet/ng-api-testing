import { Injectable } from '@angular/core';
import { IJWT, IJWTDTO } from '../models/jwt';

/**
 * TODO Commentaires
 */
@Injectable()
export class AccesstokenToJWTConverter {

  public decode(token:string):IJWT {
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
