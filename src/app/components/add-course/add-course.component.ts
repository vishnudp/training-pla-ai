import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent {
  courseForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder) {
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
    this.dialogRef.close()
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
