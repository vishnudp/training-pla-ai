import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/modules/shared/services/shared.service';

@Component({
  selector: 'app-suggest-more-courses',
  templateUrl: './suggest-more-courses.component.html',
  styleUrls: ['./suggest-more-courses.component.scss']
})
export class SuggestMoreCoursesComponent implements OnInit{
  searchText = ''
  suggestedCourses:any = []
  originalData:any = []
  selectFilterCourses:any = []
  planData:any = {}
  loading=false
  constructor(
    public dialogRef: MatDialogRef<SuggestMoreCoursesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public sharedService: SharedService,
    public snackBar: MatSnackBar
  ) {
    this.planData= data
  }


  ngOnInit() {
    let reqBody = {
      "skip": 0,
      "limit": 20,
      "search_term": this.searchText
    }
    this.sharedService.getIGOTSuggestedCourses(reqBody).subscribe((res)=>{
      console.log('res--', res)
      this.suggestedCourses = res
      this.originalData = res
    })
  }
  applyFilter() {
    this.suggestedCourses = this.filterData(this.searchText);
  }

  searchData() {

  }

  cancel() {
    this.dialogRef.close()
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

  addCourses() {
    let reqBody = {
      "role_mapping_id": this.planData.role_mapping_id,
      "recommended_course_id": this.planData.recommended_course_id,
      "course_identifiers": this.selectFilterCourses
    }
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
  }

  selectAllCourses(event) {
    if(event.checked) {
      for(let i=0; i<this.suggestedCourses.length;i++) {
        this.selectFilterCourses.push(this.suggestedCourses[i].identifier)
      }
    } else {
      this.selectFilterCourses = []
    }
    console.log('this.selectFilterCourses', this.selectFilterCourses)
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

  checkIfCourseExists(item) {
    let flag = false
    if(this.selectFilterCourses.indexOf(item?.identifier)> -1) {
      flag = true 
    }
    return flag
  }
}
