import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { data } from 'jquery';
import { SharedService } from 'src/app/modules/shared/services/shared.service';

@Component({
  selector: 'app-gap-analysis-recommended-course',
  templateUrl: './gap-analysis-recommended-course.component.html',
  styleUrls: ['./gap-analysis-recommended-course.component.scss']
})
export class GapAnalysisRecommendedCourseComponent {

  @Input() planData:any
  loading=false
  recommended_course_id=''
  cbpPlanData:any
  constructor( private sharedService: SharedService, private dialog: MatDialog, private snackBar: MatSnackBar) {
      this.planData = data
    }
  searchText = ''
  filterdCourses :any
  selectFilterCourses:any = []
  competenciesCount = {total:0, public_courses:0, igot:0}
  expandedCompetencies: any = {}; // Track expanded state for each course and competency type
  ngOnInit() {
    this.loading = true
    this.cbpPlanData = this.sharedService.cbpPlanFinalObj
    // this.sharedService.getRecommendedCourse(this.planData.id).subscribe((res)=>{
    //   this.loading = false
    //   console.log('res', res)
    //   this.recommended_course_id = res.id
    //   let allCourses = []
    //   if(res && res.filtered_courses && res.filtered_courses.length) {
    //     res.filtered_courses.forEach((item)=>{
    //       if(item?.relevancy > 85) {
    //         allCourses.push(item)
    //       }
    //     })
    //   }
    //   this.filterdCourses = allCourses
    //   console.log('this.filterdCourses', this.filterdCourses)
    //   this.updateCompetencyCounts()
    //   this.getUserCourse()
    // })

    this.sharedService.getRecommendedCourse(this.planData.id).subscribe({
      next: (res) => {
        this.loading = false
        console.log('res', res)
        this.recommended_course_id = res.id
        let allCourses = []
        if(res && res.filtered_courses && res.filtered_courses.length) {
          res.filtered_courses.forEach((item)=>{
            if(item?.relevancy > 85) {
              allCourses.push(item)
            }
          })
        }
        this.filterdCourses = allCourses
        console.log('this.filterdCourses', this.filterdCourses)
        this.updateCompetencyCounts()
        this.getUserCourse()
      },
      error: (error) => {
        this.loading = false
        this.snackBar.open(error?.error?.detail, 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  updateCompetencyCounts() {
   // const comps = this.competenciesArray.value;
    this.competenciesCount = {total: 0, public_courses: 0, igot: 0};
    this.filterdCourses.forEach(c => {
      this.competenciesCount.total++;
      if (c.is_public) this.competenciesCount.public_courses++;
      if (!c.is_public) this.competenciesCount.igot++;
    });
  }





  getUserCourse() {
    let role_mapping_id = this.planData.id
    this.loading = true
    this.sharedService.getUserCourse(role_mapping_id).subscribe({
      next: (res) => {
        // Success handling
        this.loading = false
        
        // Process user-added courses to ensure proper structure
        for (let i = 0; i < res.length; i++) {
          this.filterdCourses.push(res[i])
        }
        
        // Rebuild filterdCourses to include all course types
        
        
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
//      console.log(`Course ${index} (${course.course_type || course.name || 'Unknown'}) using 'competencies' property:`, competencies);
    } else if (course.competencies_v6 && Array.isArray(course.competencies_v6)) {
      competencies = course.competencies_v6;
    //  console.log(`Course ${index} (${course.course_type || course.name || 'Unknown'}) using 'competencies_v6' property:`, competencies);
    } else {
      // console.log(`Course ${index} (${course.course_type || course.name || 'Unknown'}) has no valid competencies property:`, {
      //   hasCompetencies: !!course.competencies,
      //   competenciesType: typeof course.competencies,
      //   hasCompetenciesV6: !!course.competencies_v6,
      //   competenciesV6Type: typeof course.competencies_v6,
      //   courseKeys: Object.keys(course)
      // });
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
    
//    console.log(`Found ${matchedCompetencies.length} competencies of type ${type} for course ${index}:`, matchedCompetencies);
    return matchedCompetencies;
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


}
