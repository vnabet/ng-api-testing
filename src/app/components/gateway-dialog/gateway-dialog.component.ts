import { Component, ElementRef, ViewChild } from '@angular/core';
import { GatewaysService } from 'src/app/core';

@Component({
  selector: 'app-gateway-dialog',
  templateUrl: './gateway-dialog.component.html',
  styleUrls: ['./gateway-dialog.component.scss']
})
export class GatewayDialogComponent {

  @ViewChild('input') input!:ElementRef;

  constructor(public gateways:GatewaysService) {

  }

  update(gateway:{oldValue:string, newValue:string}) {
    this.gateways.update(gateway.oldValue, gateway.newValue);
  }

  add(gateway:string) {
    const gw = gateway.trim();

    if(gw) {
      this.gateways.add(gw);
      (this.input.nativeElement as HTMLInputElement).value = '';
    }
  }

  delete(gateway:string) {
    if(gateway) {
      this.gateways.delete(gateway);
    }
  }
}
