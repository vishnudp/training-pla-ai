import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { PublicHomeComponent } from "./modules/public-home/components/public-home/public-home.component";
import { UploadDocumentPageComponent } from './modules/upload-document-page/upload-document-page.component';
import { InitialScreenComponent } from './modules/initial-screen/initial-screen.component';
import { RoleMappingGenerationComponent } from './components/role-mapping-generation/role-mapping-generation.component';
import { RoleMappingListComponent } from './components/role-mapping-list/role-mapping-list.component';
const routerOptions: any = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 120],
  onSameUrlNavigation: 'reload',
  relativeLinkResolution: 'legacy',
  useHash: true
};

const routes: Routes = [
  { path: 'upload-documents', component: UploadDocumentPageComponent },
  {
    path: '',
    component: InitialScreenComponent,
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: RoleMappingListComponent,
    pathMatch: 'full'
  },
  {
    path: 'initial',
    component: RoleMappingGenerationComponent,
    pathMatch: 'full'
  },
  {
    path: 'logout',
    component: InitialScreenComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
