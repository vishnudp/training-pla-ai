import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';
import { SharedService } from '../shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { type } from 'os';
import { element } from 'protractor';
import { ListPopupComponent } from 'src/app/components/list-popup/list-popup.component';
@Component({
  selector: 'app-upload-document-page',
  templateUrl: './upload-document-page.component.html',
  styleUrls: ['./upload-document-page.component.scss']
})
export class UploadDocumentPageComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>([]);
  selectedMinistryType: string = 'ministry';
  ministryData:any = []
  ministryFullData:any = []
  roleMappingForm!: FormGroup;
  disableBtn = true
  sectorData = [
    {
      value: 'Women and child development'
    },
    {
      value: 'Rural development'
    },
    {
      value: 'Urban development'
    },
    {
      value: 'Healthcare'
    },
    {
      value: 'Agriculture'
    },
    {
      value: 'Others'
    }

  ]
  searchText = '';
  displayedColumns: string[] = ['name', 'summary_status',  'date', 'actions'];
  cbpFinalObj:any= {}
  departmentData:any = []
  documents = [
    // {
    //   name: 'Work Allocation',
    //   originalName: 'ACBP_Ministry_of_Women_and_Child_Development_Extract...',
    //   size: 4.5,
    //   date: 'Oct 13, 2025'
    // },
    // {
    //   name: 'Screenshot 2025-10-08 at 12',
    //   originalName: 'Screenshot 2025-10-08 at 12.54.18 PM.png',
    //   size: 331.8,
    //   date: 'Oct 13, 2025'
    // }
  ];
  loading = false
  filteredMinistryData:any = []
  searchControl: FormControl = new FormControl('');
  panelOpen = false;
  departmentPanelOpen = false
  filteredList = [];
  filteredDepartmentList = [];
  loginUserOrgIds = []
  originalMinistryData = []
  cbpPlanFinalObj:any
  constructor(public dialog: MatDialog, public sharedService: SharedService, 
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    public router:Router 
  ) {
    this.roleMappingForm = this.fb.group({
      ministryType: ['ministry', Validators.required],
      ministry: [null, Validators.required],
      sectors: [[]],
      departments: [[]]
      
    });
    // this.cbpFinalObj = this.sharedService.getCBPPlanLocalStorage()
    this.getMinistryData()
   
   
  }

  ngOnInit() {
    this.cbpPlanFinalObj = this.sharedService.getCBPPlanLocalStorage()
    console.log('cbpFinalObj--', this.cbpFinalObj)
    this.searchControl.valueChanges.subscribe(searchText => {
      if(searchText) {
        this.filterMinistryData(searchText);
      } else {
        this.filteredMinistryData = this.ministryData
      }
      
    });
    this.sharedService.summaryTriggerExecuted.subscribe((data:any)=>{
      if(data && data?.file_id) {
        this.getUploadedDocuments()
      }
    })
    if(this.cbpPlanFinalObj && this.cbpPlanFinalObj.ministry && this.cbpPlanFinalObj.ministry.identifier) {
      this.getUploadedDocuments()
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getUploadedDocuments() {
    
    let reqBody = {
      state_center_id: this.cbpPlanFinalObj?.ministry?.identifier,
      include_summary: true, 
      skip:0,
      limit:200
    }
    if(this.cbpPlanFinalObj && this.cbpPlanFinalObj?.departments ) {
      reqBody['department_id'] = this.cbpPlanFinalObj?.departments
    }
    this.loading = true
    
    this.sharedService.getUploadedDocuments(reqBody).subscribe( (res)=>{
      if(res && res?.items && res?.items?.length) {
        this.loading = false
        this.documents = res?.items
        this.dataSource.data = this.documents;
        console.log('this.documents', this.documents)
      } else {
        this.loading = false
      }
    })
  }

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '600px',
        data: '',
        disableClose: true,
        maxHeight: '80vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if(result === 'close') {
        this.getUploadedDocuments()

      }
      
      // if (result) {
       
      //   this.documents.push(result);
      // }
    });
  }

  filteredDocuments() {
   // console.log('this.documents', this.documents)
    return this.documents.filter(doc => doc.filename.toLowerCase().includes(this.searchText.toLowerCase()));
  }

  deleteDocument(docToDelete: any) {
    this.documents = this.documents.filter(doc => doc !== docToDelete);
    this.loading = true
    this.sharedService.deleteSummary(docToDelete?.file_id).subscribe( (res)=>{
      if(res) {
        this.sharedService.deleteFile(docToDelete?.file_id).subscribe((dres)=>{
          this.loading = true
          if(dres) {
            this.loading = false
            this.snackBar.open('Document Deleted Successfully', 'X', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
            this.getUploadedDocuments()
          } else {
            this.loading = false
            this.snackBar.open('Error While Deleting Document', 'X', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
            this.getUploadedDocuments()
          }
          
        })
        this.loading = false
        this.snackBar.open('Document Summary Deleted Successfully', 'X', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      } else {
        this.loading = false
        this.snackBar.open('Error While Deleting Document Summary', 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    })

  }

  applyFilter() {

  }

  onMinistryTypeChange(event) {
    this.roleMappingForm.reset()
    
    // console.log('event', event)
    this.getMinistryData()
     this.sharedService.cbpPlanFinalObj['ministryType'] =  event.value
     localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
     this.selectedMinistryType = event?.value
    this.roleMappingForm.get('sectors')?.setValue([]);
 
     this.roleMappingForm.controls.ministryType.setValue( this.selectedMinistryType)
   }

   onMinistryChange(event: any) {
    const selectedMinistryId = event.value;
    
   // console.log('Selected Ministry ID:', selectedMinistryId);

    // You can access the selected object if needed
    const selectedMinistry = this.ministryData.find(item => item.identifier === selectedMinistryId);
     console.log('Selected Ministry:', selectedMinistry);``
    this.sharedService.cbpPlanFinalObj['ministry'] =  {identifier:selectedMinistryId?.identifier,name:selectedMinistryId?.orgName} 
    if(selectedMinistryId && this.selectedMinistryType === 'state') {
      this.sharedService.getDepartmentList(selectedMinistryId).subscribe((res)=>{
        this.departmentData = res
      })
    }
    if(this.selectedMinistryType === 'state') {
      this.sharedService.cbpPlanFinalObj['ministryType'] = this.roleMappingForm.controls.ministryType.value
      this.sharedService.cbpPlanFinalObj['ministry'] = {identifier:selectedMinistry?.identifier,name:selectedMinistry?.orgName} 
      this.sharedService.cbpPlanFinalObj['departments'] = this.roleMappingForm.controls.departments.value
      this.sharedService.cbpPlanFinalObj['sectors'] = this.roleMappingForm.controls.sectors.value
    } else {
      this.sharedService.cbpPlanFinalObj['ministryType'] = this.roleMappingForm.controls.ministryType.value
      this.sharedService.cbpPlanFinalObj['ministry'] = {identifier:selectedMinistry?.identifier,name:selectedMinistry?.orgName} 
    }
    console.log('this.sharedService.cbpPlanFinalObj',this.sharedService.cbpPlanFinalObj)
    localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
    console.log('this.roleMappingForm',this.roleMappingForm)
  }



  filterMinistryData(searchText) {
    
    if(searchText) {
      console.log('searhTect, ', searchText)
      const search = searchText?.trim().toLowerCase() || '';
      this.filteredMinistryData = !search
        ? [...this.ministryData]
        : this.ministryData.filter(item =>
            item.orgName?.trim().toLowerCase().startsWith(search)
          );
    }
    
    }

    getMinistryData() {
      this.loading = true
      this.sharedService.getMinistryData(this.selectedMinistryType).subscribe((data:any)=>{
        this.loading = false
        console.log('data--', data)
        this.ministryFullData = data
        this.ministryData = []
        if(this.selectedMinistryType === 'ministry') {
          data.forEach((item)=>{
            if(item?.sbOrgType === 'ministry') {
              this.ministryData.push(item)
              this.filteredMinistryData = [...this.ministryData];
            }
          })
        } else if(this.selectedMinistryType === 'state') {
          data.forEach((item)=>{
            if(item?.sbOrgType === 'state') {
              this.ministryData.push(item)
              this.filteredMinistryData = [...this.ministryData];
            }
          })
        }
        this.getUserProfileData()
      })
      
      console.log('this.ministryData--', this.ministryData)
      console.log('this.filteredMinistryData--', this.filteredMinistryData)
    }

    routeToMain() {
      this.router.navigate(['/']);
    }

    viewSummary(doc) {
      const dialogRef = this.dialog.open(ListPopupComponent, {
        width: '800px',
        data: { element: doc, type: 'doc-summary'},
        disableClose: true,
        maxHeight: '80vh'
      });
  
      dialogRef.afterClosed().subscribe(() => {
        // No need to do anything special here to reset inline expanded state
        // Because you're using dialog, not inline expand – view remains in initial (collapsed) state
      });
    }

    downloadDoc(doc: any): void {
      this.loading = true
      this.sharedService.downloadFile(doc.file_id).subscribe({
        
        next: (blob: Blob) => {
          this.loading = false
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${doc?.filename}`; // Use dynamic name if needed
          a.click();
          window.URL.revokeObjectURL(url);
    
          // ✅ Success feedback
          this.snackBar.open('File downloaded successfully!', 'X', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        },
        error: (err) => {
          this.loading = false
          // ❌ Error feedback
          console.error('Download error:', err);
          this.snackBar.open('Failed to download the file.', 'X', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    }

    onOpened(opened: boolean) {
      this.panelOpen = opened;
    }
  
    onOpenedDepartment(opened: boolean) {
      this.departmentPanelOpen = opened
    }

    filterData(event) {
      if(event && event.target && event.target.value) {
        const s = event.target.value.toLowerCase();
      
        this.filteredList = this.ministryData.filter(x =>
          x.orgName.toLowerCase().includes(s)
        );
      } else {
        this.filteredList = this.ministryData
      }
      
    }
  
    filterDepartmentData(event) {
      if(event && event.target && event.target.value) {
        const s = event.target.value.toLowerCase();
      
        this.filteredDepartmentList = this.departmentData.filter(x =>
          x.orgName.toLowerCase().includes(s)
        );
      } else {
        this.filteredDepartmentList = this.departmentData
      }
      
    }

    getUserProfileData() {
      this.sharedService.getUserProfile().subscribe((data)=>{
        console.log('data--', data)
        this.loginUserOrgIds = data?.organization_ids
        let filteredMinistryData =  []
        console.log('this.ministryFullData--',this.ministryFullData)
        this.ministryFullData.map((item)=>{
          if(this.loginUserOrgIds.indexOf(item?.identifier) > -1) {
            filteredMinistryData.push(item)
          }
        })
  
        this.ministryData = filteredMinistryData
        this.originalMinistryData = filteredMinistryData
        this.filteredList = filteredMinistryData;
        console.log('this.filteredList--', this.filteredList)
      })
    }

    routeToInitial() {
      this.router.navigate(['/initial']);
    }

}

