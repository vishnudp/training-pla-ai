import { Component, Inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {
  courseForm: FormGroup;
  loading = false
  planData:any
  
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
  competenciesCount = {total:0, behavioral:0, functional:0, domain:0};
  constructor(public dialogRef: MatDialogRef<AddCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedService: SharedService,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef) {
      this.planData = data
      this.initializeForm();
  }
  
  ngOnInit() {
    this.loadCompetenciesData();
    this.updateCompetencyCounts();
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
  
  initializeForm() {
    this.courseForm = this.fb.group({
      courseName: ['', Validators.required],
      summary: [''],
      platformName: ['', Validators.required],
      courseUrl: ['', Validators.required],
      competencyType: [''],
      competencyTheme: [''],
      competencySubTheme: [''],
      manualThemeInput: [''],
      manualSubThemeInput: [''],
      themeSearch: [''],
      subThemeSearch: [''],
      competencies: this.fb.array([])
    });

    // Listen to form changes to trigger validation updates
    this.courseForm.valueChanges.subscribe(() => {
      this.cdRef.detectChanges();
    });
  }
  cancelForm() {
    this.dialogRef.close()
  }

  get competenciesArray(): FormArray {
    return this.courseForm.get('competencies') as FormArray;
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
    this.courseForm.patchValue({
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
    
    this.courseForm.patchValue({
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
  
  addCompetency() {
    let type = this.selectedCompetencyType;
    let theme = '';
    let subTheme = '';
    
    if (type === 'Domain') {
      // For Domain, use manual input
      theme = this.courseForm.value.manualThemeInput?.trim();
      subTheme = this.courseForm.value.manualSubThemeInput?.trim();
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
    this.courseForm.patchValue({ competencies: [...currentValues] });
    
    this.updateCompetencyCounts();
    this.cdRef.detectChanges(); // Trigger validation update
    console.log(this.courseForm?.get('competencies')?.value);
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
    
    this.courseForm.patchValue({
      competencyType: '',
      competencyTheme: '',
      competencySubTheme: '',
      manualThemeInput: '',
      manualSubThemeInput: '',
      themeSearch: '',
      subThemeSearch: ''
    });
  }
  
  canAddCompetency(): boolean {
    if (!this.selectedCompetencyType) return false;
    
    if (this.selectedCompetencyType === 'Domain') {
      const theme = this.courseForm.value.manualThemeInput?.trim();
      const subTheme = this.courseForm.value.manualSubThemeInput?.trim();
      return !!(theme && subTheme);
    } else {
      return !!(this.selectedTheme && this.selectedSubTheme);
    }
  }

  canSaveCourse(): boolean {
    // Check if required fields are filled
    const courseName = this.courseForm.value.courseName?.trim();
    const platformName = this.courseForm.value.platformName?.trim();
    const courseUrl = this.courseForm.value.courseUrl?.trim();
    
    // Check if at least one competency is added
    const hasCompetencies = this.competenciesArray.length > 0;
    
    return !!(courseName && platformName && courseUrl && hasCompetencies);
  }
  
  getCompetenciesByType(type: string): any[] {
    return (this.courseForm?.get('competencies')?.value || []).filter(c => c.type === type);
  }
  
  deleteCompetency(comp) {
    const index = this.competenciesArray.controls.findIndex(
      control => control.value.theme === comp.theme && control.value.type === comp.type
    );
  
    if (index !== -1) {
      this.competenciesArray.removeAt(index);
    }
    this.updateCompetencyCounts();
    this.cdRef.detectChanges(); // Trigger validation update
  }
  
  saveCourse() {
    this.loading = true
    
    // Transform competencies to the required API format
    const competencies = this.competenciesArray.value.map(comp => ({
      "competencyAreaName": comp.type,
      "competencyThemeName": comp.theme,
      "competencySubThemeName": comp.sub_theme
    }));
    
    let reqBody = {
      "role_mapping_id": this.planData.id,
      "name": this.courseForm.value.courseName,
      "platform": this.courseForm.value.platformName,
      "public_link": this.courseForm.value.courseUrl,
      "rationale": this.courseForm.value.summary,
      "competencies": competencies
    }
    
    console.log('Request body:', reqBody);
    
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
