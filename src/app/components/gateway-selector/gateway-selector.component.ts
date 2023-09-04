import { Component,  OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, tap, take } from 'rxjs';
import { GatewaysService } from 'src/app/core';

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
export class GatewaySelectorComponent implements ControlValueAccessor, OnInit {

  //gateway:string = '';

  onChange = (gateway:string) => {};

  onTouched = () => {};

  touched = false;

  disabled = false;

  current$:Observable<string> | null = null;

  constructor(public gateways:GatewaysService) {
  }

  ngOnInit(): void {

      this.current$ = this.gateways.current$
      .pipe(
        take(1),
        tap((gateway:string) => {
          //Astuce pour éviter l'erreur NG0100: ExpressionChangedAfterItHasBeenCheckedError
          setTimeout(() => this.onGatewayChange(gateway, false));
      }));
  }

  onGatewayChange(gateway:string, touched:boolean = true) {
    if(touched) this._markAsTouched();
    this.gateways.setCurrent(gateway);
    //this.gateway = gateway;
    this.onChange(gateway);
  }

  writeValue(gateway: string) {
    //Ne fait rien pour le moment puisque le champ est en lecture seule
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

}
