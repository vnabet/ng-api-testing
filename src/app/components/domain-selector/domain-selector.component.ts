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
  // private readonly _defaultValue:IDomain = {
  //   domainId: 0,
  //   name: ''
  // };

  //Domaine sélectionné
  domainId:number = 0;

  private _domainsSub!:Subscription;

  // callback par défaut de l'implémentation ControlValueAccessor
  onChange = (domain:IDomain) => {};
  onTouched = () => {};

  // Implémentation de ControlValueAccessor
  touched = false;
  disabled = false;

  constructor(public domains:DomainsService) {

  }

  ngOnInit(): void {
    this.domains.current$.subscribe((domain) => {
      //TODO
      if(domain) {
        this.domainId = domain.domainId;
      } else {
        this.domainId = 0;
      }
    })
  }

  ngOnDestroy(): void {
    //On n'oublie pas de faire le ménage
    this._domainsSub?.unsubscribe();
  }

  /**
   * Implémentation de ControlValueAccessor
   * On fournit une nouvelle valeur au composant
   */
  writeValue() {

  }

  /**
   * Implémentation de ControlValueAccessor
   * Enregistrement d'un callback lorsque l'on modifie la valeur du composant
   * @param onChange callback
  */
  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  /**
   * Implémentation de ControlValueAccessor
   * Enregistrement d'un callback lorsque l'on focus le composant
   * @param onTouched callback
   */
  registerOnTouched(onTouched:any) {
    this.onTouched = onTouched;
  }

  // La valeur du composant a été modifié
  private _markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

}
