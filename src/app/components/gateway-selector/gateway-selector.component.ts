import { Component,  OnDestroy,  OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, tap, take, Subscription } from 'rxjs';
import { GatewaysService } from 'src/app/core';
import { GatewayDialogComponent } from '../gateway-dialog/gateway-dialog.component';

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

  gateway:string = '';

  private _gatewaysSub!:Subscription;

  onChange = (gateway:string) => {};

  onTouched = () => {};

  touched = false;

  disabled = false;

  constructor(public gateways:GatewaysService, private dialog:MatDialog) {
  }

  ngOnInit(): void {

    //this.current$ = this.gateways.current$
    this._gatewaysSub = this.gateways.current$
      .subscribe((gateway:string) => {
        //Astuce pour éviter l'erreur NG0100: ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {this.onGatewayChange(gateway, false); this.onChange(gateway);});
        this.gateway = gateway;
      })
  }

  ngOnDestroy(): void {
      this._gatewaysSub.unsubscribe();
  }

  onGatewayChange(gateway:string, touched:boolean = true) {
    if(touched) this._markAsTouched();
    this.gateways.setCurrent(gateway);
  }

  writeValue(gateway: string) {
    //Ne fait rien pour le moment puisque le champ est en lecture seule
    //et sa valeur courante est gérée par les service GatewaysService
    //this.gateway = gateway;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  private _markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  openGatewayDialog() {
    this.dialog.open(GatewayDialogComponent)
  }

}
