import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/modules/shared/services/shared.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent {
  courseForm: FormGroup;
  loading = false
  planData:any
  constructor(public dialogRef: MatDialogRef<AddCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedService: SharedService,
    private fb: FormBuilder,
  public snackBar: MatSnackBar) {
      this.planData = data
      this.courseForm = this.fb.group({
        courseName: ['', Validators.required],
        summary: [''],
        platformName: [''],
        courseUrl: [''],
        competencies: this.fb.group({
          behavioral: [''],
          functional: [''],
          domain: ['']
        })
      });

  }
  cancelForm() {
    this.dialogRef.close()
  }

  saveCourse() {
    this.loading = true
    let reqBody = {
      "role_mapping_id": this.planData.id,
      "name": this.courseForm.value.courseName,
      "platform": this.courseForm.value.platformName,
      "public_link": this.courseForm.value.courseUrl,
     // "relevancy": 0,
      "rationale": this.courseForm.value.summary,
    //  "language": "english",
      "competencies": [
        // {
        //   "competencyAreaName": "Domain",
        //   "competencyThemeName": "Test",
        //   "competencySubThemeName": "Test Sub Theme"
        // }
      ]
    }
    this.sharedService.addUserCourse(reqBody).subscribe(()=>{
      this.loading = false
      this.snackBar.open('Course Added Successfully', 'X', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
    })
    this.dialogRef.close('saved')
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
