import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedService } from './modules/shared/services/shared.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectiveModule } from './modules/shared/directives/directive.module';
import { SharedModule } from './modules/shared/shared/shared.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { InitService } from './modules/shared/services/init.service';
import { ToastrModule } from 'ngx-toastr';
import { PipePublicURLModule } from './pipe-public-URL/pipe-public-URL.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatDialogModule } from '@angular/material/dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacyCheckboxModule } from '@angular/material/legacy-checkbox';
import { RoleMappingGenerationComponent } from './components/role-mapping-generation/role-mapping-generation.component';
import { RoleMappingListComponent } from './components/role-mapping-list/role-mapping-list.component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { ViewCbpPlanComponent } from './components/view-cbp-plan/view-cbp-plan.component';
import { EditCbpPlanComponent } from './components/edit-cbp-plan/edit-cbp-plan.component';
import { GenerateCourseRecommendationComponent } from './components/generate-course-recommendation/generate-course-recommendation.component';
import { ViewCourseRecommendationComponent } from './components/view-course-recommendation/view-course-recommendation.component';
import { DeleteRoleMappingComponent } from './components/delete-role-mapping/delete-role-mapping.component';
import { ViewFinalCbpPlanComponent } from './components/view-final-cbp-plan/view-final-cbp-plan.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ListPopupComponent } from './components/list-popup/list-popup.component';
import { SuggestMoreCoursesComponent } from './components/suggest-more-courses/suggest-more-courses.component';
import { AddDesignationComponent } from './components/add-designation/add-designation.component';
import { AddPersonalisationComponent } from './components/add-personalisation/add-personalisation.component';
import { LoginComponent } from './components/login/login.component';
import { DeleteRoleMappingPopupComponent } from './components/delete-role-mapping-popup/delete-role-mapping-popup.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { AddCourseComponent } from './components/add-course/add-course.component';
const appInitializer = (initSvc: InitService) => async () => {
  try {
    await initSvc.init()
  } catch (error) {
    console.error('ERROR DURING APP INITIALIZATION >', error)
  }
}

@NgModule({
  declarations: [
    AppComponent,
    RoleMappingGenerationComponent,
    RoleMappingListComponent,
    ViewCbpPlanComponent,
    EditCbpPlanComponent,
    GenerateCourseRecommendationComponent,
    ViewCourseRecommendationComponent,
    DeleteRoleMappingComponent,
    ViewFinalCbpPlanComponent,
    ListPopupComponent,
    SuggestMoreCoursesComponent,
    AddDesignationComponent,
    AddPersonalisationComponent,
    LoginComponent,
    DeleteRoleMappingPopupComponent,
    AddCourseComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SharedModule,
    DirectiveModule,
    PaginationModule.forRoot(),
    ToastrModule.forRoot(),
    PipePublicURLModule,
    NgbModalModule,
    MatSidenavModule, MatListModule,  MatCardModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatGridListModule,
    MatRadioModule, MatDialogModule, MatChipsModule, MatSelectModule,MatLegacyCheckboxModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatTooltipModule,
    MatTabsModule
  ],
  providers: [
    {
      deps: [InitService],
      multi: true,
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
    },
    SharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

