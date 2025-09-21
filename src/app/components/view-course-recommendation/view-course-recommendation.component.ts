import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenerateCourseRecommendationComponent } from '../generate-course-recommendation/generate-course-recommendation.component';
import { AddPersonalisationComponent } from '../add-personalisation/add-personalisation.component';
import html2pdf from 'html2pdf.js';

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
  constructor( public dialogRef: MatDialogRef<ViewCourseRecommendationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private sharedService: SharedService, private dialog: MatDialog, private snackBar: MatSnackBar) {
      this.planData = data
    }
  searchText = ''
  filterdCourses :any
  selectFilterCourses:any = []
  competenciesCount = {total:0, public_courses:0, igot:0}
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

  downloadPDF() {
    this.loading = true
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
    }, 3000); 
  });
}
}
