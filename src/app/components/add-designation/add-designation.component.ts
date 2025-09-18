import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-designation',
  templateUrl: './add-designation.component.html',
  styleUrls: ['./add-designation.component.scss']
})
export class AddDesignationComponent {
  designationForm: FormGroup;
  maxFileSizeMB = 25;
  allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];
  uploadError: string | null = null;
  uploadedFile: File | null = null;
  cbpPlanFinalObj:any
  loading = false
  constructor(public dialogRef: MatDialogRef<AddDesignationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private sharedService:SharedService,
    private snackBar: MatSnackBar){

  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.designationForm = this.fb.group({
      designation_name: ['', Validators.required],
      instruction: ['', Validators.required],
      uploadDoc: [null, []]
    });
  }

  onFileChange(event: any) {
    const file: File = event.target.files[0];

    if (!file) {
      return;
    }

    // Validate file size
    const maxBytes = this.maxFileSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      this.uploadError = `File exceeds maximum size of ${this.maxFileSizeMB}MB`;
      this.designationForm.get('uploadDoc')?.setErrors({ maxSize: true });
      return;
    }

    // Validate file type
    if (!this.allowedTypes.includes(file.type)) {
      this.uploadError = `Invalid file type. Allowed: PDF, Word, Excel, TXT`;
      this.designationForm.get('uploadDoc')?.setErrors({ fileType: true });
      return;
    }

    this.uploadedFile = file;
    this.uploadError = null;
    this.designationForm.patchValue({ uploadDoc: file });
    this.designationForm.get('uploadDoc')?.updateValueAndValidity();
  }

  cancelForm() {
    this.dialogRef.close()
  }

  saveDesignation() {
    this.loading = true
    const formData = new FormData();
    formData.append('designationName', this.designationForm.get('designationName')?.value);
    formData.append('roleDetails', this.designationForm.get('roleDetails')?.value);
    if (this.uploadedFile) {
      formData.append('uploadDoc', this.uploadedFile);
    }
    this.cbpPlanFinalObj = this.sharedService.getCBPPlanLocalStorage()
    console.log('this.designationForm',this.designationForm)
    let req:any = {
      "state_center_id": this.sharedService.cbpPlanFinalObj.ministry.id,
      // "department_id": "",
      "designation_name": this.designationForm.value.designation_name,
      "instruction": this.designationForm.value.instruction,
    }
    if(this.sharedService.cbpPlanFinalObj?.ministryType === 'state') {
      req['department_id'] = this.sharedService.cbpPlanFinalObj.departments
    }
    
    console.log('req', req)
    this.sharedService.addDesignation(req).subscribe((_res)=>{
      this.loading = false
      this.snackBar.open('Designation Added Successfully', 'X', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
      this.dialogRef.close()
    })
  }

  closeDialog() {
    this.dialogRef.close()
  }

}
