import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { PublicHomeComponent } from "./modules/public-home/components/public-home/public-home.component";
import { UploadDocumentPageComponent } from './modules/upload-document-page/upload-document-page.component';
import { InitialScreenComponent } from './modules/initial-screen/initial-screen.component';
import { CbpPlanAiComponent } from '@sunbird-cb/cbp-plan-ai';
import { SharedService } from './modules/shared/services/shared.service';
import { InitService } from './modules/shared/services/init.service';
import { ConfigResolver } from './app-config.resolver';
const routerOptions: any = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 120],
  onSameUrlNavigation: 'reload',
  relativeLinkResolution: 'legacy',
  useHash: true
};
 

const routes: Routes = [
  { path: 'upload-documents', component: UploadDocumentPageComponent, resolve: { parentData:ConfigResolver } },
  {
    path: '',
    component: CbpPlanAiComponent,
    pathMatch: 'full',
    resolve: { parentData: ConfigResolver}
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
