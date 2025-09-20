import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
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
  
  // Enhanced competency selection properties
  competenciesData: any[] = [];
  availableThemes: any[] = [];
  availableSubThemes: any[] = [];
  filteredThemes: any[] = [];
  filteredSubThemes: string[] = [];
  selectedCompetencyType = '';
  selectedTheme = '';
  selectedSubTheme = '';
  manualTheme = '';
  manualSubTheme = '';
  themeSearchText = '';
  subThemeSearchText = '';
  constructor(
    public dialogRef: MatDialogRef<EditCbpPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private sharedService:SharedService,
    private snackBar: MatSnackBar,
    private http: HttpClient
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
    this.loadCompetenciesData();
    this.initializeForm();
    this.updateCompetencyCounts()
  }

  loadCompetenciesData() {
    this.http.get<any[]>('/assets/jsonfiles/competencies.json').subscribe({
      next: (data) => {
        this.competenciesData = data;
        console.log('Competencies data loaded:', this.competenciesData);
      },
      error: (error) => {
        console.error('Error loading competencies data:', error);
      }
    });
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
      competencyTheme: [''],
      competencySubTheme: [''],
      manualThemeInput: [''],
      manualSubThemeInput: [''],
      themeSearch: [''],
      subThemeSearch: [''],
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

  onCompetencyTypeChange(type: string) {
    this.selectedCompetencyType = type;
    this.selectedTheme = '';
    this.selectedSubTheme = '';
    this.manualTheme = '';
    this.manualSubTheme = '';
    this.availableThemes = [];
    this.availableSubThemes = [];
    this.filteredThemes = [];
    this.filteredSubThemes = [];
    this.themeSearchText = '';
    this.subThemeSearchText = '';
    
    // Reset form controls
    this.cbpForm.patchValue({
      competencyTheme: '',
      competencySubTheme: '',
      manualThemeInput: '',
      manualSubThemeInput: '',
      themeSearch: '',
      subThemeSearch: ''
    });
    
    if (type === 'Behavioral' || type === 'Functional') {
      // Load themes from JSON for Behavioral and Functional
      const competencyCategory = this.competenciesData.find(cat => 
        cat.name.toLowerCase() === type.toLowerCase() || 
        (type === 'Behavioral' && cat.name === 'Behavioural')
      );
      
      if (competencyCategory) {
        this.availableThemes = competencyCategory.competency_theme || [];
        this.filteredThemes = [...this.availableThemes];
      }
    }
    // For Domain, no themes are loaded - user will enter manually
  }
  
  onThemeChange(themeName: string) {
    this.selectedTheme = themeName;
    this.selectedSubTheme = '';
    this.availableSubThemes = [];
    this.filteredSubThemes = [];
    this.subThemeSearchText = '';
    
    this.cbpForm.patchValue({
      competencySubTheme: '',
      subThemeSearch: ''
    });
    
    // Find the selected theme and load its sub-themes
    const selectedThemeObj = this.availableThemes.find(theme => theme.name === themeName);
    if (selectedThemeObj) {
      this.availableSubThemes = selectedThemeObj.competency_sub_theme || [];
      this.filteredSubThemes = [...this.availableSubThemes];
    }
  }
  
  onSubThemeChange(subThemeName: string) {
    this.selectedSubTheme = subThemeName;
  }
  
  addCompetency() {
    let type = this.selectedCompetencyType;
    let theme = '';
    let subTheme = '';
    
    if (type === 'Domain') {
      // For Domain, use manual input
      theme = this.cbpForm.value.manualThemeInput?.trim();
      subTheme = this.cbpForm.value.manualSubThemeInput?.trim();
    } else {
      // For Behavioral/Functional, use dropdown selections
      theme = this.selectedTheme;
      subTheme = this.selectedSubTheme;
    }
    
    if (type && theme && subTheme) {
      const exists = this.competenciesArray.value.some(c => 
        c.theme === theme && c.sub_theme === subTheme && c.type === type
      );
      
      if (!exists) {
        const newComp = this.fb.group({
          type: [type],
          theme: [theme],
          sub_theme: [subTheme]
        });
        this.competenciesArray.push(newComp);
      }
      
      // Clear input fields after adding
      this.resetCompetencyForm();
    }
    
    const currentValues = this.competenciesArray.value;
    this.cbpForm.patchValue({ competencies: [...currentValues] });
    
    this.updateCompetencyCounts();
    this.cdRef.detectChanges();
    console.log(this.cbpForm?.get('competencies')?.value);
  }
  
  resetCompetencyForm() {
    this.selectedCompetencyType = '';
    this.selectedTheme = '';
    this.selectedSubTheme = '';
    this.manualTheme = '';
    this.manualSubTheme = '';
    this.availableThemes = [];
    this.availableSubThemes = [];
    this.filteredThemes = [];
    this.filteredSubThemes = [];
    this.themeSearchText = '';
    this.subThemeSearchText = '';
    
    this.cbpForm.patchValue({
      competencyType: '',
      competencyTheme: '',
      competencySubTheme: '',
      manualThemeInput: '',
      manualSubThemeInput: '',
      themeSearch: '',
      subThemeSearch: ''
    });
  }
  
  filterThemes(searchText: string) {
    this.themeSearchText = searchText;
    if (!searchText.trim()) {
      this.filteredThemes = [...this.availableThemes];
    } else {
      this.filteredThemes = this.availableThemes.filter(theme => 
        theme.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  }
  
  filterSubThemes(searchText: string) {
    this.subThemeSearchText = searchText;
    if (!searchText.trim()) {
      this.filteredSubThemes = [...this.availableSubThemes];
    } else {
      this.filteredSubThemes = this.availableSubThemes.filter(subTheme => 
        subTheme.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  }
  
  canAddCompetency(): boolean {
    if (!this.selectedCompetencyType) return false;
    
    if (this.selectedCompetencyType === 'Domain') {
      const theme = this.cbpForm.value.manualThemeInput?.trim();
      const subTheme = this.cbpForm.value.manualSubThemeInput?.trim();
      return !!(theme && subTheme);
    } else {
      return !!(this.selectedTheme && this.selectedSubTheme);
    }
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
