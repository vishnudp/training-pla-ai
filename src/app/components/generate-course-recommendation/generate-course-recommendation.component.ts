import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuggestMoreCoursesComponent } from '../suggest-more-courses/suggest-more-courses.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AddCourseComponent } from '../add-course/add-course.component';

@Component({
  selector: 'app-generate-course-recommendation',
  templateUrl: './generate-course-recommendation.component.html',
  styleUrls: ['./generate-course-recommendation.component.scss']
})
export class GenerateCourseRecommendationComponent {
  planData: any
  loading = false
  recommended_course_id = ''
  constructor(public dialogRef: MatDialogRef<GenerateCourseRecommendationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public sharedService: SharedService,
    private snackBar: MatSnackBar, public dialog: MatDialog) {
    this.planData = data
  }
  searchText = ''
  filterdCourses: any = []
  originalData: any = []
  selectFilterCourses: any = []
  mode = 'add'
  cbp_plan_id = ''
  expandedCompetencies: any = {}; // Track expanded state for each course and competency type
  outerTabActiveIndex = 0
  innerTabActiveIndex = 0
  outerTabActiveText = 'all'
  innerTabActiveText = 'all'
  selectedCategory = 'all';
  competencyCoveredCount = 0
  overallCoverage:any = 0
  behavioralCompetencyCoveredCount = 0
  behavioralTotalCompetencies = 0
  behavioralCoverage: any = 0
  functionalCompetencyCoveredCount = 0
  functionalTotalCompetencies = 0
  functionalCoverage: any = 0
  domainCompetencyCoveredCount = 0
  domainTotalCompetencies = 0
  domainCoverage: any = 0
  competencyNotMatchedByCategory = []
  competencyMatchedByCategory = []
  menuItems = [
    { key: 'all', label: 'All Categories' },
    { key: 'behavioral', label: 'Behavioral' },
    { key: 'functional', label: 'Functional' },
    { key: 'domain', label: 'Domain' }
  ];
  behaviouralNotMatched = []
  functionalNotMatched = []
  domainNotMatched = []

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.gapAnalysisStats()
  }
  ngOnInit() {
    this.loading = true
    this.sharedService.getRecommendedCourse(this.planData.id).subscribe((res) => {
      this.loading = false
      console.log('res', res)
      this.recommended_course_id = res.id
      let allCoures = []
      if (res && res.filtered_courses && res.filtered_courses.length) {
        res?.filtered_courses.forEach((item) => {
          if (item?.relevancy >= 85) {
            allCoures.push(item)
          }
        })
        this.originalData = allCoures
        this.filterdCourses = allCoures
      }

      console.log('this.filterdCourses', this.filterdCourses)
      this.getCourses()
      this.getSuggestedCourse()
      
      // Initialize gap analysis stats after courses are loaded
      this.initializeGapAnalysisStats()
    })
  }

  applyFilter() {
    this.filterdCourses = this.filterData(this.searchText);
  }

  searchData() {
    //  this.filterdCourses = this.filterData(this.searchText);
  }

  selectedFilterCourses(event, item) {
    console.log('event', event)
    console.log('item', item)
    if (event.checked) {
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
    this.loading = true
    console.log('this.planData', this.planData)
    let reqBody = {
      "role_mapping_id": this.planData.id,
      "recommended_course_id": this.recommended_course_id,
      "course_identifiers": this.selectFilterCourses
    }
    console.log('reqBody, ', reqBody)
    if (this.mode === 'add') {
      this.sharedService.saveCourse(reqBody).subscribe({
        next: (res) => {
          // Success handling
          console.log('Success:', res);
          this.loading = false
          this.dialogRef.close('saved')
          this.snackBar.open('Courses Saved Successfully', 'X', {
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
    } else {
      if (this.cbp_plan_id) {
        this.sharedService.updateCourse(reqBody, this.cbp_plan_id).subscribe({
          next: (res) => {
            // Success handling
            console.log('Success:', res);
            this.loading = false
            this.dialogRef.close('saved')
            this.snackBar.open('Courses Saved Successfully', 'X', {
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

    }

  }

  getCourses() {
    let role_mapping_id = this.planData.id
    this.loading = true
    this.sharedService.getCourse(role_mapping_id).subscribe({
      next: (res) => {
        // Success handling
        this.loading = false
        console.log('res', res)
        this.cbp_plan_id = res?.id
        if (res && res?.selected_courses && res?.selected_courses?.length) {
          this.mode = 'edit'
          for (let i = 0; i < res?.selected_courses.length; i++) {
            this.selectFilterCourses.push(res.selected_courses[i]?.identifier)
          }
        }
        //this.successRoleMapping.emit(this.roleMappingForm)
      },
      error: (error) => {
        console.log('error', error)
        this.loading = false
        // Handle 409 Conflict here
        // alert('Conflict detected: The resource already exists or action conflicts.');
        //this.get
        // Or you can set a UI error message variable

        this.loading = false
        //this.alreadyAvailableRoleMapping.emit(this.roleMappingForm)
      }


    })
  }
  getSuggestedCourse() {
    let role_mapping_id = this.planData.id
    this.loading = true
    this.sharedService.getSuggestedCourses(role_mapping_id).subscribe({
      next: (res) => {
        // Success handling
        this.loading = false
        console.log('res', res)
        this.cbp_plan_id = res?.id
        this.loading = false
        console.log('res', res)
        console.log('this.filterdCourses', this.filterdCourses)
        for (let i = 0; i < res.length; i++) {
          this.filterdCourses.push(res[i])
        }
        
        // Update gap analysis stats after suggested courses are added
        this.updateGapAnalysisAfterCoursesUpdate()
        //this.successRoleMapping.emit(this.roleMappingForm)
      },
      error: (error) => {
        console.log('error', error)
        this.loading = false
        // Handle 409 Conflict here
        // alert('Conflict detected: The resource already exists or action conflicts.');
        //this.get
        // Or you can set a UI error message variable

        this.loading = false
        //this.alreadyAvailableRoleMapping.emit(this.roleMappingForm)
      }


    })
  }

  checkIfCourseExists(item) {
    let flag = false
    if (this.selectFilterCourses.indexOf(item?.identifier) > -1) {
      flag = true
    }
    return flag
  }

  selectAllCourses(event) {
    if (event.checked) {
      for (let i = 0; i < this.filterdCourses.length; i++) {
        this.selectFilterCourses.push(this.filterdCourses[i].identifier)
      }
    } else {
      this.selectFilterCourses = []
      this.mode = 'add'
    }


  }
  getSectors(sector) {
    if (sector && sector.length) {
      return Array.isArray(sector) ? sector.join('/ ') : ''
    }

  }

  filterData(searchText: string): any[] {
    const filter = searchText.trim().toLowerCase();

    return this.originalData.filter(item => {
      const stringified = this.flattenObjectToString(item).toLowerCase();
      return stringified.includes(filter);
    });
  }

  flattenObjectToString(obj: any): string {
    let result = '';

    for (const key in obj) {
      const value = obj[key];

      if (typeof value === 'string') {
        result += ' ' + value;
      } else if (Array.isArray(value)) {
        value.forEach(val => {
          if (typeof val === 'string') {
            result += ' ' + val;
          } else if (typeof val === 'object') {
            result += ' ' + this.flattenObjectToString(val);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        result += ' ' + this.flattenObjectToString(value);
      }
    }

    return result;
  }

  suggestMoreCourses() {
    this.dialogRef.close()
    const dialogRefNew = this.dialog.open(SuggestMoreCoursesComponent, {
      width: '1000px',
      data: { recommended_course_id: this.recommended_course_id, role_mapping_id: this.planData.id },
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

  getCompetenciesByType(type: string, index): any[] {
    const course = this.filterdCourses[index];
    if (!course) {
      return [];
    }
    
    // Handle different competency property names
    // AI Recommended & Public courses use 'competencies'
    // Manually Suggested - iGOT courses use 'competencies_v6'
    let competencies = [];
    if (course.competencies && Array.isArray(course.competencies)) {
      competencies = course.competencies;
    } else if (course.competencies_v6 && Array.isArray(course.competencies_v6)) {
      competencies = course.competencies_v6;
    }
    
    if (competencies.length === 0) {
      return [];
    }
    
    // Normalize the type for comparison (case-insensitive + handle spelling variations)
    const normalizedType = type.toLowerCase().trim();
    
    const matchedCompetencies = competencies.filter(c => {
      if (!c || !c.competencyAreaName) return false;
      
      const competencyArea = c.competencyAreaName.toLowerCase().trim();
      
      // Handle both "behavioral" and "behavioural" spellings
      if (normalizedType === 'behavioural' || normalizedType === 'behavioral') {
        return competencyArea === 'behavioral' || competencyArea === 'behavioural';
      }
      
      // For other types, do case-insensitive comparison
      return competencyArea === normalizedType;
    });
    
    return matchedCompetencies;
  }

  getCompetenciesByBehviouralType(index): string {
    const course = this.filterdCourses[index];
    if (!course) {
      return '';
    }
    
    // Handle different competency property names
    let competencies = [];
    if (course.competencies && Array.isArray(course.competencies)) {
      competencies = course.competencies;
    } else if (course.competencies_v6 && Array.isArray(course.competencies_v6)) {
      competencies = course.competencies_v6;
    }
    
    if (competencies.length === 0) {
      return '';
    }
    
    return competencies
      .filter(c => c && (c.competencyAreaName === 'Behavioral' || c.competencyAreaName === 'Behavioural'))
      .map(c => `${c.competencyThemeName || ''} - ${c.competencySubThemeName || ''}`)
      .join(', ');
  }

  getDisplayedCompetencies(type: string, index: number): any[] {
    const competencies = this.getCompetenciesByType(type, index);
    const key = `${index}-${type}`;

    if (this.expandedCompetencies[key]) {
      return competencies;
    }

    return competencies.slice(0, 2);
  }

  toggleCompetencies(type: string, index: number): void {
    const key = `${index}-${type}`;
    this.expandedCompetencies[key] = !this.expandedCompetencies[key];
  }

  isExpanded(type: string, index: number): boolean {
    const key = `${index}-${type}`;
    return this.expandedCompetencies[key] || false;
  }

  hasMoreThanTwo(type: string, index: number): boolean {
    return this.getCompetenciesByType(type, index).length > 2;
  }

  getRemainingCount(type: string, index: number): number {
    const totalCount = this.getCompetenciesByType(type, index).length;
    return totalCount - 2;
  }

  onOuterTabChange(event: MatTabChangeEvent): void {
    this.outerTabActiveIndex = event.index
    this.outerTabActiveText = event.tab.textLabel
    console.log('Outer Tab Index:', event.index);
    console.log('Outer Tab Label:', event.tab.textLabel);
    if(event.index === 1) {
      this.gapAnalysisStats()
    }
  }

  onInnerTabChange(event: MatTabChangeEvent): void {
    this.innerTabActiveIndex = event.index
    this.innerTabActiveText = event.tab.textLabel
    console.log('Inner Tab Index:', event.index);
    console.log('Inner Tab Label:', event.tab.textLabel);
    let tabIndex = event.index
    this.competencyMatchedByCategory = []
    switch (tabIndex) {
      case 0: // All
        this.filterdCourses = this.originalData;
        break;
      case 1: // Behavioral
        this.filterdCourses = this.behavioralFilter(this.originalData);
        this.competencyMatchedByCategory = this.behavioralCompetencyFilter(this.originalData);
        break;
      case 2: // Functional
        this.filterdCourses = this.functionalFilter(this.originalData);
        this.competencyMatchedByCategory = this.functionalCompetencyFilter(this.originalData);
        break;
      case 3: // Domain
        this.filterdCourses = this.domainFilter(this.originalData);
        this.competencyMatchedByCategory = this.domainCompetencyFilter(this.originalData);
        break;
    }
    console.log('this.filterdCourses',this.filterdCourses)
    console.log('this.competencyMatchedByCategory',this.competencyMatchedByCategory)
  }

  behavioralFilter(data: any[]): any[] {
    return data.filter(item => {
      if (!item) return false;
      
      // Handle different competency property names
      let competencies = [];
      if (item.competencies && Array.isArray(item.competencies)) {
        competencies = item.competencies;
      } else if (item.competencies_v6 && Array.isArray(item.competencies_v6)) {
        competencies = item.competencies_v6;
      }
      
      return competencies.some(c => c && ((c?.competencyAreaName?.toLowerCase() === 'behavioral') || c?.competencyAreaName?.toLowerCase() === 'behavioural'));
    });
  }

  behavioralCompetencyFilter(data:any[]):any {
    const behavioralThemes = (data as any[])
    .map(item => {
      // Handle different competency property names
      let competencies = [];
      if (item && item.competencies && Array.isArray(item.competencies)) {
        competencies = item.competencies;
      } else if (item && item.competencies_v6 && Array.isArray(item.competencies_v6)) {
        competencies = item.competencies_v6;
      }
      return competencies;
    })
    .reduce((acc, curr) => acc.concat(curr), []) // manually flatten
    .filter(c =>
      c && c.competencyAreaName &&
      (c.competencyAreaName?.toLowerCase() === 'behavioral' ||
       c.competencyAreaName?.toLowerCase() === 'behavioural')
    )
    .map(c => c.competencyThemeName)
    .filter(theme => theme); // Remove undefined/null themes
  
  const uniqueBehavioralThemes = Array.from(new Set(behavioralThemes));
  
  console.log(uniqueBehavioralThemes);
  return uniqueBehavioralThemes
    
    // console.log(uniqueCompetencyAreaNames);
  }

  functionalCompetencyFilter(data:any[]):any {
    const funtionalThemes = (data as any[])
    .map(item => {
      // Handle different competency property names
      let competencies = [];
      if (item && item.competencies && Array.isArray(item.competencies)) {
        competencies = item.competencies;
      } else if (item && item.competencies_v6 && Array.isArray(item.competencies_v6)) {
        competencies = item.competencies_v6;
      }
      return competencies;
    })
    .reduce((acc, curr) => acc.concat(curr), []) // manually flatten
    .filter(c =>
      c && c.competencyAreaName &&
      c.competencyAreaName?.toLowerCase() === 'functional' 
    )
    .map(c => c.competencyThemeName)
    .filter(theme => theme); // Remove undefined/null themes
  
  const uniqueFunctionalThemes = Array.from(new Set(funtionalThemes));
  
  console.log(uniqueFunctionalThemes);
  return uniqueFunctionalThemes
    
    // console.log(uniqueCompetencyAreaNames);
  }

  domainCompetencyFilter(data:any[]):any {
    const domainThemes = (data as any[])
    .map(item => {
      // Handle different competency property names
      let competencies = [];
      if (item && item.competencies && Array.isArray(item.competencies)) {
        competencies = item.competencies;
      } else if (item && item.competencies_v6 && Array.isArray(item.competencies_v6)) {
        competencies = item.competencies_v6;
      }
      return competencies;
    })
    .reduce((acc, curr) => acc.concat(curr), []) // manually flatten
    .filter(c =>
      c && c.competencyAreaName &&
      c.competencyAreaName?.toLowerCase() === 'domain' 
    )
    .map(c => c.competencyThemeName)
    .filter(theme => theme); // Remove undefined/null themes
  
  const uniqueDomainThemes = Array.from(new Set(domainThemes));
  
  console.log(uniqueDomainThemes);
  return uniqueDomainThemes
    
    // console.log(uniqueCompetencyAreaNames);
  }


  functionalFilter(data: any[]): any[] {
    return data.filter(item => {
      if (!item) return false;
      
      // Handle different competency property names
      let competencies = [];
      if (item.competencies && Array.isArray(item.competencies)) {
        competencies = item.competencies;
      } else if (item.competencies_v6 && Array.isArray(item.competencies_v6)) {
        competencies = item.competencies_v6;
      }
      
      return competencies.some(c => c && c?.competencyAreaName?.toLowerCase() === 'functional');
    });
  }

  domainFilter(data: any[]): any[] {
    return data.filter(item => {
      if (!item) return false;
      
      // Handle different competency property names
      let competencies = [];
      if (item.competencies && Array.isArray(item.competencies)) {
        competencies = item.competencies;
      } else if (item.competencies_v6 && Array.isArray(item.competencies_v6)) {
        competencies = item.competencies_v6;
      }
      
      return competencies.some(c => c && c?.competencyAreaName?.toLowerCase() === 'domain');
    });
  }

  gapAnalysisStats () {
    console.log('this.planData',this.planData)
    
    // Always use ALL competencies for calculating overall stats
    const allCompetencies = this.planData.competencies;
    
    // Filter for category-specific calculations
    let categorySpecificCompetencies:any = this.planData.competencies;
    if(this.selectedCategory === 'all') {
      categorySpecificCompetencies = this.planData.competencies
    } else if(this.selectedCategory === 'behavioral') {
      categorySpecificCompetencies = this.planData.competencies.filter(item => item.type?.toLowerCase() === this.selectedCategory);
    } else if(this.selectedCategory === 'functional') {
      categorySpecificCompetencies = this.planData.competencies.filter(item => item.type?.toLowerCase() === this.selectedCategory);
    } 
    else if(this.selectedCategory === 'domain') {
      categorySpecificCompetencies = this.planData.competencies.filter(item => item.type?.toLowerCase() === this.selectedCategory);
    } 

    // Count ALL competencies by category (not just filtered ones)
    const masterListByCategory = {total: allCompetencies.length, behavioural: 0, functional:0, domain:0}
    
    // IMPORTANT: Always use originalData (all courses) for overall coverage calculation
    // Don't use filterdCourses as it changes based on competency filters
    const allCourseCompetencies = []
    this.originalData.forEach(course => {
      // Handle different competency property names
      let competencies = [];
      if (course && course.competencies && Array.isArray(course.competencies)) {
        competencies = course.competencies;
      } else if (course && course.competencies_v6 && Array.isArray(course.competencies_v6)) {
        competencies = course.competencies_v6;
      }
      
      competencies.forEach((list:any) => {
         allCourseCompetencies.push(list)
      });
    });
    
    // Also include suggested courses that might not be in originalData
    this.filterdCourses.forEach(course => {
      // Only add if it's not already in originalData (to avoid duplicates)
      const isInOriginal = this.originalData.some(origCourse => 
        origCourse.identifier === course.identifier
      );
      if (!isInOriginal) {
        // Handle different competency property names
        let competencies = [];
        if (course && course.competencies && Array.isArray(course.competencies)) {
          competencies = course.competencies;
        } else if (course && course.competencies_v6 && Array.isArray(course.competencies_v6)) {
          competencies = course.competencies_v6;
        }
        
        competencies.forEach((list:any) => {
           allCourseCompetencies.push(list)
        });
      }
    });
    
    console.log('allCompetencies', allCompetencies)
    console.log('categorySpecificCompetencies', categorySpecificCompetencies)
    console.log('allCourseCompetencies', allCourseCompetencies)
    
    // Count all competencies by type for proper totals
    for(let i=0; i<allCompetencies.length;i++) {
      const competencyType = allCompetencies[i]['type']?.toLowerCase();
      console.log(`Competency ${i}: type="${competencyType}", data:`, allCompetencies[i]);
      if(competencyType === 'behavioural' || competencyType === 'behavioral') {
        masterListByCategory['behavioural'] = masterListByCategory['behavioural'] + 1
      }
      if(competencyType === 'functional') {
        masterListByCategory['functional'] = masterListByCategory['functional'] + 1
      }
      if(competencyType === 'domain') {
        masterListByCategory['domain'] = masterListByCategory['domain'] + 1
      }
    }
    console.log('masterListByCategory after counting:', masterListByCategory)
    
    // Get matching results for ALL competencies (for overall coverage)
    const overallResult = this.getMatchedCompetencyStats(allCompetencies, allCourseCompetencies);
    
    // Get matching results for category-specific competencies (for filtered view)
    const categoryResult = this.getMatchedCompetencyStats(categorySpecificCompetencies, allCourseCompetencies);
    
    // Set competencyCoveredCount based on selected category (for the filtered numbers)
    if(this.selectedCategory === 'all') {
      this.competencyCoveredCount = overallResult['total'];
    } else if(this.selectedCategory === 'behavioral') {
      this.competencyCoveredCount = categoryResult['behavioral'] || 0;
    } else if(this.selectedCategory === 'functional') {
      this.competencyCoveredCount = categoryResult['functional'] || 0;
    } else if(this.selectedCategory === 'domain') {
      this.competencyCoveredCount = categoryResult['domain'] || 0;
    }
    
    // IMPORTANT: Overall Coverage should ALWAYS be based on ALL competencies, not filtered
    let totalCompetencies = this.planData.competencies.length; // Always use total count
    let overallCoveredCount = overallResult['total']; // Always use overall results
    let mathRound = Math.round((overallCoveredCount/totalCompetencies)*100)
    this.overallCoverage = `${mathRound}%`
    
    console.log('Overall Coverage Calculation:', {
      totalCompetencies: totalCompetencies,
      overallCoveredCount: overallCoveredCount,
      overallCoverage: this.overallCoverage,
      selectedCategory: this.selectedCategory,
      competencyCoveredCount: this.competencyCoveredCount
    });
    
    // Always calculate all category-specific metrics regardless of selected category
    // This ensures the data is available when switching between categories
    // Use overallResult for consistent calculations across all categories
    this.behavioralCompetencyCoveredCount = overallResult['behavioral'] || 0;
    this.behavioralTotalCompetencies = masterListByCategory['behavioural'];
    let behavioralMathRound = this.behavioralTotalCompetencies > 0 ? Math.round((this.behavioralCompetencyCoveredCount/this.behavioralTotalCompetencies)*100) : 0;
    this.behavioralCoverage = `${behavioralMathRound}%`;
    
    this.functionalCompetencyCoveredCount = overallResult['functional'] || 0;
    this.functionalTotalCompetencies = masterListByCategory['functional'];
    let functionalMathRound = this.functionalTotalCompetencies > 0 ? Math.round((this.functionalCompetencyCoveredCount/this.functionalTotalCompetencies)*100) : 0;
    this.functionalCoverage = `${functionalMathRound}%`;
    
    this.domainCompetencyCoveredCount = overallResult['domain'] || 0;
    this.domainTotalCompetencies = masterListByCategory['domain'];
    let domainMathRound = this.domainTotalCompetencies > 0 ? Math.round((this.domainCompetencyCoveredCount/this.domainTotalCompetencies)*100) : 0;
    this.domainCoverage = `${domainMathRound}%`;
    
    console.log('All category metrics calculated:', {
      behavioral: { covered: this.behavioralCompetencyCoveredCount, total: this.behavioralTotalCompetencies, coverage: this.behavioralCoverage },
      functional: { covered: this.functionalCompetencyCoveredCount, total: this.functionalTotalCompetencies, coverage: this.functionalCoverage },
      domain: { covered: this.domainCompetencyCoveredCount, total: this.domainTotalCompetencies, coverage: this.domainCoverage },
      overall: { covered: overallCoveredCount, total: totalCompetencies, coverage: this.overallCoverage },
      selectedCategory: this.selectedCategory,
      competencyCoveredCountForCategory: this.competencyCoveredCount
    });
    console.log('Overall Result:', overallResult);
    console.log('Category Result:', categoryResult);
    console.log('this.competencyNotMatchedByCategory',this.competencyNotMatchedByCategory)
    this.behaviouralNotMatched = this.getCompetencyByCategoryNotMatching('behavioral')
    this.functionalNotMatched = this.getCompetencyByCategoryNotMatching('functional')
    this.domainNotMatched = this.getCompetencyByCategoryNotMatching('domain')
  }

  getMatchedCompetencyStats(primaryArray: any[], secondaryArray: any[]) {
    // Convert both arrays to ensure consistent casing
    const counts: any = {
      behavioral: 0,
      functional: 0,
      domain: 0,
      total: 0
    };
    
    // Clear the competencyNotMatchedByCategory array for fresh calculation
    this.competencyNotMatchedByCategory = [];
    
    // Set to keep track of unique matches
    const seen = new Set<string>();
    const matchedCompetencies = new Set<string>();
    
    for (const primary of primaryArray) {
      const typeKey = primary.type?.toLowerCase().trim();
      const themeKey = primary.theme?.toLowerCase().trim();
      const subThemeKey = primary.sub_theme?.toLowerCase().trim();
    
      let isMatched = false;
      
      for (const secondary of secondaryArray) {
        // Normalize secondary keys
        let secType = secondary?.competencyAreaName?.toLowerCase().trim();
        let secTheme = secondary?.competencyThemeName?.toLowerCase().trim();
        let secSubTheme = secondary?.competencySubThemeName?.toLowerCase().trim();
    
        // Fix for data inconsistency
        if (secType === 'behavioural') secType = 'behavioral';
    
        // Create unique match key for primary competency
        const matchKey = `${typeKey}|${themeKey}|${subThemeKey}`;
    
        // Enhanced cross-matching logic as requested:
        // 1. Role mapping Theme vs Course Theme
        // 2. Role mapping Sub Theme vs Course Sub Theme  
        // 3. Role mapping Theme vs Course Sub Theme
        // 4. Role mapping Sub Theme vs Course Theme
        const themeToThemeMatch = themeKey === secTheme;
        const subThemeToSubThemeMatch = subThemeKey === secSubTheme;
        const themeToSubThemeMatch = themeKey === secSubTheme;
        const subThemeToThemeMatch = subThemeKey === secTheme;
        
        let matchType = '';
        let isMatch = false;
        
        if (typeKey === secType && !seen.has(matchKey)) {
          if (themeToThemeMatch) {
            matchType = 'Theme-to-Theme';
            isMatch = true;
          } else if (subThemeToSubThemeMatch) {
            matchType = 'SubTheme-to-SubTheme';
            isMatch = true;
          } else if (themeToSubThemeMatch) {
            matchType = 'Theme-to-SubTheme';
            isMatch = true;
          } else if (subThemeToThemeMatch) {
            matchType = 'SubTheme-to-Theme';
            isMatch = true;
          }
        }

        if (isMatch) {
          console.log(`✅ MATCH FOUND [${matchType}]:`, {
            roleMapping: { type: typeKey, theme: themeKey, subTheme: subThemeKey },
            course: { type: secType, theme: secTheme, subTheme: secSubTheme },
            matchType: matchType
          });
          
          // Store matched competency info for later use
          let obj = {};
          obj[typeKey] = [themeKey]; // Store the original theme, not the course theme
          this.competencyNotMatchedByCategory.push(obj);
          seen.add(matchKey);
          matchedCompetencies.add(themeKey); // Track matched themes
          isMatched = true;
          
          if (counts.hasOwnProperty(typeKey)) {
            counts[typeKey]++;
          } else {
            counts[typeKey] = 1;
          }
    
          counts.total++;
          break; // Stop looking for matches for this primary competency
        }
      }
    }
    
    return counts;
  }
  getCompetencyByCategoryNotMatching(categoryType) {
    // Get all competencies for the given category from role mapping
    let allCategoryCompetencies = [];
    for(let i = 0; i < this.planData.competencies.length; i++) {
      if(this.planData.competencies[i]['type']?.toLowerCase() === categoryType?.toLowerCase()) {
        allCategoryCompetencies.push(this.planData.competencies[i]['theme']?.toLowerCase().trim());
      }
    }
    
    // Get matched competencies for this category from courses
    let matchedCompetencies = [];
    for(let i = 0; i < this.competencyNotMatchedByCategory.length; i++) {
      if(this.competencyNotMatchedByCategory[i][categoryType?.toLowerCase()]) {
        // Extract matched themes from course competencies
        this.competencyNotMatchedByCategory[i][categoryType?.toLowerCase()].forEach(theme => {
          if(theme) {
            matchedCompetencies.push(theme.toLowerCase().trim());
          }
        });
      }
    }
    
    // Enhanced matching: check both theme and subtheme from courses against FRAC competencies
    // IMPORTANT: Use originalData + any additional courses for consistent overall coverage
    const allCoursesForMatching = [...this.originalData];
    
    // Add any additional courses from filterdCourses that aren't in originalData
    this.filterdCourses.forEach(course => {
      const isInOriginal = this.originalData.some(origCourse => 
        origCourse.identifier === course.identifier
      );
      if (!isInOriginal) {
        allCoursesForMatching.push(course);
      }
    });
    
    allCoursesForMatching.forEach(course => {
      // Handle different competency property names
      let competencies = [];
      if (course && course.competencies && Array.isArray(course.competencies)) {
        competencies = course.competencies;
      } else if (course && course.competencies_v6 && Array.isArray(course.competencies_v6)) {
        competencies = course.competencies_v6;
      }
      
      competencies.forEach((comp: any) => {
        let secType = comp?.competencyAreaName?.toLowerCase().trim();
        if(secType === 'behavioural') secType = 'behavioral';
        
        if(secType === categoryType?.toLowerCase()) {
          const courseTheme = comp.competencyThemeName?.toLowerCase().trim();
          const courseSubTheme = comp.competencySubThemeName?.toLowerCase().trim();
          
          // Check if any FRAC competency matches this course competency
          for(let i = 0; i < this.planData.competencies.length; i++) {
            const fracComp = this.planData.competencies[i];
            if(fracComp['type']?.toLowerCase() === categoryType?.toLowerCase()) {
              const fracTheme = fracComp['theme']?.toLowerCase().trim();
              const fracSubTheme = fracComp['sub_theme']?.toLowerCase().trim();
              
              // Enhanced cross-matching logic (same as in getMatchedCompetencyStats):
              // 1. Course Theme vs FRAC Theme
              // 2. Course Sub Theme vs FRAC Sub Theme  
              // 3. Course Theme vs FRAC Sub Theme
              // 4. Course Sub Theme vs FRAC Theme
              const courseThemeToFracTheme = courseTheme === fracTheme;
              const courseSubThemeToFracSubTheme = courseSubTheme === fracSubTheme;
              const courseThemeToFracSubTheme = courseTheme === fracSubTheme;
              const courseSubThemeToFracTheme = courseSubTheme === fracTheme;
              
              if(courseThemeToFracTheme || courseSubThemeToFracSubTheme || 
                 courseThemeToFracSubTheme || courseSubThemeToFracTheme) {
                
                let matchType = '';
                if (courseThemeToFracTheme) matchType = 'CourseTheme-to-FRACTheme';
                else if (courseSubThemeToFracSubTheme) matchType = 'CourseSubTheme-to-FRACSubTheme';
                else if (courseThemeToFracSubTheme) matchType = 'CourseTheme-to-FRACSubTheme';
                else if (courseSubThemeToFracTheme) matchType = 'CourseSubTheme-to-FRACTheme';
                
                console.log(`✅ COMPETENCY MATCH FOUND [${matchType}] for ${categoryType}:`, {
                  course: { theme: courseTheme, subTheme: courseSubTheme },
                  frac: { theme: fracTheme, subTheme: fracSubTheme },
                  matchType: matchType
                });
                
                matchedCompetencies.push(fracTheme);
                break; // Found a match, move to next course competency
              }
            }
          }
        }
      });
    });
    
    // Remove duplicates from matched competencies
    matchedCompetencies = [...new Set(matchedCompetencies)];
    
    console.log(`\n=== ${categoryType.toUpperCase()} COMPETENCY MATCHING ===`);
    console.log(`${categoryType} - All FRAC competencies:`, allCategoryCompetencies);
    console.log(`${categoryType} - Matched from courses:`, matchedCompetencies);
    console.log(`${categoryType} - Match rate: ${matchedCompetencies.length}/${allCategoryCompetencies.length} (${Math.round((matchedCompetencies.length/allCategoryCompetencies.length)*100)}%)`);
    
    // Return unmatched competencies (those in role mapping but not covered by courses)
    return this.compareStringArrays(allCategoryCompetencies, matchedCompetencies);
  }

  compareStringArrays(arr1: string[], arr2: string[]) {
    console.log('All competencies in category:', arr1);
    console.log('Matched competencies from courses:', arr2);
    
    // Return items in arr1 that are NOT in arr2 (unmatched competencies)
    const unmatched = arr1.filter(item => !arr2.includes(item));
    console.log('Unmatched competencies:', unmatched);
    
    return unmatched;
  }
  
  addCourse() {
    const dialogRef = this.dialog.open(AddCourseComponent, {
      width: '800px',
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

  filterOnCompetencyTheme(themeName) {
    if(this.innerTabActiveIndex === 1) {
      this.filterdCourses = this.originalData.filter(item => {
        if (!item) return false;
        
        // Handle different competency property names
        let competencies = [];
        if (item.competencies && Array.isArray(item.competencies)) {
          competencies = item.competencies;
        } else if (item.competencies_v6 && Array.isArray(item.competencies_v6)) {
          competencies = item.competencies_v6;
        }
        
        return competencies.some(c => c && 
          ((c?.competencyAreaName?.toLowerCase() === 'behavioral') || c?.competencyAreaName?.toLowerCase() === 'behavioural') && 
          (c?.competencyThemeName?.toLowerCase() === themeName?.toLowerCase()));
      });
    }
    if(this.innerTabActiveIndex === 2) {
      this.filterdCourses = this.originalData.filter(item => {
        if (!item) return false;
        
        // Handle different competency property names
        let competencies = [];
        if (item.competencies && Array.isArray(item.competencies)) {
          competencies = item.competencies;
        } else if (item.competencies_v6 && Array.isArray(item.competencies_v6)) {
          competencies = item.competencies_v6;
        }
        
        return competencies.some(c => c && 
          (c?.competencyAreaName?.toLowerCase() === 'functional') && 
          (c?.competencyThemeName?.toLowerCase() === themeName?.toLowerCase()));
      });
    }
    if(this.innerTabActiveIndex === 3) {
      this.filterdCourses = this.originalData.filter(item => {
        if (!item) return false;
        
        // Handle different competency property names
        let competencies = [];
        if (item.competencies && Array.isArray(item.competencies)) {
          competencies = item.competencies;
        } else if (item.competencies_v6 && Array.isArray(item.competencies_v6)) {
          competencies = item.competencies_v6;
        }
        
        return competencies.some(c => c && 
          (c?.competencyAreaName?.toLowerCase() === 'domain') && 
          (c?.competencyThemeName?.toLowerCase() === themeName?.toLowerCase()));
      });
    }
  }

  /**
   * Initialize gap analysis stats after initial data load
   */
  initializeGapAnalysisStats() {
    // Set a small timeout to ensure all async operations complete
    setTimeout(() => {
      if (this.filterdCourses && this.filterdCourses.length > 0) {
        this.gapAnalysisStats();
      }
    }, 100);
  }

  /**
   * Update gap analysis stats after courses are updated (like suggested courses added)
   */
  updateGapAnalysisAfterCoursesUpdate() {
    // Update the original data to include all courses
    this.originalData = [...this.filterdCourses];
    
    // Recalculate gap analysis stats
    this.gapAnalysisStats();
  }

  

    // const byCategory = masterList.map(([type, list]) => {
    //     const total = list.length;
    //     const covered = list.filter(c => allCourseCompetencies.has(c)).length;
    //     return { type, total, covered };
    // });

    // const totalMaster = byCategory.reduce((sum, cat) => sum + cat.total, 0);
    // const totalCovered = byCategory.reduce((sum, cat) => sum + cat.covered, 0);
    // console.log('totalMaster', totalMaster)
    // console.log('totalCovered', totalCovered)
    // console.log('byCategory', byCategory)
    //return { totalMaster, totalCovered, byCategory };
  } 
   
  

