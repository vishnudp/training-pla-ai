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
      
      instruction: [''],
    });
  }

  cancelForm() {
    this.dialogRef.close()
  }

  saveDesignation() {
    console.log('this.designationForm',this.designationForm)
    let req:any = {
      "state_center_id": this.sharedService.cbpPlanFinalObj.ministry.id,
      "department_id": "",
      "designation_name": this.designationForm.value.designation_name,
      "instruction": this.designationForm.value.instruction,
    }
    console.log('req', req)
    // this.sharedService.addDesignation(req).subscribe(()=>{
    //   this.dialogRef.close()
    // })
  }

  closeDialog() {
    this.dialogRef.close()
  }

}
