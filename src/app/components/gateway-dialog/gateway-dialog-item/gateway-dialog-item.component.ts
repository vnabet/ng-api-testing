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

  @Input()
  gateway:string = '';

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

  edit() {
    this.editMode = true;
  }

  save() {
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

  delete() {
    this.deleteClicked = true;
  }

}
