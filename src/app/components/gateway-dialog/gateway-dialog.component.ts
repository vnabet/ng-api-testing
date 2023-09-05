import { Component } from '@angular/core';
import { GatewaysService } from 'src/app/core';

@Component({
  selector: 'app-gateway-dialog',
  templateUrl: './gateway-dialog.component.html',
  styleUrls: ['./gateway-dialog.component.scss']
})
export class GatewayDialogComponent {

  constructor(public gateways:GatewaysService) {

  }

  update(gateway:{oldValue:string, newValue:string}) {
    console.log('mise à jour', gateway);

    this.gateways.update(gateway.oldValue, gateway.newValue);
  }

}
