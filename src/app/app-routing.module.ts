import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { PublicHomeComponent } from "./modules/public-home/components/public-home/public-home.component";

const routerOptions: any = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 120],
  onSameUrlNavigation: 'reload',
  relativeLinkResolution: 'legacy',
  useHash: true
};

const routes: Routes = [
  {
    path: '',
    component: PublicHomeComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
