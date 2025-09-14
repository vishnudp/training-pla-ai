import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicHomeRoutingModule } from './public-home-routing.module';
import { PublicHomeComponent } from './components/public-home/public-home.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    PublicHomeComponent,
  ],
  imports: [
    CommonModule, 
    PublicHomeRoutingModule,
    MatCardModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class PublicHomeModule { }
