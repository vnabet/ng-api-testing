import { Subscription } from 'rxjs';
import { Component, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IDomain } from 'src/app/authentication/models';
import { DomainsService } from 'src/app/authentication/services/domains.service';

/**
 * Sélecteur de domaine
 * Implémente ControlValueAccessor pour être compatible avec les forms angular
 * Ce composant souscrit au service DomainsService pour remplir la liste
 */
@Component({
  selector: 'app-domain-selector',
  templateUrl: './domain-selector.component.html',
  styleUrls: ['./domain-selector.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => DomainSelectorComponent)
  }]
})
export class DomainSelectorComponent implements ControlValueAccessor, OnInit, OnDestroy {

  //Valeur par défaut d'un domaine
  private readonly _defaultValue:IDomain = {
    domainId: '',
    name: ''
  };

  //Domaine sélectionné
  domain:IDomain = {
    ...this._defaultValue
  };

  private _domainsSub!:Subscription;

  constructor(public domains:DomainsService) {

  }

  ngOnInit(): void {
    this.domains.current$.subscribe((domain) => {
      //TODO
      if(domain) {
        this.domain = domain;
      } else {
        this.domain = {
          ...this._defaultValue
        }
      }
    })
  }

  ngOnDestroy(): void {
    //On n'oublie pas de faire le ménage
    this._domainsSub?.unsubscribe();
  }


  // Callback par défaut de l'implémentation ControlValueAccessor
  onChange = (domain:IDomain) => {};
  onTouched = () => {};

  /**
   * Implémentation de ControlValueAccessor
   * On fournit une nouvelle valeur au composant
   */
  writeValue() {

  }

  /**
   * Implémentation de ControlValueAccessor
   * Enregistrement d'un callback lorsque l'on modifie la valeur du composant
   */
  registerOnChange() {
    // On ne le permet pas
  }

  /**
   * Implémentation de ControlValueAccessor
   * Enregistrement d'un callback lorsque l'on focus le composant
   */
  registerOnTouched() {
    // On ne le permet pas
  }

}
