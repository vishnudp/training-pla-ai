import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicMaintenanceComponent } from './public-maintenance.component';


const routes: Routes = [
  {
    path: '',
    component: PublicMaintenanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class PublicMaintainRoutingModule { }
