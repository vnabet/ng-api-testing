import { Component, ElementRef, ViewChild } from '@angular/core';
import { GatewaysService } from 'src/app/core';


/**
 * Fenêtre modale de gestion des Gateways
 */
@Component({
  selector: 'app-gateway-dialog',
  templateUrl: './gateway-dialog.component.html',
  styleUrls: ['./gateway-dialog.component.scss']
})
export class GatewayDialogComponent {

  // Champ d'ajout d'une Gateway
  @ViewChild('input') input!:ElementRef;

  constructor(public gateways:GatewaysService) {

  }

  /**
   * Mise à jour de la valeur d'une Gateway
   * @param gateway ancienne et nouvelle valeur
   */
  update(gateway:{oldValue:string, newValue:string}) {
    this.gateways.update(gateway.oldValue, gateway.newValue);
  }

  /**
   * Ajout d'une Gateway
   * @param gateway Valeur de la Gateway
   */
  add(gateway:string) {
    const gw = gateway.trim();

    if(gw) {
      this.gateways.add(gw);
      // On vide l'input une fois la Gateway ajoutée
      (this.input.nativeElement as HTMLInputElement).value = '';
    }
  }

  /**
   * Suppression d'une Gateway
   * @param gateway Valeur à supprimer
   */
  delete(gateway:string) {
    if(gateway) {
      this.gateways.delete(gateway);
    }
  }
}
