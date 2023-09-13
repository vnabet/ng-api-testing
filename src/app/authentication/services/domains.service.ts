import { Subscription, Subject, Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { IDomain } from '../models';

/**
 * Service de gestion des domaines
 */
@Injectable()
export class DomainsService implements OnDestroy {

  // Url du service de récupération des domaines
  private _url:string = '/domains/';
  //private _url:string = 'http://localhost:4200/assets/domains.json';

  //ClientId
  private _clientId:string = '';
  get clientId():string {
    return this._clientId;
  }

  set clientId(value:string) {
    this._clientId = value.trim();
    //Quand on met à jour le clientId, on charge les domaines
    this._getDomains();
  }

  // Liste des domaines
  private _listSubject:Subject<IDomain[]> = new ReplaySubject<IDomain[]>(1);
  private _list:IDomain[] = [];
  list$:Observable<IDomain[]> = this._listSubject.asObservable();

  // Domaine courant
  private _sub!:Subscription;
  private _currentSubject:Subject<IDomain | null> = new ReplaySubject<IDomain | null>(1)
  current$:Observable<IDomain | null> = this._currentSubject.asObservable();

  constructor(private http:HttpClient) {
    // On récupère, par défaut la liste et le domaine courant dans le localStorage
    const domainsls = localStorage.getItem('domains');

    if(domainsls) {
      this._updateDomains(JSON.parse(domainsls) as IDomain[]);
    } else {
      this._updateDomains([]);
    }

    const currentls = localStorage.getItem('current_domain');

    if(currentls) {
      this._updateCurrent(JSON.parse(currentls) as IDomain);
    } else {
      this._updateCurrent(null);
    }
  }


  /**
   * Récupération de la liste des domaines en fonction du clientId
   */
  private _getDomains():void {
    if(this._clientId) {
      // Permet d'annuler une éventuelle requête en cours
      if(this._sub) this._sub.unsubscribe();

      this._sub = this.http.get<IDomain[]>(`${this._url}${this._clientId}`)
      //this._sub = this.http.get<IDomain[]>(`${this._url}`)
      .subscribe((domains:IDomain[]) => {
        // Mise à jour de la liste des domaines
        this._updateDomains(domains);
        // Mise à jour du domaine courant
        this._updateCurrent(domains.length?domains[0]:null);
      })

    }
  }

  /**
   * Mise à jour du domaine courant
   * @param domainId Id du domaine
   */
  setCurrent(domainId:number) {
    if(this._list) {
      const current = this._list.find((domain) => domain.domainId === domainId);

      if(current) {
        this._updateCurrent(current);
      }
    }
  }

  /**
   * réinitialisation les domaine
   */
  clear() {
    this._updateDomains([]);
    this._updateCurrent(null);
  }

  ngOnDestroy(): void {
    // On oublie pas de faire le ménage
    if(this._sub) this._sub.unsubscribe();
  }

  /**
   * Mise à jour de la liste des domaines
   * @param domains liste de domaines
   */
  _updateDomains(domains:IDomain[]) {
    this._list = domains;
    localStorage.setItem('domains', JSON.stringify(domains));
    this._listSubject.next(domains);
  }

  /**
   * Mise à jour du domaine courant
   * @param domain Domaine courant
   */
  _updateCurrent(domain:IDomain | null) {
    if(domain) {
      localStorage.setItem('current_domain', JSON.stringify(domain));
    } else {
      // s'il est nul, on supprime l'éventuelle entrée dans le localStorage
      localStorage.removeItem('current_domain');
    }
    this._currentSubject.next(domain);

  }
}
