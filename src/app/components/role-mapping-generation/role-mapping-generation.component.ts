import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HEADER_DATA } from 'src/app/modules/shared/constant/app.constant';
import { EventService } from 'src/app/modules/shared/services/event.service';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-role-mapping-generation',
  templateUrl: './role-mapping-generation.component.html',
  styleUrls: ['./role-mapping-generation.component.scss']
})
export class RoleMappingGenerationComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
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
  departmentData = []
  loading = false
  @Output() successRoleMapping = new EventEmitter<any>()
  @Output() alreadyAvailableRoleMapping = new EventEmitter<any>()
  constructor(
    private eventSvc: EventService, 
    public sharedService: SharedService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<any>([])
    this.isMaintenancePage = window.location.href.includes('/maintenance')
  }

  ngOnInit() {
    this.roleMappingForm = this.fb.group({
      ministryType: ['center', Validators.required],
      ministry: [null, Validators.required],
      sectors: [[]],
      departments: [[]], // shown only if ministryType == 'state'
      additionalDetails: ['']
    });
    this.roleMappingForm.get('sectors')?.setValue([]);
    this.roleMappingForm.get('ministryType')?.valueChanges.subscribe(type => {
      this.roleMappingForm.reset({
        ministryType: type, // Keep the changed value
        ministry: null,
        sectors: [],
        departments: [],
        additionalDetails: ''
      });
      if (type === 'state') {
        this.roleMappingForm.get('departments')?.setValidators([Validators.required]);
      } else {
        this.roleMappingForm.get('departments')?.clearValidators();
        this.roleMappingForm.get('departments')?.setValue([]);
      }
      this.roleMappingForm.get('departments')?.updateValueAndValidity();
    });
    
    this.getMinistryData()

  }

  onGenerateRoleMapping(): void {
    this.loading = true;
    if (this.roleMappingForm.valid) {
      const formData = this.roleMappingForm.value;
      console.log('Form submitted:', formData);
      let sectors = Array.isArray(formData.sectors) ? formData.sectors.join(', ') : ''
      this.sharedService.cbpPlanFinalObj['sectors'] = formData.sectors
      // Submit logic here
      let req = {
        "state_center_id":formData.ministry,
        "sector_name": "Urban development",
        "instruction": ""
      }
      if(this.selectedMinistryType === 'state') { 
        req['department_id'] = formData.departments ? formData.departments : ''
        this.sharedService.cbpPlanFinalObj['departments'] =  formData.departments ? formData.departments : ''
        
        
        const departmentName = this.departmentData.find(u => u.id=== formData.departments);
        this.sharedService.cbpPlanFinalObj['department_name'] =  departmentName
        console.log(departmentName); 

      }
      if(req) {
        this.sharedService.generateRoleMapping(req).subscribe({
          next: (res) => {
            // Success handling
            console.log('Success:', res);
            this.loading = false
            this.successRoleMapping.emit(this.roleMappingForm)
          },
          error: (error) => {
            console.log('error', error)
            if (error.status === 409) {
              // Handle 409 Conflict here
              // alert('Conflict detected: The resource already exists or action conflicts.');
              //this.get
              // Or you can set a UI error message variable
              this.snackBar.open(error?.error?.detail, 'Close', {
                duration: 3000,
                panelClass: ['snackbar-error']
              });
              this.loading = false
              this.alreadyAvailableRoleMapping.emit(this.roleMappingForm)
            } else {
              // Handle other errors
              if(error.status === 500) {
                console.log('error', error)
                this.snackBar.open(error?.error?.detail, 'Close', {
                  duration: 3000,
                  panelClass: ['snackbar-error']
                });
              }
             this.loading = false
            }
          }
        });
      }
      
    } else {
      this.roleMappingForm.markAllAsTouched();
    }
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
      this.roleMappingForm.get('sectors')?.setValue([]);
      this.ministryFullData.forEach((item)=>{
        if(item?.type === 'state') {
          this.ministryData.push(item)
        } 
      })
    } else if(event?.value === 'center') {
      this.roleMappingForm.get('sectors')?.setValue([]);
      this.ministryFullData.forEach((item)=>{
        if(item?.type === 'central') {
          this.ministryData.push(item)
        } 
      })
    }
  }

  onMinistryChange(event: any) {
    const selectedMinistryId = event.value;
    console.log('Selected Ministry ID:', selectedMinistryId);

    // You can access the selected object if needed
    const selectedMinistry = this.ministryData.find(item => item.id === selectedMinistryId);
    console.log('Selected Ministry:', selectedMinistry);``
    this.sharedService.cbpPlanFinalObj['ministry'] =  selectedMinistry
    if(selectedMinistryId && this.selectedMinistryType === 'state') {
      this.sharedService.getDepartmentList(selectedMinistryId).subscribe((res)=>{
        this.departmentData = res
      })
    }
  }

  searchData() {

  }

  applyFilter() {
   
  }

  downloadPDF() {
      const element = this.pdfContent.nativeElement;
  
      const options = {
        margin: 0.5,
        filename: 'CBP_Plan.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,  // Important for external images/icons
        },
        jsPDF: {
          unit: 'in',
          format: 'a4',
          orientation: 'portrait'
        }
      };
  
      html2pdf().from(element).set(options).save();
    
  }
}

