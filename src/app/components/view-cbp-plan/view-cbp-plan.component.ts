import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { EditCbpPlanComponent } from '../edit-cbp-plan/edit-cbp-plan.component';
import { GenerateCourseRecommendationComponent } from '../generate-course-recommendation/generate-course-recommendation.component';

@Component({
  selector: 'app-view-cbp-plan',
  templateUrl: './view-cbp-plan.component.html',
  styleUrls: ['./view-cbp-plan.component.scss']
})
export class ViewCbpPlanComponent {
  selectedValue = ''
  searchText = ''
  planData:any
  competenciesCount = {total:0, behavioral:0, functional:0, domain:0}
  constructor(
    public dialogRef: MatDialogRef<ViewCbpPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {
    this.planData = data
    console.log('Received data:', data);
    this.planData.competencies.map((competencies:any)=>{
      this.competenciesCount['total'] = this.competenciesCount['total'] + 1 
      if(competencies.type === 'Behavioral') {
        this.competenciesCount['behavioral'] = this.competenciesCount['behavioral'] +1
      }
      if(competencies.type === 'Functional') {
        this.competenciesCount['functional'] = this.competenciesCount['functional'] +1
      }
      if(competencies.type === 'Domain') {
        this.competenciesCount['domain'] = this.competenciesCount['domain'] +1
      }
    })
  }

  searchData() {

  }

  applyFilter() {
   
  }

  getCompetenciesByType(competencies: any[], type: string): any[] {
    return competencies?.filter(c => c.type === type) || [];
  }

  closeDialog() {
    this.dialogRef.close(); 
  }

  editCBPPlan() {
    this.dialogRef.close();
    const dialogRefNew = this.dialog.open(EditCbpPlanComponent, {
      width: '700px',
      data: this.planData,
       panelClass: 'view-cbp-plan-popup',
      minHeight: '300px',          // Set minimum height
      maxHeight: '80vh',           // Prevent it from going beyond viewport
      disableClose: true // Optional: prevent closing with outside click
    });
  
    dialogRefNew.afterClosed().subscribe(result => {
      if (result === 'saved') {
        console.log('Changes saved!');
        // Refresh data or show a toast here
      }
    });
  }

  generateCourseRecommendation() {
    this.dialogRef.close();
    console.log('Generate Course Recommendation clicked', this.planData);
    
    console.log('Edit Role Mapping clicked', this.planData);
    // Navigate or open modal
    console.log('View CBP Plan clicked', this.planData);
    const dialogRef = this.dialog.open(GenerateCourseRecommendationComponent, {
      width: '1000px',
      data: this.planData,
       panelClass: 'view-cbp-plan-popup',
      minHeight: '400px',          // Set minimum height
      maxHeight: '90vh',           // Prevent it from going beyond viewport
      disableClose: true // Optional: prevent closing with outside click
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        console.log('Changes saved!');
        // Refresh data or show a toast here
       
        
      }
    });
  }

  downloadCBPPlan() {

  }
}
