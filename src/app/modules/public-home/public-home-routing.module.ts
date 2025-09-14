import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicHomeComponent } from './components/public-home/public-home.component';


const routes: Routes = [
  {
    path: '',
    component: PublicHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class PublicHomeRoutingModule { }
