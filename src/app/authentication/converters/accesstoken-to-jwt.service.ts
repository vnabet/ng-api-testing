import { Injectable } from '@angular/core';
import { IJWT, IJWTDTO } from '../models/jwt';

/**
 * Convertisseur d'un access token vers un JWT
 */
@Injectable()
export class AccesstokenToJWTConverter {

  /**
   * Méthode de conversion
   * @param token access token
   * @returns JWT
   */
  public decode(token:string):IJWT {
    // Trouvé sur le net, cet algo qui transforme l'access token en base 64 vers un objet json (JWT)
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const dto:IJWTDTO = JSON.parse(jsonPayload);

    // On transforme l'objet traduit en JWT métier
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

  /**
   * Transformation d'une chaîne, représentant un timestamp, en `Date`
   * @param value valeur de la date, sous forme d'entier dans une chaîne
   * @returns une date au format `Date`
   */
  private _stringNumberToDate(value:string):Date {
    const num:number = parseInt(value) * 1000;
    return new Date(num);
  }

  /**
   * Supprime les doublons de la liste des domaines
   * @param ids liste des domaines
   * @returns liste des domaines sans doublon
   */
  private _filterDomainIds(ids:string[]):string[] {
    const result:string[] = [];

    ids.forEach((id:string) => {
      if(result.indexOf(id) === -1) result.push(id);
    })

    return result;
  }
}
