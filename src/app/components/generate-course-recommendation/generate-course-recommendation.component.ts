import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-generate-course-recommendation',
  templateUrl: './generate-course-recommendation.component.html',
  styleUrls: ['./generate-course-recommendation.component.scss']
})
export class GenerateCourseRecommendationComponent {
  planData:any
  loading=false
  recommended_course_id=''
  constructor( public dialogRef: MatDialogRef<GenerateCourseRecommendationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private sharedService: SharedService) {
      this.planData = data
    }
  searchText = ''
  filterdCourses :any
  selectFilterCourses:any = []
  ngOnInit() {
    this.sharedService.getRecommendedCourse(this.planData.id).subscribe((res)=>{
      console.log('res', res)
      this.recommended_course_id = res.id
      this.filterdCourses = res.filtered_courses
      console.log('this.filterdCourses', this.filterdCourses)

    })
  }

  applyFilter() {

  }

  searchData() {

  }

  selectedFilterCourses(event, item) {
    console.log('event', event)
    console.log('item', item)
    if(event.checked) {
      this.selectFilterCourses.push(item?.identifier)
    } else {
      const index = this.selectFilterCourses.findIndex(
        control => control.identifier === item.identifier 
      );
    
      if (index !== -1) {
        this.selectFilterCourses.splice(index);
      }
    }
    console.log('this.selectFilterCourses', this.selectFilterCourses)
  }

  closeDialog() {
    this.dialogRef.close()
  }

  saveCourses() {
    console.log('this.planData',this.planData)
    let reqBody = {
      "role_mapping_id": this.planData.id,
      "recommended_course_id": this.recommended_course_id,
      "course_identifiers": this.selectFilterCourses
    }
    this.sharedService.saveCourse(reqBody).subscribe((res)=>{
      console.log('res--', res)
    })
  }
}
