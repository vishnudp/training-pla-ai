import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuggestMoreCoursesComponent } from '../suggest-more-courses/suggest-more-courses.component';

@Component({
  selector: 'app-generate-course-recommendation',
  templateUrl: './generate-course-recommendation.component.html',
  styleUrls: ['./generate-course-recommendation.component.scss']
})
export class GenerateCourseRecommendationComponent {
  planData:any
  loading=false
  recommended_course_id=''
  constructor( public dialogRef: MatDialogRef<GenerateCourseRecommendationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public sharedService: SharedService, 
    private snackBar: MatSnackBar, public dialog: MatDialog) {
      this.planData = data
    }
  searchText = ''
  filterdCourses :any = []
  originalData:any = []
  selectFilterCourses:any = []
  mode= 'add'
  cbp_plan_id = ''
  ngOnInit() {
    this.sharedService.getRecommendedCourse(this.planData.id).subscribe((res)=>{
      console.log('res', res)
      this.recommended_course_id = res.id
      this.originalData = res.filtered_courses
      this.filterdCourses = res.filtered_courses
      console.log('this.filterdCourses', this.filterdCourses)
      this.getCourses()
      this.getSuggestedCourse()
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
    if(event.checked) {
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
    console.log('this.planData',this.planData)
    let reqBody = {
      "role_mapping_id": this.planData.id,
      "recommended_course_id": this.recommended_course_id,
      "course_identifiers": this.selectFilterCourses
    }
    console.log('reqBody, ',  reqBody)
    if(this.mode === 'add') {
      this.sharedService.saveCourse(reqBody).subscribe({
        next: (res) => {
          // Success handling
          console.log('Success:', res);
          this.loading = false
          this.dialogRef.close('saved')
          this.snackBar.open('Courses Saved Successfully', 'Close', {
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
            this.snackBar.open(error?.error?.detail, 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
            this.loading = false
            //this.alreadyAvailableRoleMapping.emit(this.roleMappingForm)
        }
      });
    } else {
      if(this.cbp_plan_id) {
        this.sharedService.updateCourse(reqBody, this.cbp_plan_id).subscribe({
          next: (res) => {
            // Success handling
            console.log('Success:', res);
            this.loading = false
            this.dialogRef.close('saved')
            this.snackBar.open('Courses Saved Successfully', 'Close', {
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
              this.snackBar.open(error?.error?.detail, 'Close', {
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
        if(res && res?.selected_courses && res?.selected_courses?.length) {
          this.mode = 'edit'
          for(let i=0; i<res?.selected_courses.length;i++) {
            this.selectFilterCourses.push(res.selected_courses[i]?.identifier)
          }
        }
        //this.successRoleMapping.emit(this.roleMappingForm)
      },
      error: (error) => {
        console.log('error', error)
        this.loading=false
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
        console.log('this.filterdCourses',this.filterdCourses)
        for(let i=0; i<res.length;i++) {
          this.filterdCourses.push(res[i])
        }
        //this.successRoleMapping.emit(this.roleMappingForm)
      },
      error: (error) => {
        console.log('error', error)
        this.loading=false
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
    if(this.selectFilterCourses.indexOf(item?.identifier)> -1) {
      flag = true 
    }
    return flag
  }

  selectAllCourses(event){
    if(event.checked) {
      for(let i=0; i<this.filterdCourses.length;i++) {
        this.selectFilterCourses.push(this.filterdCourses[i].identifier)
      }
    } else {
      this.selectFilterCourses = []
      this.mode = 'add'
    }
    
    
  }
  getSectors(sector) {
    if(sector && sector.length) {
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
      data: {recommended_course_id: this.recommended_course_id, role_mapping_id: this.planData.id},
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
}
