import { Observable, ReplaySubject, Subject } from 'rxjs';
import { IEnvironment } from '../models';
import { ENVIRONMENT } from './../tokens';
import { Inject, Injectable } from '@angular/core';

/**
 * Service de gestion des gateways des appels à l'api
 */
@Injectable()
export class GatewaysService {

  private _listSubject:Subject<string[]> = new ReplaySubject<string[]>(1);
  private _list:string[] = [];
  //Liste des gateways
  list$:Observable<string[]> = this._listSubject.asObservable();

  private _currentSubject:Subject<string> = new ReplaySubject<string>(1);
  private _current:string = '';
  //Gateway courante qui est utilisée par les appels à l'api
  current$:Observable<string> = this._currentSubject.asObservable();

  constructor(@Inject(ENVIRONMENT)environment:IEnvironment) {
    //On récupère la liste des gateways ainsi que la gateway courante dans le localstorage
    const lsGateways:string|null = localStorage.getItem('gateways');
    const lsCurrent:string|null = localStorage.getItem('current_gateway');

    //Par défaut ce sera la liste qui est dans les fichiers d'environnement
    let gateways:string[] = [...(environment.gateways ?? [])];
    //Et la gateway courante par défaut sera la première de cette liste
    let current:string = gateways.length?gateways[0]:'';

    //On a bien une liste en localstorage
    if(lsGateways) {
      //Alors on utilisera plutôt celle là
      gateways = JSON.parse(lsGateways);
    }

    //On a bien une gateway courante dans le ls
    if(lsCurrent) {
      //Alors on utilisera plutôt celle là
      current = lsCurrent;
    }

    //Mise à jour de la liste et de la gateway courante
    this._updateGateways(gateways);
    this._updateCurrent(current);
  }

  /**
   * Ajout d'une gateway dans la liste
   * @param gateway Gateway à ajouter dans la liste
   */
  add(gateway:string) {
    const list = [...this._list, gateway];

    //Mise à jour de la liste
    this._updateGateways(list);
    //La gateway courante devient celle qui vient d'être ajoutée
    this._updateCurrent(gateway);
  }

  /**
   * Suppression d'une gateway de la liste
   * @param gateway Gateway à supprimer
   */
  delete(gateway:string) {

    const list = [...this._list];
    //On vérifie que la gateway existe bien dans la liste
    const index:number = list.indexOf(gateway);

    if(index > -1) {
      //On supprime la gateway de la liste
      list.splice(index, 1);
      //Mise à jour de la liste
      this._updateGateways(list);

      //Si la gateway courante était celle que l'on doit supprimer,
      //alors on la met à jour avec la première de la liste
      if(this._current === gateway) {
        this._updateCurrent(this._list.length?this._list[0]:'');
      }
    }
  }

  /**
   * Changement de la gateway courante
   * @param gateway Gateway à définir comme courante
   */
  setCurrent(gateway:string) {
    //Si cette gateway n'est pas dans la liste, on l'ajoute à la liste (elle deviendra alors la gateway courante)
    if(this._list.indexOf(gateway) === -1) {
      this.add(gateway);
    } else {
      //Sinon on met simplement à jour la gateway courante
      this._updateCurrent(gateway);
    }
  }

  /**
   * Mise à jour de la liste des gateways
   * @param list liste des gateways
   */
  private _updateGateways(list:string[]) {
    this._list = list;
    localStorage.setItem('gateways', JSON.stringify(list));
    this._listSubject.next(list);
  }

  /**
   * Mise à jour de la gateway courante
   * @param gateway Gateway à définir comme courante
   */
  private _updateCurrent(gateway:string) {
    if(this._current !== gateway) {
      this._current = gateway;
      localStorage.setItem('current_gateway', gateway);
      this._currentSubject.next(gateway);
    }
  }
}
