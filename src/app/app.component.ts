import { Component } from '@angular/core';
import { HEADER_DATA } from './modules/shared/constant/app.constant';
import { EventService } from './modules/shared/services/event.service';
import { SharedService } from './modules/shared/services/shared.service';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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
  constructor(
    private eventSvc: EventService, 
    public sharedService: SharedService) {
    this.dataSource = new MatTableDataSource<any>([])
    this.isMaintenancePage = window.location.href.includes('/maintenance')
  }

  ngOnInit() {
    //this.getMinistryData()
  }

  getMinistryData() {
    this.sharedService.getMinistryData().subscribe((data:any)=>{
      console.log('data--', data)
      this.ministryFullData = data
      this.ministryData = []
      if(this.selectedMinistryType === 'center') {
        data.forEach((item)=>{
          if(item?.type === 'central') {
            this.ministryData.push(item)
          } 
        })
      }
    })
  }

  onMinistryTypeChange(event) {
    console.log('event', event)
    this.sharedService.cbpPlanFinalObj['ministryType'] =  event.value
    this.ministryData = [] 
    if(event?.value === 'state') {
      this.ministryFullData.forEach((item)=>{
        if(item?.type === 'state') {
          this.ministryData.push(item)
        } 
      })
    } else if(event?.value === 'center') {
      this.ministryFullData.forEach((item)=>{
        if(item?.type === 'central') {
          this.ministryData.push(item)
        } 
      })
    }
  }

  successRoleMapping(event) {
    this.nextStep = 'role-mapping'
    this.formData = event
    console.log('event', event)
  }

  alreadyAvailableRoleMapping(event) {
    this.nextStep = 'role-mapping'
    console.log('event', event)
    this.formData = event
   
    
  }

  moveToInitialScreen(event) {
    if(event === 'add') {
      this.nextStep = 'initial'
    } else if (event === 'edit') {
      this.nextStep = 'initial'
    }
    
  }

  
}
