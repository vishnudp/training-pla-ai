import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ViewCbpPlanComponent } from '../view-cbp-plan/view-cbp-plan.component';
import { EditCbpPlanComponent } from '../edit-cbp-plan/edit-cbp-plan.component';
import { GenerateCourseRecommendationComponent } from '../generate-course-recommendation/generate-course-recommendation.component';
import { DeleteRoleMappingComponent } from '../delete-role-mapping/delete-role-mapping.component';
import { ViewCourseRecommendationComponent } from '../view-course-recommendation/view-course-recommendation.component';
import { ViewFinalCbpPlanComponent } from '../view-final-cbp-plan/view-final-cbp-plan.component';
import { ListPopupComponent } from '../list-popup/list-popup.component';
@Component({
  selector: 'app-role-mapping-list',
  templateUrl: './role-mapping-list.component.html',
  styleUrls: ['./role-mapping-list.component.scss']
})
export class RoleMappingListComponent {
  @Input() formData:any
  searchText = ''
  selectedValue =''
  displayedColumns: string[] = [
    'designation_name',
    'role_responsibilities',
    'activities',
    'behavioral',
    'functional',
    'domain',
    'action'
  ];
  dataSource = new MatTableDataSource<any>([]);
  filteredData = [];
  originalData: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  expandedResponsibilityRows: { [id: string]: boolean } = {};
  expandedActivityRows: { [id: string]: boolean } = {};
  activeRowElement:any
  @Output() moveToInitialScreen = new EventEmitter<any>()
  constructor(
    public sharedService: SharedService, 
    private dialog: MatDialog) {

  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    console.log('haredService?.cbpPlanFinalObj', this.sharedService?.cbpPlanFinalObj)
    if(this.formData && this.formData.value && this.formData.value.ministryType === 'center') {
      let state_center_id = this.formData.value.ministry
      this.sharedService.getRoleMappingByStateCenter(state_center_id).subscribe((res)=>{
       console.log('res', res)
       this.dataSource.data = res
       this.dataSource.paginator = this.paginator;
       this.originalData = res;
       console.log('this.dataSource',this.dataSource)
       })
    }
    if(this.formData && this.formData.value && this.formData.value.ministryType === 'state') {
      console.log('this.formData',this.formData)
      let state_center_id = this.formData.value.ministry
      let department_id = this.formData.value.departments
      this.sharedService.getRoleMappingByStateCenterAndDepartment(state_center_id, department_id).subscribe((res)=>{
       console.log('res', res)
       this.dataSource.data = res
       this.dataSource.paginator = this.paginator;
       this.originalData = res;
       console.log('this.dataSource',this.dataSource)
       })
    }
  }

  getCompetenciesByType(competencies: any[], type: string): any[] {
    return competencies?.filter(c => c.type === type) || [];
  }

  viewDetails(element: any): void {
    console.log('View clicked:', element);
    
  }

  deleteItem(element: any): void {
    console.log('Delete clicked:', element);
    // Optionally remove from dataSource
    this.dataSource.data = this.dataSource.data.filter(item => item.id !== element.id);
  }

  searchData() {
    this.filteredData = this.filterData(this.searchText);
    this.dataSource = new MatTableDataSource(this.filteredData);
  }

  applyFilter() {
    this.filteredData = this.filterData(this.searchText);
    this.dataSource = new MatTableDataSource(this.filteredData);
  }

  editRoleMapping(element: any) {
    this.activeRowElement = element
    console.log('Edit Role Mapping clicked', element);
    // Navigate or open modal
    console.log('View CBP Plan clicked', element);
    const dialogRef = this.dialog.open(EditCbpPlanComponent, {
      width: '1000px',
      data: element,
       panelClass: 'view-cbp-plan-popup',
      minHeight: '300px',          // Set minimum height
      maxHeight: '80vh',           // Prevent it from going beyond viewport
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
            this.dataSource.data = res
            this.dataSource.paginator = this.paginator;
            this.originalData = res;
            console.log('this.dataSource',this.dataSource)
            })
        } else {

        }
        
      }
    });
  }
  
  viewCBPPlan(element: any) {
    this.activeRowElement = element
    console.log('View CBP Plan clicked', element);
    const dialogRef = this.dialog.open(ViewCbpPlanComponent, {
      width: '1000px',
      data: element,
       panelClass: 'view-cbp-plan-popup',
      minHeight: '300px',          // Set minimum height
      maxHeight: '80vh',           // Prevent it from going beyond viewport
      disableClose: true // Optional: prevent closing with outside click
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        console.log('Changes saved!');
        // Refresh data or show a toast here
      }
    });
  }
  
  generateCourseRecommendation(element: any) {
    console.log('Generate Course Recommendation clicked', element);
     this.activeRowElement = element
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
            this.dataSource.data = res
            this.dataSource.paginator = this.paginator;
            this.originalData = res;
            console.log('this.dataSource',this.dataSource)
            })
        } else {
          
        }
        
      }
    });
  }
  
  viewCourseRecommendation(element: any) {
    console.log('View Course Recommendation clicked', element);
    this.activeRowElement = element
    console.log('Edit Role Mapping clicked', element);
    // Navigate or open modal
    console.log('View CBP Plan clicked', element);
    const dialogRef = this.dialog.open(ViewCourseRecommendationComponent, {
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
            this.dataSource.data = res
            this.dataSource.paginator = this.paginator;
            this.originalData = res;
            console.log('this.dataSource',this.dataSource)
            })
        } else {
          
        }
        
      }
    });
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

  getSectors(sector) {
    if(sector && sector.length) {
      return Array.isArray(sector) ? sector.join('/ ') : ''
    }
    
  }

  toggleResponsibilityExpand(id: string): void {
    this.expandedResponsibilityRows[id] = !this.expandedResponsibilityRows[id];
  }
  
  isResponisbilityExpanded(id: string): boolean {
    
    
    // const dialogRef = this.dialog.open(ListPopupComponent, {
    //   width: '1000px',
    //   data: this.activeRowElement,
    //    panelClass: 'view-cbp-plan-popup',
    //   minHeight: '400px',          // Set minimum height
    //   maxHeight: '90vh',           // Prevent it from going beyond viewport
    //   disableClose: true // Optional: prevent closing with outside click
    // });
  
    // dialogRef.afterClosed().subscribe(result => {
    //   return false
    // });
    return this.expandedResponsibilityRows[id];
  }

  toggleActivityExpand(id: string): void {
    this.expandedActivityRows[id] = !this.expandedActivityRows[id];
  }
  
  isActivityExpanded(id: string): boolean {
    return this.expandedActivityRows[id];
  }



  addMoreDesignation() {

  }

  deleteRoleMapping(element) {
    console.log('Generate Course Recommendation clicked', element);
     this.activeRowElement = element
    console.log('Edit Role Mapping clicked', element);
    // Navigate or open modal
    console.log('View CBP Plan clicked', element);
    const dialogRef = this.dialog.open(DeleteRoleMappingComponent, {
      width: '600px',
      data: element,
       panelClass: 'view-cbp-plan-popup',
      minHeight: '300px',          // Set minimum height
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
            this.dataSource.data = res
            this.dataSource.paginator = this.paginator;
            this.originalData = res;
            console.log('this.dataSource',this.dataSource)
            })
        } else {
          
        }
        
      }
    });
  }

  viewFinalCBPPlan() {
    const dialogRef = this.dialog.open(ViewFinalCbpPlanComponent, {
      width: '1100px',
      data: '',
       panelClass: 'view-cbp-plan-popup',
      minHeight: '300px',          // Set minimum height
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

  moveToInitialScreenLayout(event) {
    this.moveToInitialScreen.emit(event)
  }

  openFullList(element: any, type: 'role_responsibilities' | 'activities') {
    const listToShow: string[] = element[type] || [];
    const title = type === 'role_responsibilities' ? 'Role & Responsibilities' : 'Activities';

    const dialogRef = this.dialog.open(ListPopupComponent, {
      width: '600px',
      data: { element: element, type: type},
      disableClose: true,
      maxHeight: '80vh'
    });

    dialogRef.afterClosed().subscribe(() => {
      // No need to do anything special here to reset inline expanded state
      // Because you're using dialog, not inline expand – view remains in initial (collapsed) state
    });
  }
  
  
  
}
