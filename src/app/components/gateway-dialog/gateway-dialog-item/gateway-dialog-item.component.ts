import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-gateway-dialog-item',
  templateUrl: './gateway-dialog-item.component.html',
  styleUrls: ['./gateway-dialog-item.component.scss']
})
export class GatewayDialogItemComponent {

  editMode:boolean = false;
  deleteClicked:boolean = false;

  @Output()
  update:EventEmitter<{oldValue:string, newValue:string}> = new EventEmitter();

  @Output()
  delete:EventEmitter<string> = new EventEmitter();

  @Input()
  gateway:string = '';

  @Input()
  displayDeleteBtn:boolean = true;

  private _input!:HTMLInputElement;

  @ViewChild('input')
  get input():HTMLInputElement {
    return this._input;
  };
  set input(el:ElementRef) {
    if(el) {
      this._input = el.nativeElement as HTMLInputElement;
      setTimeout(()=>el.nativeElement.focus());
    }
  }

  editGateway() {
    this.editMode = true;
  }

  saveGateway() {
    this.editMode = false;
    this.deleteClicked = false;
9
    const newValue:string = this._input.value.trim();

    if(newValue && newValue!==this.gateway) {
      const oldValue:string = this.gateway;
      this.gateway = newValue;
      this.update.emit({oldValue, newValue});
    }
  }

  deleteGateway() {
    if(this.deleteClicked) {
      this.delete.emit(this.gateway);
    } else {
      this.deleteClicked = true;
    }
  }

}
