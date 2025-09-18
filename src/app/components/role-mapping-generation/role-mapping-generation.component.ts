import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
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
export class RoleMappingGenerationComponent implements OnInit, OnChanges{
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  headerData = HEADER_DATA;
  @Input() loginStatusFlag = false
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
  maxFileSizeMB = 25;
  allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];
  uploadError: string | null = null;
  uploadedFile: File | null = null;
  login = false
  cbpFinalObj:any = {}
  selectedMinistryId= ''
  originalFormValues:any
  @Output() successRoleMapping = new EventEmitter<any>()
  @Output() alreadyAvailableRoleMapping = new EventEmitter<any>()
  @Output() loginSuccess = new EventEmitter<any>()
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
    this.login = this.sharedService.checkIfLogin()
    
    this.cbpFinalObj = this.sharedService.getCBPPlanLocalStorage()
    if(this.cbpFinalObj && this.cbpFinalObj?.ministryType && (this.cbpFinalObj?.ministryType)) {
      
      
      this.editMinistryForm()
      // this.getMinistryData()
    } else {
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
    }

    
    
    

  }

  async editMinistryForm() {
    if(this.cbpFinalObj?.ministryType === 'center') {
      this.selectedMinistryType = this.cbpFinalObj?.ministryType
      
      await this.getMinistryData()

      
      this.roleMappingForm = this.fb.group({
        ministryType: [this.selectedMinistryType, Validators.required],
        ministry: [this.cbpFinalObj?.ministry?.id, Validators.required],
        sectors: [[]],
        departments: [[]], // shown only if ministryType == 'state'
        additionalDetails: ['']
      });

      
      // this.roleMappingForm.get('sectors')?.setValue([]);
      // this.roleMappingForm.get('ministryType')?.valueChanges.subscribe(type => {
      //   this.roleMappingForm.reset({
      //     ministryType: type, // Keep the changed value
      //     ministry: null,
      //     sectors: [],
      //     departments: [],
      //     additionalDetails: ''
      //   });
      //   if (type === 'state') {
      //     this.roleMappingForm.get('departments')?.setValidators([Validators.required]);
      //   } else {
      //     this.roleMappingForm.get('departments')?.clearValidators();
      //     this.roleMappingForm.get('departments')?.setValue([]);
      //   }
      //   this.roleMappingForm.get('departments')?.updateValueAndValidity();
      // });

      if(this.ministryData && this.ministryData.length) {
        this.selectedMinistryId = this.cbpFinalObj?.ministry?.id
      }
      
      //this.onGenerateRoleMapping()
    } else if( this.cbpFinalObj?.ministryType === 'state') {
      this.selectedMinistryType = this.cbpFinalObj?.ministryType
      await this.getMinistryData()
      await this.sharedService.getDepartmentList(this.cbpFinalObj?.ministry?.id).subscribe((res)=>{
        this.departmentData = res
      })
      if(this.ministryData && this.ministryData.length) {
        this.selectedMinistryId = this.cbpFinalObj?.ministry?.id
      }
      this.roleMappingForm = this.fb.group({
        ministryType: [this.selectedMinistryType, Validators.required],
        ministry: [this.cbpFinalObj?.ministry?.id, Validators.required],
        sectors: [[]],
        departments: [this.cbpFinalObj?.departments], // shown only if ministryType == 'state'
        additionalDetails: ['']
      });

      
      // this.roleMappingForm.get('sectors')?.setValue([]);
      // this.roleMappingForm.get('ministryType')?.valueChanges.subscribe(type => {
      //   this.roleMappingForm.reset({
      //     ministryType: type, // Keep the changed value
      //     ministry: null,
      //     sectors: [],
      //     departments: [],
      //     additionalDetails: ''
      //   });
      //   if (type === 'state') {
      //     this.roleMappingForm.get('departments')?.setValidators([Validators.required]);
      //   } else {
      //     this.roleMappingForm.get('departments')?.clearValidators();
      //     this.roleMappingForm.get('departments')?.setValue([]);
      //   }
      //   this.roleMappingForm.get('departments')?.updateValueAndValidity();
      // });
      console.log('this.ministryData', this.ministryData)
      if(this.ministryData && this.ministryData.length) {
        this.selectedMinistryId = this.cbpFinalObj?.ministry?.id
      }
    }
    this.originalFormValues = this.roleMappingForm.getRawValue();
  }

  ngOnChanges() {
    this.login = this.loginStatusFlag
    
  }

  getChangedFields(original: any, current: any): string[] {
    const changedKeys: string[] = [];
  
    for (const key in original) {
      if (!original.hasOwnProperty(key)) continue;
  
      const originalValue = original[key];
      const currentValue = current[key];
  
      // For arrays and objects, use JSON.stringify (or lodash isEqual for deep comparison)
      const isEqual =
        typeof originalValue === 'object'
          ? JSON.stringify(originalValue) === JSON.stringify(currentValue)
          : originalValue === currentValue;
  
      if (!isEqual) {
        changedKeys.push(key);
      }
    }
  
    return changedKeys;
  }

  onGenerateRoleMapping(): void {
    this.loading = true;
    const currentFormValues = this.roleMappingForm.getRawValue();
    const changedFields = this.getChangedFields(this.originalFormValues, currentFormValues);

      if (changedFields.length > 0) {
        console.log('changedFields', changedFields)
        console.log('Changed fields:', changedFields);
        if(changedFields.includes('additionalDetails')) {
          // this.sharedService.deleteRoleMapping().subscribe(()=>{
            
          // })
        }
      } else {
        console.log('No changes detected.');
      }
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
      this.sharedService.cbpPlanFinalObj['ministryType'] = this.selectedMinistryType
      
      if(req) {
        this.sharedService.generateRoleMapping(req).subscribe({
          next: (res) => {
            // Success handling
            console.log('Success:', res);
            this.loading = false
            this.sharedService.cbpPlanFinalObj['role_mapping_generation'] = res
            this.successRoleMapping.emit(this.roleMappingForm)
          },
          error: (error) => {
            this.sharedService.cbpPlanFinalObj['role_mapping_generation'] = []
            console.log('error', error)
            if (error.status === 409) {
              // Handle 409 Conflict here
              // alert('Conflict detected: The resource already exists or action conflicts.');
              //this.get
              // Or you can set a UI error message variable
              this.snackBar.open(error?.error?.detail, 'X', {
                duration: 3000,
                panelClass: ['snackbar-error']
              });
              this.loading = false
              this.alreadyAvailableRoleMapping.emit(this.roleMappingForm)
            } else {
              // Handle other errors
              if(error.status === 500) {
                console.log('error', error)
                this.snackBar.open(error?.error?.detail, 'X', {
                  duration: 3000,
                  panelClass: ['snackbar-error']
                });
              }
             this.loading = false
            }
          }
        });
      }

      localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
      
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
      } else if(this.selectedMinistryType === 'state') {
        data.forEach((item)=>{
          if(item?.type === 'state') {
            this.ministryData.push(item)
          } 
        })
      }
    })
  }

  onMinistryTypeChange(event) {
    console.log('event', event)
    this.sharedService.cbpPlanFinalObj['ministryType'] =  event.value
    localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
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

  onFileChange(event: any) {
    const file: File = event.target.files[0];

    if (!file) {
      return;
    }

    // Validate file size
    const maxBytes = this.maxFileSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      this.uploadError = `File exceeds maximum size of ${this.maxFileSizeMB}MB`;
     // this.designationForm.get('uploadDoc')?.setErrors({ maxSize: true });
      return;
    }

    // Validate file type
    if (!this.allowedTypes.includes(file.type)) {
      this.uploadError = `Invalid file type. Allowed: PDF, Word, Excel, TXT`;
     // this.designationForm.get('uploadDoc')?.setErrors({ fileType: true });
      return;
    }

    this.uploadedFile = file;
    this.uploadError = null;
    // this.designationForm.patchValue({ uploadDoc: file });
    // this.designationForm.get('uploadDoc')?.updateValueAndValidity();
  }

  loginStatus(event) {
    if(event) {
      this.login = true
      this.loginSuccess.emit(true)
      this.getMinistryData()
    } else {
      this.login = false
    }
  }
}

