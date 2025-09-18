import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-edit-cbp-plan',
  templateUrl: './edit-cbp-plan.component.html',
  styleUrls: ['./edit-cbp-plan.component.scss']
})
export class EditCbpPlanComponent implements OnInit{

  selectedValue = ''
  searchText = ''
  planData:any
  competenciesCount = {total:0, behavioral:0, functional:0, domain:0}
  cbpForm: FormGroup;
  loading= false
  constructor(
    public dialogRef: MatDialogRef<EditCbpPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private sharedService:SharedService,
    private snackBar: MatSnackBar
  ) {
    this.planData = data
    console.log('Received data:', data);
    // this.planData.competencies.map((competencies:any)=>{
    //   this.competenciesCount['total'] = this.competenciesCount['total'] + 1 
    //   if(competencies.type === 'Behavioral') {
    //     this.competenciesCount['behavioral'] = this.competenciesCount['behavioral'] +1
    //   }
    //   if(competencies.type === 'Functional') {
    //     this.competenciesCount['functional'] = this.competenciesCount['functional'] +1
    //   }
    //   if(competencies.type === 'Domain') {
    //     this.competenciesCount['domain'] = this.competenciesCount['domain'] +1
    //   }
    // })
  }


  ngOnInit() {
    this.initializeForm();
    this.updateCompetencyCounts()
  }

  updateCompetencyCounts() {
    const comps = this.competenciesArray.value;
    this.competenciesCount = {total: 0, behavioral: 0, functional: 0, domain: 0};
    comps.forEach(c => {
      this.competenciesCount.total++;
      if (c.type.toLowerCase() === 'behavioral') this.competenciesCount.behavioral++;
      if (c.type.toLowerCase() === 'functional') this.competenciesCount.functional++;
      if (c.type.toLowerCase() === 'domain') this.competenciesCount.domain++;
    });
  }

  initializeForm() {
    this.cbpForm = this.fb.group({
      designation_name: [this.planData?.designation_name || '', Validators.required],
      wing_division_section: [this.planData?.wing_division_section || '', Validators.required],
      role_responsibilities_text: [this.planData?.role_responsibilities?.join('\n') || ''],
      activities_text: [this.planData?.activities?.join('\n') || ''],
      competencySearchText: [''],
      competencyType: [''],
      competencies: this.fb.array(this.planData?.competencies || []), // optional customization
    });
  }

  get roleResponsibilities(): FormArray {
    return this.cbpForm.get('role_responsibilities') as FormArray;
  }

  searchData() {

  }

  applyFilter() {
   
  }

  getCompetenciesByType(type: string): any[] {
    return (this.cbpForm?.get('competencies')?.value || []).filter(c => c.type === type);
  }

  closeDialog() {
    this.dialogRef.close(); 
  }

  saveRoleMapping() {
    if (this.cbpForm.invalid) return;

  const formData = this.cbpForm.value;
  console.log('Submitted Data:', formData);
  let cbpPlanData:any = this.sharedService.cbpPlanFinalObj;
  console.log('cbpPlanData',cbpPlanData)
  const roleResponsibilitiesArray = this.cbpForm.value.role_responsibilities_text
  .split('\n')
  .map(line => line.trim())
  .filter(line => line); 
  const activities = this.cbpForm.value.activities_text
  .split('\n')
  .map(line => line.trim())
  .filter(line => line); 
  this.loading = true
  let req = 
    {
      "sector_name":cbpPlanData?.sectors.join(","),
      "instruction": cbpPlanData?.instruction ? cbpPlanData.instruction:'',
      "designation_name": formData?.designation_name ? formData.designation_name : '',
      "wing_division_section": formData?.wing_division_section,
      "role_responsibilities":roleResponsibilitiesArray,
      "activities": activities,
      "competencies": formData.competencies
    }
    let role_mapping_id = this.planData.id
    
    this.sharedService.updateRoleMapping(role_mapping_id,req).subscribe({
      next: (res) => {
        // Success handling
        console.log('Success:', res);
        this.loading = false
        this.dialogRef.close('saved')
        this.snackBar.open('Role Mapping Saved Successfully', 'X', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        //this.successRoleMapping.emit(this.roleMappingForm)
      },
      error: (error) => {
        console.log('error', error)
        this.dialogRef.close()
          // Handle 409 Conflict here
          // alert('Conflict detected: The resource already exists or action conflicts.');
          //this.get
          // Or you can set a UI error message variable
          this.snackBar.open(error?.error?.detail, 'X', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
          this.loading = false
          //this.alreadyAvailableRoleMapping.emit(this.roleMappingForm)
      }
    });
  }

  cancelForm() {
    // Mark all controls as pristine and untouched without changing the values
    this.cbpForm.markAsPristine();
    this.cbpForm.markAsUntouched();
  
    // Also, if you want to mark all child controls (FormControls / FormArrays / FormGroups) as pristine and untouched
    this.markFormGroupPristineUntouched(this.cbpForm);
    this.dialogRef.close()
  }
  
  private markFormGroupPristineUntouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];
      if (control instanceof FormControl) {
        control.markAsPristine();
        control.markAsUntouched();
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupPristineUntouched(control);
      }
    });
  }

  get competenciesArray(): FormArray {
    return this.cbpForm.get('competencies') as FormArray;
  }

  addCompetency() {
      const type = this.cbpForm.value.competencyType;
      const theme = this.cbpForm.value.competencySearchText;
    
      if (type && theme) {
        const exists = this.competenciesArray.value.some(c => c.theme === theme && c.type === type);
        if (!exists) {
          const newComp = this.fb.group({
            type: [type],
            theme: [theme],
            sub_theme: ['']
          });
          this.competenciesArray.push(newComp);
        }
    
        // Optional: Clear input fields after adding
        this.cbpForm.patchValue({
          competencySearchText: '',
          competencyType: ''
        });
      }
      const currentValues = this.competenciesArray.value;
      this.cbpForm.patchValue({ competencies: [...currentValues] });

      this.updateCompetencyCounts();
    this.cdRef.detectChanges();
      console.log(this.cbpForm?.get('competencies')?.value )
  }

  deleteCompetency(comp) {
    const index = this.competenciesArray.controls.findIndex(
      control => control.value.theme === comp.theme && control.value.type === comp.type
    );
  
    if (index !== -1) {
      this.competenciesArray.removeAt(index);
    }
    this.updateCompetencyCounts();
    this.cdRef.detectChanges();
  }


}
