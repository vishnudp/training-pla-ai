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
  selectedMinistryType: string = 'center';
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
  displayedColumns: string[] = ['name', 'summary_status', 'summary_text', 'date', 'actions'];
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
  constructor(public dialog: MatDialog, public sharedService: SharedService, 
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    public router:Router 
  ) {
    this.roleMappingForm = this.fb.group({
      ministryType: ['center', Validators.required],
      ministry: [null, Validators.required],
      sectors: [[]],
      departments: [[]]
      
    });
    this.cbpFinalObj = this.sharedService.getCBPPlanLocalStorage()
    this.getMinistryData()
    this.getUploadedDocuments()
  }

  ngOnInit() {
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
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getUploadedDocuments() {
    
    let reqBody = {
      state_center_id: this.cbpFinalObj?.ministry?.id,
      include_summary: true, 
      skip:0,
      limit:200
    }
    if(this.cbpFinalObj && this.cbpFinalObj?.ministryType && (this.cbpFinalObj?.ministryType === 'state')) {
      reqBody['department_id'] = this.cbpFinalObj?.departments
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
        maxHeight: '80vh'
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
          } else {
            this.loading = false
            this.snackBar.open('Error While Deleting Document', 'X', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
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
     this.sharedService.cbpPlanFinalObj['ministryType'] =  event.value
     localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
     this.ministryData = []
     console.log('event--', event)
     if(event?.value === 'state') {
      this.selectedMinistryType = event?.value
       this.roleMappingForm.get('sectors')?.setValue([]);
       this.ministryFullData.forEach((item)=>{
         if(item?.type === 'state') {
           this.ministryData.push(item)
           this.filteredMinistryData = [...this.ministryData];
         }
       })
     } else if(event?.value === 'center') {
        this.selectedMinistryType = event?.value
       this.roleMappingForm.get('sectors')?.setValue([]);
       this.ministryFullData.forEach((item)=>{
         if(item?.type === 'central') {
           this.ministryData.push(item)
           this.filteredMinistryData = [...this.ministryData];
         }
       })
     }
     this.roleMappingForm.controls.ministryType.setValue( this.selectedMinistryType)
   }

   onMinistryChange(event: any) {
    const selectedMinistryId = event.value;
   // console.log('Selected Ministry ID:', selectedMinistryId);

    // You can access the selected object if needed
    const selectedMinistry = this.ministryData.find(item => item.id === selectedMinistryId);
     console.log('Selected Ministry:', selectedMinistry);``
    this.sharedService.cbpPlanFinalObj['ministry'] =  {id:selectedMinistryId?.id,name:selectedMinistryId?.name} 
    if(selectedMinistryId && this.selectedMinistryType === 'state') {
      this.sharedService.getDepartmentList(selectedMinistryId).subscribe((res)=>{
        this.departmentData = res
      })
    }
    if(this.selectedMinistryType === 'state') {
      this.sharedService.cbpPlanFinalObj['ministryType'] = this.roleMappingForm.controls.ministryType.value
      this.sharedService.cbpPlanFinalObj['ministry'] = {id:selectedMinistry?.id,name:selectedMinistry?.name} 
      this.sharedService.cbpPlanFinalObj['departments'] = this.roleMappingForm.controls.departments.value
      this.sharedService.cbpPlanFinalObj['sectors'] = this.roleMappingForm.controls.sectors.value
    } else {
      this.sharedService.cbpPlanFinalObj['ministryType'] = this.roleMappingForm.controls.ministryType.value
      this.sharedService.cbpPlanFinalObj['ministry'] = {id:selectedMinistry?.id,name:selectedMinistry?.name} 
      // this.sharedService.cbpPlanFinalObj['departments'] = this.roleMappingForm.controls.departments.value
      // this.sharedService.cbpPlanFinalObj['sectors'] = this.roleMappingForm.controls.sectors.value
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
            item.name?.trim().toLowerCase().startsWith(search)
          );
    }
    
    }

    getMinistryData() {
      this.loading = true
      this.sharedService.getMinistryData().subscribe((data:any)=>{
        this.loading = false
      //  console.log('data--', data)
        this.ministryFullData = data
        this.ministryData = []
        if(this.selectedMinistryType === 'center') {
          data.forEach((item)=>{
            if(item?.type === 'central') {
              this.ministryData.push(item)
              this.filteredMinistryData = [...this.ministryData];
            }
          })
        } else if(this.selectedMinistryType === 'state') {
          data.forEach((item)=>{
            if(item?.type === 'state') {
              this.ministryData.push(item)
              this.filteredMinistryData = [...this.ministryData];
            }
          })
        }
      })
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
}

