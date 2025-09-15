import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenerateCourseRecommendationComponent } from '../generate-course-recommendation/generate-course-recommendation.component';
import { AddPersonalisationComponent } from '../add-personalisation/add-personalisation.component';

@Component({
  selector: 'app-view-course-recommendation',
  templateUrl: './view-course-recommendation.component.html',
  styleUrls: ['./view-course-recommendation.component.scss']
})
export class ViewCourseRecommendationComponent {
  planData:any
  loading=false
  recommended_course_id=''
  cbpPlanData:any
  constructor( public dialogRef: MatDialogRef<ViewCourseRecommendationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private sharedService: SharedService, private dialog: MatDialog) {
      this.planData = data
    }
  searchText = ''
  filterdCourses :any
  selectFilterCourses:any = []
  competenciesCount = {total:0, public_courses:0, igot:0}
  ngOnInit() {
    this.cbpPlanData = this.sharedService.cbpPlanFinalObj
    this.sharedService.getRecommendedCourse(this.planData.id).subscribe((res)=>{
      console.log('res', res)
      this.recommended_course_id = res.id
      let allCourses = []
      if(res && res.filtered_courses && res.filtered_courses.length) {
        res.filtered_courses.forEach((item)=>{
          if(item?.relevancy > 85) {
            allCourses.push(item)
          }
        })
      }
      this.filterdCourses = allCourses
      console.log('this.filterdCourses', this.filterdCourses)
      this.updateCompetencyCounts()
    })
  }

  updateCompetencyCounts() {
   // const comps = this.competenciesArray.value;
    this.competenciesCount = {total: 0, public_courses: 0, igot: 0};
    this.filterdCourses.forEach(c => {
      this.competenciesCount.total++;
      if (c.is_public) this.competenciesCount.public_courses++;
      if (!c.is_public) this.competenciesCount.igot++;
    });
  }

  closeDialog() {
    this.dialogRef.close()
  }

  addMoreCourses() {
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

  addPersonilisation() {
    this.dialogRef.close();
    console.log('Generate Course Recommendation clicked', this.planData);
    
    console.log('Edit Role Mapping clicked', this.planData);
    // Navigate or open modal
    console.log('View CBP Plan clicked', this.planData);
    const dialogRef = this.dialog.open(AddPersonalisationComponent, {
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
}
