import { Component } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HEADER_DATA } from '../shared/constant/app.constant';
import { EventService } from '../shared/services/event.service';
import { SharedService } from '../shared/services/shared.service';
@Component({
  selector: 'initial-screen',
  templateUrl: './initial-screen.component.html',
  styleUrls: ['./initial-screen.component.scss']
})
export class InitialScreenComponent {
  headerData = HEADER_DATA;
  title = 'sunbird-cb-staticweb';
  isMaintenancePage: any
  selectedValue = ''
  searchText = ''
  dataSource: any
  displayedColumns: string[] = ['RequestId', 'title', 'requestor', 'requestType',
    'requestStatus', 'assignee', 'requestedOn', 'interests', 'action']
    selectedMinistryType: string = 'center';
    ministryData:any = []
  ministryFullData:any = []
  sectorData = [
    {
      value: 'Women and child development'
    },
    {
      value: 'Rural development'
    },
    {
      value: 'Urben development'
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
  formData: {}
  nextStep = 'initial'
  loginSuccess = false
  cbpFinalObj:any = {}
  userEmail = ''
  constructor(
    private eventSvc: EventService, 
    public sharedService: SharedService,
  public snackBar: MatSnackBar, 
  private router: Router) {
    this.dataSource = new MatTableDataSource<any>([])
    this.isMaintenancePage = window.location.href.includes('/maintenance')
  }

  ngOnInit() {    
    
   this.sharedService.loginSuccess.subscribe((data)=>{
   
    if(!data) {
      this.nextStep = 'initial'
      localStorage.clear()
    }
   })
   this.loginSuccess = this.sharedService.checkIfLogin()
   if(this.loginSuccess) {
    
    this.userEmail = localStorage.getItem('userEmail')
   }
   this.cbpFinalObj = this.sharedService.getCBPPlanLocalStorage()
   if(this.cbpFinalObj && this.cbpFinalObj?.ministry && (this.cbpFinalObj?.ministry?.sbOrgType === 'ministry' || this.cbpFinalObj?.ministry?.sbOrgType === 'state') && 
  this.cbpFinalObj?.role_mapping_generation?.length) {
    this.nextStep = 'role-mapping'
   } else {
    this.nextStep = 'initial'
   }
  //  console.log('this.nextStep',this.nextStep)
  //  console.log('this.sharedService.cb', this.sharedService.cbpPlanFinalObj)
  }


  successRoleMapping(event) {
    this.nextStep = 'role-mapping'
    this.formData = event
    // console.log('event', event)
  }

  alreadyAvailableRoleMapping(event) {
    this.nextStep = 'role-mapping'
    // console.log('event', event)
    this.formData = event
   
    
  }

  moveToInitialScreen(event) {
    if(event === 'add') {
      this.nextStep = 'initial'
    } else if (event === 'edit') {
      this.nextStep = 'initial'
    }
    
  }

  loginSuccessStatus(event) {
    this.loginSuccess = event
    this.nextStep = 'initial'
  }

  logout() {
    this.loginSuccess = false
    this.nextStep = 'initial'
    localStorage.clear()    
    this.sharedService.logout().subscribe({
      next: (res) => {
        this.snackBar.open('You are logout successfully', 'X', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      },
      error: (error) => {
        this.snackBar.open(error?.error?.detail, 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  goToUploadDocument() {
    this.router.navigate(['/upload-documents']);
  }

  
}
