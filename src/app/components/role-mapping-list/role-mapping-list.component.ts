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
import { AddDesignationComponent } from '../add-designation/add-designation.component';
@Component({
  selector: 'app-role-mapping-list',
  templateUrl: './role-mapping-list.component.html',
  styleUrls: ['./role-mapping-list.component.scss']
})
export class RoleMappingListComponent {
  @Input() formData:any = {}
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
  searchResults: any[] = []; // Store search results for pagination
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  expandedResponsibilityRows: { [id: string]: boolean } = {};
  expandedActivityRows: { [id: string]: boolean } = {};
  activeRowElement:any
  cbpFinalObj:any ={}
  loading = false
  @Output() moveToInitialScreen = new EventEmitter<any>()
  constructor(
    public sharedService: SharedService, 
    private dialog: MatDialog) {

  }

  ngAfterViewInit() {
   // this.dataSource.paginator = this.paginator;
   // this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    console.log('haredService?.cbpPlanFinalObj', this.sharedService?.cbpPlanFinalObj)
    
    this.cbpFinalObj = this.sharedService.getCBPPlanLocalStorage()
    this.dataSource = new MatTableDataSource(this.cbpFinalObj?.role_mapping_generation)
    this.originalData = this.cbpFinalObj?.role_mapping_generation
    if(this.cbpFinalObj && this.cbpFinalObj?.ministry && (this.cbpFinalObj?.ministry.sbOrgType)) {
      this.sharedService.cbpPlanFinalObj = this.cbpFinalObj
      if(this.cbpFinalObj?.ministry.sbOrgType === 'ministry') {
        this.formData = {}
        this.formData['value'] = {}
        this.formData['value']['ministryType'] = this.cbpFinalObj?.ministry.sbOrgType
        this.formData['value']['ministry'] = this.cbpFinalObj?.ministry?.identifier
        this.formData['value']['departments'] = this.cbpFinalObj?.departments
      } else if (this.cbpFinalObj?.ministry.sbOrgType === 'state') {
        this.formData = {}
        this.formData['value'] = {}
        this.formData['value']['ministryType'] = this.cbpFinalObj?.ministry.sbOrgType
        this.formData['value']['ministry'] = this.cbpFinalObj?.ministry?.identifier
        this.formData['value']['departments'] = this.cbpFinalObj?.departments
      }
    } 
    console.log('this.formData', this.formData  )
      if(this.formData && this.formData.value && this.formData.value.ministryType === 'ministry') {

        let state_center_id = this.formData.value.ministry
        this.loading = true
        if(this.formData.value.departments) {
          let department_id = this.formData.value.departments
          if(typeof department_id === 'string') {
            this.sharedService.getRoleMappingByStateCenterAndDepartment(state_center_id, department_id).subscribe({
              next:(res)=>{
                this.loading = false
                this.sharedService.cbpPlanFinalObj['role_mapping_generation'] = res
                this.dataSource = new MatTableDataSource(res)
                setTimeout(()=>{
                 this.dataSource.paginator = this.paginator;
                },1000)
                this.originalData = res;
                console.log('this.dataSource',this.dataSource)
              },
              error:()=>{
                this.loading = false
              }
            })
          } else {
            this.loading = false
          }
          
        } else {
          this.sharedService.getRoleMappingByStateCenter(state_center_id).subscribe((res)=>{
            this.loading = false
           console.log('res', res)
           this.sharedService.cbpPlanFinalObj['role_mapping_generation'] = res
           this.dataSource = new MatTableDataSource(res)
           setTimeout(()=>{
            this.dataSource.paginator = this.paginator;
           },1000)
           
           this.originalData = res;
           console.log('this.dataSource',this.dataSource)
           })
        }
        
      }
      if(this.formData && this.formData.value && this.formData.value.ministryType === 'state') {
        this.loading = true
        console.log('this.formData',this.formData)
        let state_center_id = this.formData.value.ministry
        let department_id = this.formData.value.departments
        this.sharedService.getRoleMappingByStateCenterAndDepartment(state_center_id, department_id).subscribe({
          next:(res)=>{
            this.loading = false
            this.sharedService.cbpPlanFinalObj['role_mapping_generation'] = res
            this.dataSource = new MatTableDataSource(res)
            setTimeout(()=>{
             this.dataSource.paginator = this.paginator;
            },1000)
            this.originalData = res;
            console.log('this.dataSource',this.dataSource)
          },
          error:()=>{
            this.loading = false
          }
        })
        
         
        
      }
      localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
   
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
    this.applyFilter();
  }

  applyFilter() {
    if (this.searchText.trim()) {
      // Search only in designation names
      this.searchResults = this.filterByDesignationName(this.searchText);
      this.dataSource = new MatTableDataSource(this.searchResults);
    } else {
      // If search is cleared, restore original data
      this.searchResults = [];
      this.dataSource = new MatTableDataSource(this.originalData);
    }
    
    // Set up pagination for filtered results
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();
      }
    }, 100);
  }

  clearSearch() {
    this.searchText = '';
    this.searchResults = [];
    this.dataSource = new MatTableDataSource(this.originalData);
    
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();
      }
    }, 100);
  }

  refreshRoleMappingData() {
    console.log('Refreshing role mapping data...');
    if (this.sharedService.cbpPlanFinalObj && this.sharedService.cbpPlanFinalObj.ministry && this.sharedService.cbpPlanFinalObj.ministry.identifier) {
      const ministryType = this.sharedService.cbpPlanFinalObj.ministry.sbOrgType;
      const ministryId = this.sharedService.cbpPlanFinalObj.ministry.identifier;
      
      this.loading = true;
      
      if (ministryType === 'ministry') {
        if(this.sharedService.cbpPlanFinalObj.departments) {
          const departmentId = this.sharedService.cbpPlanFinalObj.departments;
        this.sharedService.getRoleMappingByStateCenterAndDepartment(ministryId, departmentId).subscribe({
          next: (res) => {
            this.loading = false;
            console.log('State role mapping data refreshed:', res);
            this.updateDataSource(res);
          },
          error: (error) => {
            this.loading = false;
            console.error('Error refreshing state role mapping data:', error);
          }
        });
        } else {
          this.sharedService.getRoleMappingByStateCenter(ministryId).subscribe({
            next: (res) => {
              this.loading = false;
              console.log('Center role mapping data refreshed:', res);
              this.updateDataSource(res);
            },
            error: (error) => {
              this.loading = false;
              console.error('Error refreshing center role mapping data:', error);
            }
          });
        }
        
      } else if (ministryType === 'state') {
        const departmentId = this.sharedService.cbpPlanFinalObj.departments;
        this.sharedService.getRoleMappingByStateCenterAndDepartment(ministryId, departmentId).subscribe({
          next: (res) => {
            this.loading = false;
            console.log('State role mapping data refreshed:', res);
            this.updateDataSource(res);
          },
          error: (error) => {
            this.loading = false;
            console.error('Error refreshing state role mapping data:', error);
          }
        });
      }
    }
  }

  private updateDataSource(res: any[]) {
    this.sharedService.cbpPlanFinalObj['role_mapping_generation'] = res;
    this.dataSource = new MatTableDataSource(res);
    this.originalData = res;
    this.searchResults = []; // Clear search results when data is updated
    
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 100);
    console.log('DataSource updated:', this.dataSource);
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
      // if (result === 'saved') {
      //   console.log('Changes saved!');
      //   // Refresh data or show a toast here
        
      // }
      this.refreshRoleMappingData();
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
        if(this.sharedService.cbpPlanFinalObj && this.sharedService.cbpPlanFinalObj.ministry && this.sharedService.cbpPlanFinalObj.ministry.id ) {
          if(this.sharedService.cbpPlanFinalObj.departments) {
            this.sharedService.getRoleMappingByStateCenter(this.sharedService.cbpPlanFinalObj.ministry.id).subscribe((res)=>{
              console.log('res', res)
              this.dataSource = new MatTableDataSource(res)
              this.dataSource.paginator = this.paginator;
              this.originalData = res;
              console.log('this.dataSource',this.dataSource)
              })
          } else {
            this.sharedService.getRoleMappingByStateCenterAndDepartment(this.sharedService.cbpPlanFinalObj.ministry.id, this.sharedService.cbpPlanFinalObj.departments).subscribe((res)=>{
              console.log('res', res)
              this.dataSource = new MatTableDataSource(res)
              this.dataSource.paginator = this.paginator;
              this.originalData = res;
              console.log('this.dataSource',this.dataSource)
              })
          }
          
         
        } else if(this.sharedService.cbpPlanFinalObj && this.sharedService.cbpPlanFinalObj.ministry && this.sharedService.cbpPlanFinalObj.ministry.id && this.sharedService.cbpPlanFinalObj.departments) {{
          this.sharedService.getRoleMappingByStateCenterAndDepartment(this.sharedService.cbpPlanFinalObj.ministry.id, this.sharedService.cbpPlanFinalObj.departments).subscribe((res)=>{
            console.log('res', res)
            this.dataSource = new MatTableDataSource(res)
            this.dataSource.paginator = this.paginator;
            this.originalData = res;
            console.log('this.dataSource',this.dataSource)
            })
          }
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
            this.dataSource = new MatTableDataSource(res)
            this.dataSource.paginator = this.paginator;
            this.originalData = res;
            console.log('this.dataSource',this.dataSource)
            })
        } else {
          
        }
        
      }
    });
  }

  /**
   * Filter data by designation name only
   * Supports single and multiple word searches
   */
  filterByDesignationName(searchText: string): any[] {
    const searchTerms = searchText.trim().toLowerCase().split(/\s+/);
    
    return this.originalData.filter(item => {
      const designationName = (item.designation_name || '').toLowerCase();
      
      // Check if all search terms are found in the designation name
      return searchTerms.every(term => designationName.includes(term));
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
    const dialogRef = this.dialog.open(AddDesignationComponent, {
      width: '600px',
      data: {state_center_id:''},
       panelClass: 'view-cbp-plan-popup',
      minHeight: '300px',          // Set minimum height
      maxHeight: '90vh',           // Prevent it from going beyond viewport
      disableClose: true // Optional: prevent closing with outside click
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        console.log('Changes saved!');
        // Refresh data or show a toast here
        this.refreshRoleMappingData();
      }
    });
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
        if(this.sharedService.cbpPlanFinalObj && this.sharedService.cbpPlanFinalObj.ministry && this.sharedService.cbpPlanFinalObj.ministry.identifier && 
          this.sharedService.cbpPlanFinalObj.ministry?.sbOrgType === 'ministry'
        ) {
          if(this.sharedService.cbpPlanFinalObj.departments) {
            this.sharedService.getRoleMappingByStateCenterAndDepartment(this.sharedService.cbpPlanFinalObj.ministry.identifier, this.sharedService.cbpPlanFinalObj.departments).subscribe((res)=>{
              console.log('res', res)
              this.dataSource = new MatTableDataSource(res)
              this.dataSource.paginator = this.paginator;
              this.originalData = res;
              console.log('this.dataSource',this.dataSource)
              })
          } else {
            this.sharedService.getRoleMappingByStateCenter(this.sharedService.cbpPlanFinalObj.ministry.identifier).subscribe((res)=>{
              console.log('res', res)
              this.dataSource = new MatTableDataSource(res)
              this.dataSource.paginator = this.paginator;
              this.originalData = res;
              console.log('this.dataSource',this.dataSource)
              })
          }

          
        } else {
          this.sharedService.getRoleMappingByStateCenterAndDepartment(this.sharedService.cbpPlanFinalObj.ministry.identifier, this.sharedService.cbpPlanFinalObj.departments).subscribe((res)=>{
            console.log('res', res)
            this.dataSource = new MatTableDataSource(res)
            this.dataSource.paginator = this.paginator;
            this.originalData = res;
            console.log('this.dataSource',this.dataSource)
            })
        }
        
      }
    });
  }

  viewFinalCBPPlan() {
    const dialogRef = this.dialog.open(ViewFinalCbpPlanComponent, {
      width: '1100px',
      data: this.originalData,
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
