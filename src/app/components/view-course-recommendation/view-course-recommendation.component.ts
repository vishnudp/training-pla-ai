import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenerateCourseRecommendationComponent } from '../generate-course-recommendation/generate-course-recommendation.component';
import { AddPersonalisationComponent } from '../add-personalisation/add-personalisation.component';
import html2pdf from 'html2pdf.js';
import { DeleteRoleMappingPopupComponent } from '../delete-role-mapping-popup/delete-role-mapping-popup.component';

@Component({
  selector: 'app-view-course-recommendation',
  templateUrl: './view-course-recommendation.component.html',
  styleUrls: ['./view-course-recommendation.component.scss']
})
export class ViewCourseRecommendationComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  planData:any
  loading=false
  recommended_course_id=''
  cbpPlanData:any
  suggestedCourses: any = []
  constructor( public dialogRef: MatDialogRef<ViewCourseRecommendationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private sharedService: SharedService, private dialog: MatDialog, private snackBar: MatSnackBar) {
      this.planData = data
    }
  searchText = ''
  filterdCourses :any
  selectFilterCourses:any = []
  competenciesCount = {total:0, public_courses:0, igot:0}
  expandedCompetencies: any = {}; // Track expanded state for each course and competency type
  isPDFDownload = false
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

    this.sharedService.getUserRecommendationCourse(this.planData.id).subscribe({
      next: (res) => {
        this.loading = false
        console.log('res', res)
        this.recommended_course_id = res.id
        let allCourses = []
        if(res && res.selected_courses && res.selected_courses.length) {
          res.selected_courses.forEach((item)=>{
            // if(item?.relevancy >= 85) {
              allCourses.push(item)
            // }
          })
        }
        this.filterdCourses = allCourses
        console.log('this.filterdCourses', this.filterdCourses)
        this.updateCompetencyCounts()
        // this.getSuggestedCourse()
        // this.getUserCourse()
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

  closeDialog() {
    this.dialogRef.close()
  }

  addMoreCourses() {
    this.dialogRef.close();
    console.log('Generate Course Recommendation clicked', this.planData);
    
    console.log('Edit Role Mapping clicked', this.planData);
    // Navigate or open modal
    console.log('View CBP Plan clicked', this.planData);
    const dialogRef = this.dialog.open(GenerateCourseRecommendationComponent, {
      width: '1000px',
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

  addPersonilisation() {
    this.dialogRef.close();
    console.log('Generate Course Recommendation clicked', this.planData);
    
    console.log('Edit Role Mapping clicked', this.planData);
    // Navigate or open modal
    console.log('View CBP Plan clicked', this.planData);
    const dialogRef = this.dialog.open(AddPersonalisationComponent, {
      width: '1000px',
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

  getSuggestedCourse() {
    let role_mapping_id = this.planData.id
    this.loading = true
    this.sharedService.getSuggestedCourses(role_mapping_id).subscribe({
      next: (res) => {
        // Success handling
        this.loading = false
        console.log('getSuggestedCourses res', res)
        
        // Store suggested courses separately
        this.suggestedCourses = [...res];
        
        // Add suggested courses to filtered courses
        for (let i = 0; i < res.length; i++) {
          this.filterdCourses.push(res[i])
        }
        
        // Update competency counts after adding suggested courses
        this.updateCompetencyCounts()
        
        console.log('filterdCourses after adding suggested courses:', this.filterdCourses);
      },
      error: (error) => {
        console.log('getSuggestedCourse error', error)
        this.loading = false
        if (error.status === 401) {
          console.log('Unauthorized access - user will be redirected to login');
        } else {
          console.error('Failed to load suggested courses');
        }
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
        
        // Process user-added courses to ensure proper structure
        for (let i = 0; i < res.length; i++) {
          this.filterdCourses.push(res[i])
        }
        
        // Update competency counts after adding user courses
        this.updateCompetencyCounts()
        
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

  downloadPDF() {
    this.loading = true
    this.isPDFDownload = true
    const element = this.pdfContent.nativeElement;

  // Wait for images to load
  const images = element.querySelectorAll('img');
  const promises = Array.from(images).map((img: HTMLImageElement) => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => img.onload = resolve);
  });

  Promise.all(promises).then(() => {
    const options = {
      margin: 0.5,
      filename: 'Recommended Coureses.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0,
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: {
        mode: ['css', 'legacy', 'avoid-all']
      }
    };

    html2pdf().from(element).set(options).save()
    setTimeout(() => {
      this.loading = false;
      this.isPDFDownload = false
    }, 3000); 
  });
}

downloadPdfFromBE() {
  this.loading = true
//  this.sharedService.downloadPdf(this.sharedService?.cbpPlanFinalObj.ministry.identifier)
  
  this.sharedService.downloadPdfForCourseRecommendation(this.data?.id)  
  
  
  setTimeout(()=>{
    this.loading = false
  },5000)
}

confirmDeleteCourse(item: any, index: number) {
  const roleMappingId = this.recommended_course_id;
  const courseIdentifier =
    item?.course_identifier || item?.id || item?.identifier;

  if (!roleMappingId || !courseIdentifier) {
    this.snackBar.open('Unable to delete course', 'X', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
    return;
  }

  this.loading = true;

  this.sharedService
    .deleteRecommendedCourse(roleMappingId, courseIdentifier)
    .subscribe({
      next: () => {
        // Remove from UI
        this.filterdCourses.splice(index, 1);

        // Update counts
        this.updateCompetencyCounts();

        this.loading = false;

        this.snackBar.open('Course deleted successfully', 'X', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      },
      error: (error) => {
        this.loading = false;

        this.snackBar.open(
          error?.error?.detail || 'Failed to delete course',
          'X',
          {
            duration: 3000,
            panelClass: ['snackbar-error']
          }
        );
      }
    });

  }

deleteCard(item: any, index: number) {
  const dialogRef = this.dialog.open(DeleteRoleMappingPopupComponent, {
    width: '600px',
    data: {
      planId: this.planData?.id,   // role mapping id
      course: item,                // course object
      index: index,
      from : 'viewCourse'                 // index for UI removal
    },
    panelClass: 'view-cbp-plan-popup',
    minHeight: '300px',
    maxHeight: '90vh',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'saved') {
      this.confirmDeleteCourse(item, index);
    }
  });
}
}
