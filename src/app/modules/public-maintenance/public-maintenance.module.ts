import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';;
import { SharedModule } from '../shared/shared/shared.module';
import { CommoncomponentsModule } from '../shared/shared/commoncomponents/commoncomponents.module';
import { PublicMaintenanceComponent } from './public-maintenance.component';
import { PublicMaintainRoutingModule } from './public-maintenance-routing.module';

@NgModule({
  declarations: [
    PublicMaintenanceComponent
  ],
  imports: [
    CommonModule, 
    SharedModule,
    CommoncomponentsModule,
    PublicMaintainRoutingModule,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})

export class PublicMaintenanceModule { }
