import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainsService } from './services/domains.service';
import { AuthenticationService } from './services/authentication.service';
import { AccesstokenToJWTService } from './converters/accesstoken-to-jwt.service';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
  ],
  providers: [
    DomainsService,
    AuthenticationService,
    AccesstokenToJWTService
  ],
})
export class AuthenticationModule {
}
