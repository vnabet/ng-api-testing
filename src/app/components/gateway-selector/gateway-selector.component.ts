import { Component, OnDestroy, OnInit, forwardRef, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { GatewaysService } from 'src/app/core';
import { GatewayDialogComponent } from '../gateway-dialog/gateway-dialog.component';

/**
 * Sélecteur de Gateway
 * Implémente ControlValueAccessor pour être compatible avec les forms angular
 * Ce composant souscrit au service GatewaysService pour remplir la liste
 */
@Component({
  selector: 'app-gateway-selector',
  templateUrl: './gateway-selector.component.html',
  styleUrls: ['./gateway-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: forwardRef(() => GatewaySelectorComponent)
    }
  ]
})
export class GatewaySelectorComponent implements ControlValueAccessor, OnInit, OnDestroy {

  //Gateway sélectionnée
  gateway:string = '';

  private _gatewaysSub!:Subscription;

  // Fonctions par défaut de l'implémentation ControlValueAccessor
  onChange = (gateway:string) => {};
  onTouched = () => {};

  // Implémentation de ControlValueAccessor
  touched = false;
  disabled = false;

  // Référence du template de la modal de confirmation de réinitialisation de la liste des gateways
  @ViewChild('deleteConfirmationDialog', {read: TemplateRef}) deleteConfirmationDialog!:TemplateRef<any>;

  constructor(public gateways:GatewaysService, private dialog:MatDialog) {
  }

  ngOnInit(): void {
    // Souscription à la valeur courante de la gateway depuis le GatewaysService
    this._gatewaysSub = this.gateways.current$
      .subscribe((gateway:string) => {
        console.log('COUCOU')
        //Astuce pour éviter l'erreur NG0100: ExpressionChangedAfterItHasBeenCheckedError
        //if(!this.gateway)
        setTimeout(() => {this.onGatewayChange(gateway, false); this.onChange(gateway);});
        this.gateway = gateway;
      })
  }

  ngOnDestroy(): void {
    // On oublie pas de faire le ménage
    this._gatewaysSub.unsubscribe();
  }

  /**
   * Fonction de mise à jour de la gateway courante
   * @param gateway gateway courante à mettre à jour
   * @param touched est-ce que la mise à jour est faite par l'utilisateur
   */
  onGatewayChange(gateway:string, touched:boolean = true) {
    console.log('COUCOU2')
    if(touched) this._markAsTouched();
    this.gateways.setCurrent(gateway);
  }

  // Implémentation de ControlValueAccessor
  writeValue(gateway: string) {
    //Ne fait rien pour le moment puisque le champ est en lecture seule
    //et sa valeur courante est gérée par les service GatewaysService
    //this.gateway = gateway;
  }

  // Implémentation de ControlValueAccessor
  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  // Implémentation de ControlValueAccessor
  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  // La valeur du composant a été modifié
  private _markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  /**
   * Ouverture de la fenêtre de modification de la liste des Gateways
   */
  openGatewaysDialog() {
    this.dialog.open(GatewayDialogComponent)
  }

  /**
   * Gestion de la réinitialisation de la liste des Gateways
   * @param dialogValidated true si on confirme la réinitialisation
   */
  resetGateways(dialogValidated:boolean = false) {
    // On a confirmé la modale
    if(dialogValidated) {
      // Alors on réinitialise la liste
      this.gateways.reset();
    } else {
      // Autrement c'est que l'on n'a pas ouvert la modale alors on l'ouvre
      this.dialog.open(this.deleteConfirmationDialog)
    }
  }

}
