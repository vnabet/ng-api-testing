import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

/**
 * Composant qui gère chaque ligne de la modale de gestion des Gateways
 */
@Component({
  selector: 'app-gateway-dialog-item',
  templateUrl: './gateway-dialog-item.component.html',
  styleUrls: ['./gateway-dialog-item.component.scss']
})
export class GatewayDialogItemComponent {

  // Flag pour savoir si est en mode édition
  editMode:boolean = false;
  // On supprime une gateway une fois que l'on a cliqué 2 fois sur le bouton de suppression
  // Ce flag permet de savoir que l'on a déjà cliqué une fois
  deleteClicked:boolean = false;

  // Évènement de mise à jour d'une gateway
  // On passe l'ancienne et le nouvelle valeur
  @Output()
  update:EventEmitter<{oldValue:string, newValue:string}> = new EventEmitter();

  // Événement de suppression d'une gateway
  @Output()
  delete:EventEmitter<string> = new EventEmitter();

  // Valeur de la gateway
  @Input()
  gateway:string = '';

  // Doit-on afficher le bouton de suppression
  // Non s'il n'y a plus qu'une seule gateway dans la liste de la modale
  @Input()
  displayDeleteBtn:boolean = true;

  // Input de mise à jour de la gateway
  // Il n'est pas toujours visible suivant le mode d'édition
  // On passe donc par un setter/getter pour le récupérer
  private _input!:HTMLInputElement;
  @ViewChild('input')
  get input():HTMLInputElement {
    return this._input;
  };
  set input(el:ElementRef) {
    if(el) {
      this._input = el.nativeElement as HTMLInputElement;
      // On met le focus dessus dès qu'il s'affiche
      setTimeout(()=>el.nativeElement.focus());
    }
  }

  /**
   * Passage en mode édition
   * Revient à afficher l'input de saisie
   */
  editGateway() {
    this.editMode = true;
  }

  /**
   * Sauvegarde de la gateway
   */
  saveGateway() {
    // On repasse en mode lecture
    this.editMode = false;
    // On annule l'éventuel premier click sur le bouton de suppression
    this.deleteClicked = false;

    const newValue:string = this._input.value.trim();

    // On s'assure que l'ancienne et la nouvelle valeur sont bien différentes
    if(newValue && newValue!==this.gateway) {
      const oldValue:string = this.gateway;
      this.gateway = newValue;
      // On emet l'évènement de mise à jour
      this.update.emit({oldValue, newValue});
    }
  }

  /**
   * Suppression de la gateway
   */
  deleteGateway() {
    // Seulement au second click sur le bouton !
    if(this.deleteClicked) {
      // On émet l'évènement de suppression
      this.delete.emit(this.gateway);
    } else {
      this.deleteClicked = true;
    }
  }

}
