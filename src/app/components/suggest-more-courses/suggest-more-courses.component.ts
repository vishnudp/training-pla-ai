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

  // Pagination properties
  currentPage = 0
  pageSize = 12
  totalCount = 0
  totalPages = 0
  constructor(
    public dialogRef: MatDialogRef<SuggestMoreCoursesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedService: SharedService,
    public snackBar: MatSnackBar
  ) {
    this.planData= data
  }


  ngOnInit() {
    this.loadAllCourses();
  }
  applyFilter() {
    // This method is kept for future use if needed
    // Search is now only triggered by search button click
  }

  searchData() {
    console.log('searchData called with searchText:', this.searchText);

    // Reset to first page when searching
    this.currentPage = 0;

    if (!this.searchText.trim()) {
      console.log('Search text is empty, loading all courses');
      this.loadAllCourses();
      return;
    }

    // Call the dedicated search method
    this.performSearch();
  }

  loadAllCourses() {
    this.loading = true;
    let reqBody = {
      "request": {
        "filters": {
          "primaryCategory": [
            "Course"
          ],
          "status": [
            "Live"
          ],
          "courseCategory": [
            "Course"
          ]
        },
        "fields": [
          "posterImage",
          "description",
          "name"
        ],
        "sort_by": {
          "createdOn": "desc"
        },
        "limit": this.pageSize,
        "offset": this.currentPage * this.pageSize
      }
    };

    console.log('Load all courses request body:', reqBody);

    this.sharedService.getIGOTSuggestedCourses(reqBody).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('All courses loaded:', res);
        if (res && res.result) {
          this.suggestedCourses = res.result.content || [];
          this.originalData = res.result.content || [];
          this.totalCount = res.result.totalHits || res.result.count || 0;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        } else {
          this.suggestedCourses = [];
          this.originalData = [];
          this.totalCount = 0;
          this.totalPages = 0;
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Load courses error:', error);
        this.snackBar.open('Failed to load courses. Please try again.', 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  cancel() {
    this.dialogRef.close()
  }

  // Pagination methods
  onPageChange(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      if (this.searchText.trim()) {
        this.performSearch();
      } else {
        this.loadAllCourses();
      }
    }
  }

  // Separate method for performing search with query
  performSearch() {
    if (!this.searchText.trim()) {
      this.loadAllCourses();
      return;
    }

    this.loading = true;

    let reqBody = {
      "request": {
        "filters": {
          "primaryCategory": [
            "Course"
          ],
          "status": [
            "Live"
          ],
          "courseCategory": [
            "Course"
          ]
        },
        "fields": [
          "posterImage",
          "description",
          "name"
        ],
        "sort_by": {
          "createdOn": "desc"
        },
        "query": this.searchText.trim(),
        "limit": this.pageSize,
        "offset": this.currentPage * this.pageSize
      }
    };

    console.log('Perform search request body:', JSON.stringify(reqBody, null, 2));

    this.sharedService.getIGOTSuggestedCourses(reqBody).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('Search results:', res);
        if (res && res.result) {
          this.suggestedCourses = res.result.content || [];
          this.originalData = res.result.content || [];
          this.totalCount = res.result.totalHits || res.result.count || 0;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        } else {
          this.suggestedCourses = [];
          this.originalData = [];
          this.totalCount = 0;
          this.totalPages = 0;
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Search error:', error);
        this.snackBar.open('Search failed. Please try again.', 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  goToFirstPage() {
    this.onPageChange(0);
  }

  goToPreviousPage() {
    this.onPageChange(this.currentPage - 1);
  }

  goToNextPage() {
    this.onPageChange(this.currentPage + 1);
  }

  goToLastPage() {
    this.onPageChange(this.totalPages - 1);
  }

  clearSearch() {
    this.searchText = '';
    this.currentPage = 0;
    this.loadAllCourses();
  }

  // Helper methods for pagination UI
  get hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages - 1;
  }

  get startItem(): number {
    return this.currentPage * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalCount);
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
      //"recommended_course_id": this.planData.recommended_course_id,
      "course_identifiers": this.selectFilterCourses
    }
    this.sharedService.saveSuggestedCourse(reqBody).subscribe({
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
      const index = this.selectFilterCourses.indexOf(item?.identifier);

      if (index !== -1) {
        this.selectFilterCourses.splice(index, 1);
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

  onImgError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/career/careers1.png'; // replace with your default image path
  }
}
