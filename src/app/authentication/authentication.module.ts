import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainsService } from './services/domains.service';
import { AuthenticationService } from './services/authentication.service';
import { AccesstokenToJWTConverter } from './converters/accesstoken-to-jwt.service';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
  ],
  providers: [
    DomainsService,
    AuthenticationService,
    AccesstokenToJWTConverter
  ],
})
export class AuthenticationModule {
}
