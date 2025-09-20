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
  selectedThemeFilter = ''
  originalFilteredCourses = []
  isRegenerating = false

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.gapAnalysisStats()
  }
  ngOnInit() {
    this.loading = true
    this.sharedService.getRecommendedCourse(this.planData.id).subscribe({
      next: (res) => {
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
        this.getUserCourse()
      },
      error: (error) => {
        this.loading = false
        console.error('Error getting recommended courses:', error);
        if (error.status === 401) {
          console.log('Unauthorized access - user will be redirected to login');
        } else {
          // Handle other errors gracefully
          console.error('Failed to load course recommendations');
        }
      }
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
        if (error.status === 401) {
          console.log('Unauthorized access - user will be redirected to login');
        } else {
          // Handle other errors gracefully
          console.error('Failed to load suggested courses');
        }
        // Or you can set a UI error message variable

        this.loading = false
        //this.alreadyAvailableRoleMapping.emit(this.roleMappingForm)
      }


    })
  }

  getUserCourse() {
    let role_mapping_id = this.planData.id
    this.loading = true
    this.sharedService.getUserCourse(role_mapping_id).subscribe({
      next: (res) => {
        // Success handling
        this.loading = false
        console.log('getUserCourse API response:', res)
        this.cbp_plan_id = res?.id
        this.loading = false
        console.log('Current filterdCourses before adding user courses:', this.filterdCourses)
        
        // Process and add user-added courses
        for (let i = 0; i < res.length; i++) {
          const userCourse = res[i];
          console.log(`User course ${i} competencies:`, userCourse.competencies);
          
          // Ensure user-added courses have the expected structure for display
          if (userCourse && !userCourse.course_type) {
            userCourse.course_type = 'User Added';
          }
          
          // Add identifier if missing (needed for course selection logic)
          if (userCourse && !userCourse.identifier) {
            userCourse.identifier = userCourse.id || `user_course_${i}_${Date.now()}`;
          }
          
          this.filterdCourses.push(userCourse);
        }
        
        console.log('filterdCourses after adding user courses:', this.filterdCourses);
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
      }  else {
        this.generateCourseRecommendation(this.planData)
      }
    });
  }

  generateCourseRecommendation(element: any) {
    console.log('Generate Course Recommendation clicked', element);
    // this.activeRowElement = element
    console.log('Edit Role Mapping clicked', element);
    // Navigate or open modal
    console.log('View CBP Plan clicked', element);
    const dialogRef = this.dialog.open(GenerateCourseRecommendationComponent, {
      width: '1000px',
      data: element,
       panelClass: 'view-cbp-plan-popup',
      minHeight: '400px',          // Set minimum height
      maxHeight: '90vh',           // Prevent it from going beyond viewport
      disableClose: true // Optional: prevent closing with outside click
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        console.log('Changes saved!');
        // Refresh data or show a toast here
        console.log(this.sharedService.cbpPlanFinalObj)
        if(this.sharedService.cbpPlanFinalObj && this.sharedService.cbpPlanFinalObj.ministry && this.sharedService.cbpPlanFinalObj.ministry.id) {
          this.sharedService.getRoleMappingByStateCenter(this.sharedService.cbpPlanFinalObj.ministry.id).subscribe((res)=>{
            console.log('res', res)
            // this.dataSource.data = res
            // this.dataSource.paginator = this.paginator;
            this.originalData = res;
          //  console.log('this.dataSource',this.dataSource)
            })
        } else {
          
        }
        
      }
    });
  }

  getCompetenciesByType(type: string, index): any[] {
    const course = this.filterdCourses[index];
    if (!course) {
      console.log(`No course found at index ${index}`);
      return [];
    }
    
    // Handle different competency property names
    // AI Recommended & Public courses use 'competencies'
    // Manually Suggested - iGOT courses use 'competencies_v6'
    // User Added courses use 'competencies'
    let competencies = [];
    if (course.competencies && Array.isArray(course.competencies)) {
      competencies = course.competencies;
      console.log(`Course ${index} (${course.course_type || course.name || 'Unknown'}) using 'competencies' property:`, competencies);
    } else if (course.competencies_v6 && Array.isArray(course.competencies_v6)) {
      competencies = course.competencies_v6;
      console.log(`Course ${index} (${course.course_type || course.name || 'Unknown'}) using 'competencies_v6' property:`, competencies);
    } else {
      console.log(`Course ${index} (${course.course_type || course.name || 'Unknown'}) has no valid competencies property:`, {
        hasCompetencies: !!course.competencies,
        competenciesType: typeof course.competencies,
        hasCompetenciesV6: !!course.competencies_v6,
        competenciesV6Type: typeof course.competencies_v6,
        courseKeys: Object.keys(course)
      });
    }
    
    if (competencies.length === 0) {
      console.log(`No competencies found for course ${index} and type ${type}`);
      return [];
    }
    
    // Normalize the type for comparison (case-insensitive + handle spelling variations)
    const normalizedType = type.toLowerCase().trim();
    
    const matchedCompetencies = competencies.filter(c => {
      if (!c || !c.competencyAreaName) {
        console.log(`Invalid competency structure in course ${index}:`, c);
        return false;
      }
      
      const competencyArea = c.competencyAreaName.toLowerCase().trim();
      
      // Handle both "behavioral" and "behavioural" spellings
      if (normalizedType === 'behavioural' || normalizedType === 'behavioral') {
        return competencyArea === 'behavioral' || competencyArea === 'behavioural';
      }
      
      // For other types, do case-insensitive comparison
      return competencyArea === normalizedType;
    });
    
    console.log(`Found ${matchedCompetencies.length} competencies of type ${type} for course ${index}:`, matchedCompetencies);
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
    if(event.index === 0) {
      // this.getCourses()
      // this.getSuggestedCourse()
      this.getUserCourse()
    }
  }

  onInnerTabChange(event: MatTabChangeEvent): void {
    this.innerTabActiveIndex = event.index
    this.innerTabActiveText = event.tab.textLabel
    this.selectedThemeFilter = ''; // Reset theme filter when switching tabs
    console.log('Inner Tab Index:', event.index);
    console.log('Inner Tab Label:', event.tab.textLabel);
    let tabIndex = event.index
    this.competencyMatchedByCategory = []
    
    // Get all available courses (original + suggested + user added)
    const allAvailableCourses = this.getAllAvailableCourses();
    
    switch (tabIndex) {
      case 0: // All
        this.filterdCourses = allAvailableCourses;
        break;
      case 1: // Behavioral
        this.filterdCourses = this.behavioralFilter(allAvailableCourses);
        this.competencyMatchedByCategory = this.behavioralCompetencyFilter(this.planData.competencies);
        break;
      case 2: // Functional
        this.filterdCourses = this.functionalFilter(allAvailableCourses);
        this.competencyMatchedByCategory = this.functionalCompetencyFilter(this.planData.competencies);
        break;
      case 3: // Domain
        this.filterdCourses = this.domainFilter(allAvailableCourses);
        this.competencyMatchedByCategory = this.domainCompetencyFilter(this.planData.competencies);
        break;
    }
    console.log('this.filterdCourses',this.filterdCourses)
    console.log('this.competencyMatchedByCategory',this.competencyMatchedByCategory)
  }
  
  getAllAvailableCourses() {
    // Start with original data
    const allCourses = [...this.originalData];
    const seenIdentifiers = new Set();
    
    // Track original course identifiers
    this.originalData.forEach(course => {
      if (course.identifier) seenIdentifiers.add(course.identifier);
      if (course.id) seenIdentifiers.add(course.id);
    });
    
    // Add any additional courses from filterdCourses that aren't in originalData
    // This could include suggested courses and user-added courses
    this.filterdCourses.forEach(course => {
      const courseId = course.identifier || course.id;
      if (courseId && !seenIdentifiers.has(courseId)) {
        allCourses.push(course);
        seenIdentifiers.add(courseId);
      }
    });
    
    console.log('Total available courses:', allCourses.length);
    return allCourses;
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

  behavioralCompetencyFilter(data: any[]): string[] {
    console.log('data--', data)
    const behavioralThemes = data
      .filter(item =>
        item?.type &&
        ['behavioral', 'behavioural'].includes(item.type.toLowerCase())
      )
      .map(item => `${item.theme}-${item.sub_theme}`)
      .filter((theme): theme is string => Boolean(theme)); // Ensures type safety
  
    const uniqueBehavioralThemes = Array.from(new Set(behavioralThemes));
    
    console.log(uniqueBehavioralThemes);
    return uniqueBehavioralThemes;
  }

  functionalCompetencyFilter(data:any[]):any {
    const functionalThemes = data
      .filter(item =>
        item?.type &&
        ['functional'].includes(item.type.toLowerCase())
      )
      .map(item => `${item.theme}-${item.sub_theme}`)
      .filter((theme): theme is string => Boolean(theme)); // Ensures type safety
  
    const uniqueFunctionalThemes = Array.from(new Set(functionalThemes));
    
    console.log(uniqueFunctionalThemes);
    return uniqueFunctionalThemes;
    
    // console.log(uniqueCompetencyAreaNames);
  }

  domainCompetencyFilter(data:any[]):any {
    const domainThemes = data
    .filter(item =>
      item?.type &&
      ['domain'].includes(item.type.toLowerCase())
    )
    .map(item => `${item.theme}-${item.sub_theme}`)
    .filter((theme): theme is string => Boolean(theme)); // Ensures type safety

  const uniqueDomainThemes = Array.from(new Set(domainThemes));
  
  console.log(uniqueDomainThemes);
  return uniqueDomainThemes;
    
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
  
  addCourse(missingCompetency?: string, competencyType?: string) {
    let dialogData = { ...this.planData };
    
    // If competency parameters are provided, add them to the dialog data
    if (missingCompetency && competencyType) {
      // Parse the theme from the missing competency string (assumes format "theme-subtheme" or just "theme")
      const theme = missingCompetency.trim();
      
      dialogData.prefillCompetency = {
        type: competencyType,
        theme: theme
      };
    }
    
    const dialogRef = this.dialog.open(AddCourseComponent, {
      width: '800px',
      data: dialogData,
       panelClass: 'view-cbp-plan-popup',
      minHeight: '400px',          // Set minimum height
      maxHeight: '90vh',           // Prevent it from going beyond viewport
      disableClose: true // Optional: prevent closing with outside click
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        console.log('Course added successfully! Refreshing data...');
        
        // Refresh user courses to include the newly added course
        this.getUserCourse();
        
        // Refresh gap analysis with the latest data
        setTimeout(() => {
          this.updateGapAnalysisAfterCoursesUpdate();
          console.log('Gap analysis refreshed after course addition');
        }, 500); // Small delay to ensure data is loaded
      }
    });
  }

  filterOnCompetencyTheme(themeItem) {
    this.selectedThemeFilter = themeItem;
    let themeName = themeItem?.split("-")[0]?.trim();
    let subThemeName = themeItem?.split("-")[1]?.trim();
    
    console.log('Filtering by theme:', themeName, 'subTheme:', subThemeName, 'Tab index:', this.innerTabActiveIndex);
    
    // Get the current competency type based on the active tab
    let competencyType = '';
    if(this.innerTabActiveIndex === 1) {
      competencyType = 'behavioral';
    } else if(this.innerTabActiveIndex === 2) {
      competencyType = 'functional';
    } else if(this.innerTabActiveIndex === 3) {
      competencyType = 'domain';
    }
    
    // Get all available courses using the helper method
    const allAvailableCourses = this.getAllAvailableCourses();
    console.log('Total courses to filter from:', allAvailableCourses.length);
    
    this.filterdCourses = allAvailableCourses.filter(course => {
      if (!course) return false;
      
      // Handle different competency property names
      let competencies = [];
      if (course.competencies && Array.isArray(course.competencies)) {
        competencies = course.competencies;
      } else if (course.competencies_v6 && Array.isArray(course.competencies_v6)) {
        competencies = course.competencies_v6;
      }
      
      if (competencies.length === 0) return false;
      
      // Filter by competency type and theme/subtheme
      return competencies.some(comp => {
        if (!comp) return false;
        
        // Check competency type matches current tab
        let compType = comp?.competencyAreaName?.toLowerCase();
        if (compType === 'behavioural') compType = 'behavioral'; // Normalize spelling
        
        if (compType !== competencyType) return false;
        
        // Check cross-matching like gap analysis: theme vs subtheme and subtheme vs theme
        const compTheme = comp?.competencyThemeName?.toLowerCase()?.trim();
        const compSubTheme = comp?.competencySubThemeName?.toLowerCase()?.trim();
        const searchTheme = themeName?.toLowerCase();
        const searchSubTheme = subThemeName?.toLowerCase();
        
        // Enhanced cross-matching logic like gap analysis:
        // 1. Selected Theme vs Course Theme
        // 2. Selected Sub Theme vs Course Sub Theme  
        // 3. Selected Theme vs Course Sub Theme
        // 4. Selected Sub Theme vs Course Theme
        const themeToThemeMatch = searchTheme && compTheme === searchTheme;
        const subThemeToSubThemeMatch = searchSubTheme && compSubTheme === searchSubTheme;
        const themeToSubThemeMatch = searchTheme && compSubTheme === searchTheme;
        const subThemeToThemeMatch = searchSubTheme && compTheme === searchSubTheme;
        
        const isMatch = themeToThemeMatch || subThemeToSubThemeMatch || themeToSubThemeMatch || subThemeToThemeMatch;
        
        // Log matches for debugging (similar to gap analysis)
        if (isMatch) {
          let matchType = '';
          if (themeToThemeMatch) matchType = 'Theme-to-Theme';
          else if (subThemeToSubThemeMatch) matchType = 'SubTheme-to-SubTheme';
          else if (themeToSubThemeMatch) matchType = 'Theme-to-SubTheme';
          else if (subThemeToThemeMatch) matchType = 'SubTheme-to-Theme';
          
          console.log(`✅ FILTER MATCH FOUND [${matchType}]:`, {
            selected: { theme: searchTheme, subTheme: searchSubTheme },
            course: { type: compType, theme: compTheme, subTheme: compSubTheme },
            matchType: matchType
          });
        }
        
        // Match if any of the cross-matching conditions are met
        return isMatch;
      });
    });
    
    console.log('Filtered courses for theme:', themeName, 'Count:', this.filterdCourses.length);
    console.log('Filtered courses:', this.filterdCourses.map(c => c.name || c.course));
  }
  
  clearThemeFilter() {
    this.selectedThemeFilter = '';
    // Reset to category filtered courses by calling the tab change method
    this.onInnerTabChange({ 
      index: this.innerTabActiveIndex, 
      tab: { textLabel: this.innerTabActiveText } 
    } as any);
    console.log('Theme filter cleared, showing all courses for category:', this.innerTabActiveText);
  }
  
  isThemeSelected(theme: string): boolean {
    return this.selectedThemeFilter === theme;
  }

  /**
   * Add course for the currently selected theme filter with prefilled competency data
   */
  addCourseForSelectedTheme() {
    if (!this.selectedThemeFilter) {
      console.warn('No theme selected for adding course');
      return;
    }

    // Parse theme and sub-theme from selectedThemeFilter (format: "Theme - SubTheme")
    const themeParts = this.selectedThemeFilter.split('-');
    const theme = themeParts[0]?.trim();
    const subTheme = themeParts[1]?.trim();

    // Get the current competency type based on the active tab
    // Map the tab labels to the format expected by AddCourseComponent
    let competencyType = '';
    if (this.innerTabActiveIndex === 1) {
      competencyType = 'Behavioral'; // Tab label is "behavioural"
    } else if (this.innerTabActiveIndex === 2) {
      competencyType = 'Functional'; // Tab label is "functional"
    } else if (this.innerTabActiveIndex === 3) {
      competencyType = 'Domain'; // Tab label is "domain"
    }

    console.log('Tab mapping - innerTabActiveIndex:', this.innerTabActiveIndex, 
                'innerTabActiveText:', this.innerTabActiveText, 
                'mapped competencyType:', competencyType);

    console.log('Adding course for missing competency:', {
      competencyType,
      theme,
      subTheme,
      selectedThemeFilter: this.selectedThemeFilter
    });

    // Create dialog data with prefilled competency information
    let dialogData = { ...this.planData };
    dialogData.prefillCompetency = {
      type: competencyType,
      theme: theme,
      subTheme: subTheme || '' // Include sub-theme if available
    };

    const dialogRef = this.dialog.open(AddCourseComponent, {
      width: '800px',
      data: dialogData,
      panelClass: 'view-cbp-plan-popup',
      minHeight: '400px',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        console.log('Course added successfully for competency! Refreshing data...');
        
        // Refresh user courses to include the newly added course
        this.getUserCourse();
        
        // Update gap analysis after course addition
        this.updateGapAnalysisAfterCoursesUpdate();
      }
    });
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

  /**
   * Regenerate course recommendations by deleting existing recommendations and generating new ones
   */
  async regenerateCourseRecommendations() {
    if (this.isRegenerating) {
      return; // Prevent multiple simultaneous regenerations
    }

    try {
      this.isRegenerating = true;
      
      // Show confirmation dialog
      const confirmed = await this.showConfirmationDialog();
      
      if (!confirmed) {
        this.isRegenerating = false;
        return;
      }

      console.log('Starting course recommendation regeneration...');
      
      // Step 1: Delete existing course recommendations
      await this.deleteCourseRecommendations();
      
      // Step 2: Generate new course recommendations
      await this.generateNewCourseRecommendations();
      
      // Step 3: Refresh the current data
      this.refreshComponent();
      
      console.log('Course recommendation regeneration completed successfully');
      
      // Show success message
      this.snackBar.open('Course recommendations regenerated successfully!', 'Close', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      
    } catch (error) {
      console.error('Error during course recommendation regeneration:', error);
      
      // Show error message
      this.snackBar.open('Failed to regenerate course recommendations. Please try again.', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    } finally {
      this.isRegenerating = false;
    }
  }

  /**
   * Show confirmation dialog for regenerate action
   */
  private showConfirmationDialog(): Promise<boolean> {
    return new Promise((resolve) => {
      // Create a custom confirmation dialog
      const dialogRef = this.dialog.open(RegenerateConfirmationDialog, {
        width: '450px',
        panelClass: 'regenerate-confirmation-dialog',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        resolve(result === true);
      });
    });
  }

  /**
   * Delete existing course recommendations for the current role mapping
   */
  private deleteCourseRecommendations(): Promise<any> {
    return new Promise((resolve, reject) => {
      const roleMapId = this.planData?.id;
      
      if (!roleMapId) {
        reject(new Error('Role mapping ID not found'));
        return;
      }

      console.log('Deleting course recommendations for role mapping:', roleMapId);
      
      this.sharedService.deleteCourseRecommendations(roleMapId).subscribe({
        next: (response) => {
          console.log('Course recommendations deleted successfully:', response);
          resolve(response);
        },
        error: (error) => {
          console.error('Error deleting course recommendations:', error);
          reject(error);
        }
      });
    });
  }

  /**
   * Generate new course recommendations
   */
  private generateNewCourseRecommendations(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('Generating new course recommendations...');
      
      this.sharedService.getRecommendedCourse(this.planData.id).subscribe({
        next: (response) => {
          console.log('New course recommendations generated successfully:', response);
          resolve(response);
        },
        error: (error) => {
          console.error('Error generating course recommendations:', error);
          reject(error);
        }
      });
    });
  }

  /**
   * Refresh the component data after regeneration
   */
  private refreshComponent() {
    console.log('Refreshing component data...');
    
    // Reset all filters and selections
    this.selectedThemeFilter = '';
    this.selectFilterCourses = [];
    this.filterdCourses = [];
    this.originalFilteredCourses = [];
    
    // Reset tab states
    this.innerTabActiveIndex = 0;
    this.outerTabActiveIndex = 0;
    
    // Reload the data
    this.ngOnInit();
  }
}

// Confirmation Dialog Component
@Component({
  selector: 'regenerate-confirmation-dialog',
  template: `
    <div class="confirmation-dialog-container">
      <div class="dialog-header">
        <mat-icon class="warning-icon">refresh</mat-icon>
        <h2 mat-dialog-title>Regenerate Course Recommendations</h2>
      </div>
      
      <mat-dialog-content class="dialog-content">
        <p class="main-message">
          This will delete all current course recommendations and generate new ones based on the latest role mapping.
        </p>
        <p class="sub-message">
          Are you sure you want to continue?
        </p>
      </mat-dialog-content>
      
      <mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-btn">
          Cancel
        </button>
        <button mat-raised-button color="primary" (click)="onConfirm()" class="confirm-btn">
          <mat-icon>refresh</mat-icon>
          Yes, Regenerate
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirmation-dialog-container {
      padding: 0;
    }
    
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 24px 16px 24px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .warning-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: #ff9800;
    }
    
    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    
    .dialog-content {
      padding: 24px;
    }
    
    .main-message {
      font-size: 16px;
      color: #333;
      margin: 0 0 12px 0;
      line-height: 1.5;
    }
    
    .sub-message {
      font-size: 14px;
      color: #666;
      margin: 0;
      font-weight: 500;
    }
    
    .dialog-actions {
      padding: 16px 24px 24px 24px;
      gap: 12px;
      justify-content: flex-end;
    }
    
    .cancel-btn {
      color: #666;
    }
    
    .confirm-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        margin: 0;
      }
    }
  `]
})
export class RegenerateConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<RegenerateConfirmationDialog>
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
