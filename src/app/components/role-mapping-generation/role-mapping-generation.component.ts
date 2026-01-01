import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HEADER_DATA } from 'src/app/modules/shared/constant/app.constant';
import { EventService } from 'src/app/modules/shared/services/event.service';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import html2pdf from 'html2pdf.js';
import { DeleteRoleMappingPopupComponent } from '../delete-role-mapping-popup/delete-role-mapping-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { RoleMappingService } from 'src/app/modules/shared/services/role-mapping.service';
import { interval, ReplaySubject, Subject } from 'rxjs';
import { switchMap, takeWhile, tap } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators'; 
import { Router } from '@angular/router';
@Component({
  selector: 'app-role-mapping-generation',
  templateUrl: './role-mapping-generation.component.html',
  styleUrls: ['./role-mapping-generation.component.scss']
})
export class RoleMappingGenerationComponent implements OnInit, OnChanges, OnDestroy{
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
  uploadedFile: File[] | null = null;
  login = false
  cbpFinalObj:any = {}
  selectedMinistryId= ''
  originalFormValues:any
  chunks: string[] = [];
  fullJson: string = '';
  parsedData: any;
  currentProcessingStage: string = '';
  processingStages = [
    'Initializing CBP Plan generation...',
    'Analyzing departmental competency requirements...',
    'Processing work order specifications and role definitions...',
    'Generating detailed roles & resposibilities...',
    'Generating detailed competencies...',
    'Validating role mapping  and finalizing the CBP Plan'
  ];
  @Output() successRoleMapping = new EventEmitter<any>()
  @Output() alreadyAvailableRoleMapping = new EventEmitter<any>()
  @Output() loginSuccess = new EventEmitter<any>()
  selectedMinistryObj:any = ''
  loginUserOrgIds = []
  panelOpen = false;
  departmentPanelOpen = false
filteredList = [];
filteredDepartmentList = [];
originalMinistryData = []
apiLoading= false
  constructor(
    private eventSvc: EventService,
    public sharedService: SharedService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public roleMappingService: RoleMappingService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<any>([])
    this.isMaintenancePage = window.location.href.includes('/maintenance')
  }

  ngOnInit() {
    
    this.login = this.sharedService.checkIfLogin()

    this.cbpFinalObj = this.sharedService.getCBPPlanLocalStorage()
    if(this.cbpFinalObj && this.cbpFinalObj?.ministry && this.cbpFinalObj?.ministry?.sbOrgType) {
      
      
      this.editMinistryForm()
      // this.getMinistryData()
    } else {
      if( this.login) {
        this.getMinistryData()
      }
      this.roleMappingForm = this.fb.group({
        ministryType: ['ministry', Validators.required],
        ministry: [null, Validators.required],
        sectors: [[]],
        departments: [[]], // shown only if ministryType == 'state'
        additionalDetails: [''],
        additional_document: []
      });
      this.roleMappingForm.get('sectors')?.setValue([]);
      this.roleMappingForm.get('ministryType')?.valueChanges.subscribe(type => {
        this.roleMappingForm.reset({
          ministryType: type, // Keep the changed value
          ministry: null,
          sectors: [],
          departments: [],
          additionalDetails: '',
          additional_document:[]
        });
        if (type === 'state') {
          this.roleMappingForm.get('departments')?.setValidators([Validators.required]);
        } else {
          this.roleMappingForm.get('departments')?.clearValidators();
          this.roleMappingForm.get('departments')?.setValue([]);
        }
        this.roleMappingForm.get('departments')?.updateValueAndValidity();
      });
      this.roleMappingForm.statusChanges.subscribe((status:any) => {
        let hasUploadDocuments =  false
        this.router.events.subscribe(() => {
           hasUploadDocuments =
            this.router.url.includes('/upload-documents');
          
        });
        if(!hasUploadDocuments) {
          this.sharedService.checkRoleMappingFormValidation.next(status);
          
        }
        
      });
    }

    
   



  }

  async editMinistryForm() {
    if(this.cbpFinalObj?.ministry.sbOrgType === 'ministry') {
      this.selectedMinistryType = this.cbpFinalObj?.ministry.sbOrgType
      await this.getMinistryData()
      if(this.cbpFinalObj?.ministry?.sbOrgType) {
        await this.sharedService.getCenterBasedDepartment(this.cbpFinalObj?.ministry?.identifier).subscribe((res)=>{
          if(res?.length) {
            this.departmentData = res
          this.filteredDepartmentList = res
          } else {
            this.snackBar.open('No Department Found for Selected Ministry', 'X', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
            this.sharedService.cbpPlanFinalObj['department_name'] =  ''
            this.sharedService.cbpPlanFinalObj['departments'] =  ''
            localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
          }
        })
      }
     
      this.roleMappingForm = this.fb.group({
        ministryType: [this.selectedMinistryType, Validators.required],
        ministry: [this.cbpFinalObj?.ministry?.identifier, Validators.required],
        sectors: [[]],
        departments: [this.cbpFinalObj?.departments], // shown only if ministryType == 'state'
        additionalDetails: ['']
      });
      this.roleMappingForm.statusChanges.subscribe((status:any) => {
        let hasUploadDocuments =  false
        this.router.events.subscribe(() => {
           hasUploadDocuments =
            this.router.url.includes('/upload-documents');
          
        });
        if(!hasUploadDocuments) {
          this.sharedService.checkRoleMappingFormValidation.next(status);
          
        }
        
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
        this.selectedMinistryId = this.cbpFinalObj?.ministry?.identifier
      }

      //this.onGenerateRoleMapping()
    } else if( this.cbpFinalObj?.ministry?.sbOrgType === 'state') {
      this.selectedMinistryType = this.cbpFinalObj?.ministry?.sbOrgType
      await this.getMinistryData()
      await this.sharedService.getDepartmentList(this.cbpFinalObj?.ministry?.identifier).subscribe((res)=>{
        this.departmentData = res
        this.filteredDepartmentList = res
        console.log('this.filteredDepartmentList --',this.filteredDepartmentList )
      })
      if(this.ministryData && this.ministryData.length) {
        this.selectedMinistryId = this.cbpFinalObj?.ministry?.identifier
      }
      this.roleMappingForm = this.fb.group({
        ministryType: [this.selectedMinistryType, Validators.required],
        ministry: [this.cbpFinalObj?.ministry?.identifier, Validators.required],
        sectors: [[]],
        departments: [this.cbpFinalObj?.departments], // shown only if ministryType == 'state'
        additionalDetails: [this.cbpFinalObj?.additionalDetails]
      });

      this.roleMappingForm.statusChanges.subscribe((status:any) => {
        let hasUploadDocuments =  false
        this.router.events.subscribe(() => {
           hasUploadDocuments =
            this.router.url.includes('/upload-documents');
          
        });
        if(!hasUploadDocuments) {
          this.sharedService.checkRoleMappingFormValidation.next(status);
          
        }
        
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
        this.selectedMinistryId = this.cbpFinalObj?.ministry?.identifier
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

  onGenerateRoleMapping(): any {

    const currentFormValues = this.roleMappingForm.getRawValue();
    const formData :any= new FormData();

    formData.append('ministryType', currentFormValues.ministryType);
    formData.append('ministry', currentFormValues.ministry);
    formData.append('sectors', JSON.stringify(currentFormValues.sectors));
    formData.append('departments', JSON.stringify(currentFormValues.departments));
    formData.append('additionalDetails', currentFormValues.additionalDetails || '');
    const file: File = this.uploadedFile || this.roleMappingForm.get('additional_document')?.value;
    console.log('file', file)
    if (file) {
      formData.append('additional_document', file);
    }
    this.sharedService.cbpPlanFinalObj['departments'] = currentFormValues?.departments
    const departmentName = this.departmentData.find(u => u.identifier=== currentFormValues.departments);
    this.sharedService.cbpPlanFinalObj['department_name'] =  departmentName?.orgName
    const selectedMinistry = this.ministryData.find(item =>
      item.identifier === currentFormValues.ministry
    );
  
    this.selectedMinistryObj = selectedMinistry;
     this.sharedService.cbpPlanFinalObj['ministry'] =  selectedMinistry
    localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
    console.log('this.roleMappingForm', this.roleMappingForm)
    console.log('formData--', formData)
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }


    const changedFields = this.getChangedFields(this.originalFormValues, currentFormValues);

      if (changedFields.length > 0 || (file && file.size > 0)) {
        console.log('changedFields', changedFields)
        console.log('Changed fields:', changedFields);
        if(changedFields.includes('additionalDetails') && this.roleMappingForm.value.additionalDetails?.trim() || (file && file.size > 0)) {
          const dialogRef = this.dialog.open(DeleteRoleMappingPopupComponent, {
            width: '400px',
            data: '',
             panelClass: 'view-cbp-plan-popup',
            minHeight: '300px',          // Set minimum height
            maxHeight: '80vh',           // Prevent it from going beyond viewport
            disableClose: true // Optional: prevent closing with outside click
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result === 'saved') {
              console.log('Changes saved!');
              this.loading = true
              this.sharedService.deleteRoleMappingByStateAndDepartment(this.roleMappingForm.value.ministry, this.roleMappingForm.value.departments).subscribe({
                next: (res) => {
                  // Success handling
                  console.log('Success:', res);
                  this.loading = false
                  this.generateFinalRoleMapping()
                },
                error: (error) => {
                  this.snackBar.open(error?.error?.detail, 'X', {
                    duration: 3000,
                    panelClass: ['snackbar-error']
                  });
                  this.loading = false
                  this.generateFinalRoleMapping()
                }
              });
            } else {
              this.generateFinalRoleMapping()
            }
          });
        } else {
          this.generateFinalRoleMapping()
        }
      } else {
        this.generateFinalRoleMapping()
        console.log('No changes detected.');
      }

  }


  getMinistryData() {
    this.apiLoading = true
    this.sharedService.getMinistryData(this.selectedMinistryType).subscribe((data:any)=>{
      console.log('data--', data)
      this.ministryFullData = data
      this.apiLoading = false
      this.ministryData = []
      if(this.selectedMinistryType === 'ministry') {
        data.forEach((item)=>{
          if(item?.sbOrgType === 'ministry') {
            this.ministryData.push(item)
          }
        })
      } else if(this.selectedMinistryType === 'state') {
        data.forEach((item)=>{
          if(item?.sbOrgType === 'state') {
            this.ministryData.push(item)
          }
        })
      }

      this.getUserProfileData()
    })
  }

  async onMinistryTypeChange(event) {
    console.log('event', event)
    
    if(this.login) {
      await this.getMinistryData()
    }
    
    this.sharedService.cbpPlanFinalObj['ministryType'] =  event.value
    this.sharedService.cbpPlanFinalObj['role_mapping_generation'] =  []
    this.selectedMinistryType = event.value
    
    localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
    this.ministryData = []
    if(event?.value === 'state') {
      this.roleMappingForm.get('sectors')?.setValue([]);
      this.roleMappingForm.get('departments')?.setValue([]);
      this.ministryFullData.forEach((item)=>{
        if(item?.type === 'state') {
          this.ministryData.push(item)
        }
      })
    } else if(event?.value === 'ministry') {
      this.roleMappingForm.get('sectors')?.setValue([]);
      this.roleMappingForm.get('departments')?.setValue([]);
      this.ministryFullData.forEach((item)=>{
        if(item?.type === 'central') {
          this.ministryData.push(item)
        }
      })
    }
    this.sharedService.cbpPlanFinalObj['ministry'] =  ''
    this.sharedService.cbpPlanFinalObj['department_name'] =  ''
    this.sharedService.cbpPlanFinalObj['departments'] =  ''
    localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
    // this.roleMappingForm.reset()
    if(!this.sharedService.cbpPlanFinalObj?.ministry) {
      this.roleMappingForm.setErrors({ invalid: true });
      setTimeout(()=>{
        this.roleMappingForm.updateValueAndValidity();
      },5000)
    }
  }

  onMinistryChange(event: any) {
    const selectedMinistryId = event.value;
    console.log('Selected Ministry ID:', selectedMinistryId);
    this.departmentData = []
    // You can access the selected object if needed
    const selectedMinistry = this.ministryData.find(item => item.identifier === selectedMinistryId);
    this.selectedMinistryObj = selectedMinistry
    console.log('Selected Ministry:', selectedMinistry);``
    this.sharedService.cbpPlanFinalObj['ministry'] =  selectedMinistry
    this.sharedService.cbpPlanFinalObj['role_mapping_generation'] =  []
    localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
    if(selectedMinistryId && this.selectedMinistryType === 'state') {
      this.sharedService.getDepartmentList(selectedMinistryId).subscribe((res)=>{
        this.departmentData = res
        this.filteredDepartmentList = res
      })
    }  
    if(selectedMinistryId && this.selectedMinistryType === 'ministry') {
      this.sharedService.getCenterBasedDepartment(selectedMinistryId).subscribe((res)=>{
        if(res?.length) {
          this.departmentData = res
        this.filteredDepartmentList = res
        } else {
          this.snackBar.open('No Department Found for Selected Ministry', 'X', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
          this.sharedService.cbpPlanFinalObj['department_name'] =  ''
          this.sharedService.cbpPlanFinalObj['departments'] =  ''
          localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
        }
        
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
    const files: FileList = event.target.files;
    const maxFiles = 3;
    const control = this.roleMappingForm.get('additional_document');
  
    // Always clear control first (prevents old valid value)
    control?.reset();
    control?.setErrors(null);
    this.uploadedFile = [];
    this.uploadError = null;
  
    if (!files || files.length === 0) return;
  
    // Limit check
    if (files.length > maxFiles) {
      this.uploadError = `You can upload a maximum of ${maxFiles} files`;
      control?.setErrors({ maxFiles: true });
      control?.markAsDirty();
      control?.markAsTouched();
      control?.updateValueAndValidity();
      return;
    }
  
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    const maxBytes = this.maxFileSizeMB * 1024 * 1024;
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
  
      // Size check
      if (file.size > maxBytes) {
        invalidFiles.push(`${file.name} (exceeds ${this.maxFileSizeMB}MB)`);
        continue;
      }
  
      // Type check
      if (!this.allowedTypes.includes(file.type)) {
        invalidFiles.push(`${file.name} (invalid type)`);
        continue;
      }
  
      validFiles.push(file);
    }
  
    // ❌ NO valid files → form MUST BE invalid
    if (validFiles.length === 0) {
      this.uploadError = `Invalid file(s): ${invalidFiles.join(', ')}`;
  
      control?.setValue(null);
      control?.setErrors({ invalidFiles: true });
      control?.markAsDirty();
      control?.markAsTouched();
      control?.updateValueAndValidity({ onlySelf: true, emitEvent: true });
      this.roleMappingForm.setErrors({ invalid: true });
      this.roleMappingForm.markAllAsTouched();
      setTimeout(()=>{
        this.roleMappingForm.updateValueAndValidity();
      },5000)
      
      return;
    }
  
    // ✔ At least ONE valid file → form should be VALID
    this.uploadedFile = validFiles;
  
    if (invalidFiles.length > 0) {
      this.uploadError = `Some files were skipped: ${invalidFiles.join(', ')}`;
    }
  
    control?.setValue(validFiles);
    control?.setErrors(null);
    control?.markAsDirty();
    control?.markAsTouched();
    control?.updateValueAndValidity({ onlySelf: true, emitEvent: true });
  }
  
  
  

  

  loginStatus(event) {    
    if(event) {
      this.login = true
      this.loginSuccess.emit(true)
      this.selectedMinistryType = 'ministry'
      
      this.getMinistryData()
    } else {
      this.login = false
    }
  }

  generateFinalRoleMapping() {
    this.loading = true;
  
    if (!this.roleMappingForm.valid) {
      this.roleMappingForm.markAllAsTouched();
      return;
    }
  
    const currentFormValues = this.roleMappingForm.getRawValue();
    let formUploadData = new FormData();
  
    // Ministry selection
    const selectedMinistry = this.ministryData.find(item =>
      item.identifier === currentFormValues.ministry
    );
  
    this.selectedMinistryObj = selectedMinistry;
  
    // Append base fields
    formUploadData.append('state_center_id', currentFormValues.ministry || '');
    formUploadData.append('state_center_name', selectedMinistry?.orgName || '');
  
    if (currentFormValues.departments) {
      formUploadData.append('department_id', currentFormValues.departments);
    }
  
    if (currentFormValues.additionalDetails) {
      formUploadData.append('instruction', currentFormValues.additionalDetails);
    }
  
    // Get uploaded file(s)
    const files: File | File[] =
      this.uploadedFile || this.roleMappingForm.get('additional_document')?.value;
  
    console.log('Files selected:', files);
  
    // Append single or multiple files
    if (files) {
      if (Array.isArray(files)) {
        files.forEach((file: File) => {
          formUploadData.append('additional_document', file, file.name);
        });
      } else {
        formUploadData.append('additional_document', files, files.name);
      }
    }
  
    // Debug: print FormData
    console.log("FormData Debug:");
    formUploadData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key}: FILE -> ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });

  
    // Build request body for polling API
    let req: any = {
      state_center_id: currentFormValues.ministry,
      instruction: currentFormValues.additionalDetails,
      state_center_name: selectedMinistry?.orgName
    };
  
    if (this.selectedMinistryType === 'state' || currentFormValues.departments) {
      const departmentName = this.departmentData.find(
        d => d.identifier === currentFormValues.departments
      );
  
      req.department_id = currentFormValues.departments || '';
      req.department_name = departmentName?.orgName || '';
    }
  

    
    // Polling API
    interval(5000)
      .pipe(
        switchMap(() => this.sharedService.generateRoleMapping(req, files)),
        takeWhile(data => data?.status !== 'COMPLETED', true)
      )
      .subscribe(data => {
        if (data?.status === 'COMPLETED') {
          this.loading = false;
  
          this.sharedService.cbpPlanFinalObj['role_mapping_generation'] = data?.role_mappings;
          localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj));
          
          this.successRoleMapping.emit(this.roleMappingForm);
          
          this.snackBar.open('CBP Plan generated successfully!', 'X', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.router.navigate(['/']);
        }
      });
  }
  

  generateFinalRoleMappingWithStream() {
    this.loading = true;
    console.log('roleMappingForm', this.roleMappingForm)
    if (this.roleMappingForm.valid) {
      const formData = this.roleMappingForm.value;
      const currentFormValues = this.roleMappingForm.getRawValue();
        let formUploadData :any= new FormData();

        // formUploadData.append('ministryType', currentFormValues.ministryType);
        // formUploadData.append('ministry', currentFormValues.ministry);
        // formUploadData.append('sectors', JSON.stringify(currentFormValues.sectors));
        // formUploadData.append('departments', JSON.stringify(currentFormValues.departments));
        formUploadData.append('state_center_id', currentFormValues.ministry || '');
        formUploadData.append('state_center_name', currentFormValues.ministry || '');
        
        if(currentFormValues.departments) {
          formUploadData.append('department_id', currentFormValues.departments || '');
        }
        if(currentFormValues.additionalDetails) {
          formUploadData.append('instruction', currentFormValues.additionalDetails || '');
        }
        const file: File = this.uploadedFile || this.roleMappingForm.get('additional_document')?.value;
        console.log('file', file)
        if (file) {
          formUploadData.append('additional_document', file);
        }
        console.log('this.roleMappingForm', this.roleMappingForm)
        console.log('formUploadData--', formUploadData)
        for (const pair of formUploadData.entries()) {
          console.log(`${pair[0]}:`, pair[1]);
        }
      console.log('Form submitted:', formData);
      let sectors = Array.isArray(formData.sectors) ? formData.sectors.join(', ') : ''
      this.sharedService.cbpPlanFinalObj['sectors'] = formData.sectors
      // Submit logic here
      let req = {
        "state_center_id":formData.ministry,
        "instruction": formData.additionalDetails
      }
      if(this.selectedMinistryType === 'state' || formData.departments ) {
        req['department_id'] = formData.departments ? formData.departments : ''
        this.sharedService.cbpPlanFinalObj['departments'] =  formData.departments ? formData.departments : ''


        const departmentName = this.departmentData.find(u => u.identifier=== formData.departments);
        this.sharedService.cbpPlanFinalObj['department_name'] =  departmentName
        this.sharedService.cbpPlanFinalObj['additionalDetails'] =  formData.additionalDetails
        console.log(departmentName);

      }
      this.sharedService.cbpPlanFinalObj['ministryType'] = this.selectedMinistryType

      if(req) {
        this.chunks = [];
        this.fullJson = '';
        this.parsedData = null;
        this.currentProcessingStage = this.processingStages[0];
        this.roleMappingService.generateRoleMapping(
          req,
          this.uploadedFile || null,
          (chunk) =>  {
            this.chunks.push(chunk)
            console.log('Received chunk:', chunk, 'Total chunks:', this.chunks.length)

            // Update processing stage based on chunk count
            this.updateProcessingStage();

            // Trigger change detection to update the UI
            setTimeout(() => {}, 0);
          },
          () => {
            console.log('Stream started')
            this.currentProcessingStage = this.processingStages[0];
          },
          () => this.onStreamEnd(),
          (err) => {
            console.error('Stream failed:', err)
            this.handleStreamError(err);
          }
        );
      }

      localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))

    } else {
      this.roleMappingForm.markAllAsTouched();
    }
  }

  updateProcessingStage() {
    const chunkCount = this.chunks.length;
    let stageIndex = 0;

    // Much slower stage progression - stages stay much longer
    if (chunkCount <= 8) {
      stageIndex = 0; // Initializing - stays for first 8 chunks
    } else if (chunkCount <= 20) {
      stageIndex = 1; // Analyzing competency requirements - 12 chunks
    } else if (chunkCount <= 35) {
      stageIndex = 2; // Processing work order - 15 chunks
    } else if (chunkCount <= 55) {
      stageIndex = 3; // Generating role mappings - 20 chunks
    } else if (chunkCount <= 75) {
      stageIndex = 4; // Computing final recommendations - 20 chunks
    } else {
      stageIndex = 5; // Finalizing CBP Plan - 75+ chunks
    }

    this.currentProcessingStage = this.processingStages[stageIndex];
  }

  getProgressPercentage(): number {
    const chunkCount = this.chunks.length;
    if (chunkCount === 0) return 0;

    // Much slower and smoother progress calculation
    let percentage = 0;

    if (chunkCount <= 15) {
      // First 15 chunks = 0-25% (very slow start)
      percentage = (chunkCount / 15) * 25;
    } else if (chunkCount <= 35) {
      // Next 20 chunks = 25-50% (slow early progress)
      percentage = 25 + ((chunkCount - 15) / 20) * 25;
    } else if (chunkCount <= 60) {
      // Next 25 chunks = 50-75% (steady middle progress)
      percentage = 50 + ((chunkCount - 35) / 25) * 25;
    } else if (chunkCount <= 100) {
      // Next 40 chunks = 75-90% (slower final approach)
      percentage = 75 + ((chunkCount - 60) / 40) * 15;
    } else {
      // Beyond 100 chunks = 90-95% (very slow final progression)
      percentage = 90 + Math.min(((chunkCount - 100) / 50) * 5, 5);
    }

    return Math.round(percentage);
  }

  onStreamEnd() {
    this.currentProcessingStage = 'Completing CBP Plan generation...';

    // Show 100% completion briefly before finishing
    setTimeout(() => {
      this.fullJson = this.chunks.join('');
      const cleaned = this.fullJson.replace(/^```json\n/, '').replace(/```$/, '');
      try {
        this.parsedData = JSON.parse(cleaned);
        console.log('Parsed data:', this.parsedData);

        // Handle successful completion
        this.loading = false;
        this.sharedService.cbpPlanFinalObj['role_mapping_generation'] = this.parsedData;
        this.successRoleMapping.emit(this.roleMappingForm);

        this.snackBar.open('CBP Plan generated successfully!', 'X', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      } catch (e) {
        console.error('JSON parse error:', e);
        this.loading = false;
        this.snackBar.open('Failed to generate CBP Plan. Please try again.', 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    }, 500);
  }

  // Helper method to get progress percentage including completion state
  getDisplayProgressPercentage(): number {
    if (this.currentProcessingStage === 'Completing CBP Plan generation...') {
      return 100;
    }
    return this.getProgressPercentage();
  }

  // Handle streaming errors, especially "Role mapping already exists"
  handleStreamError(err: any) {
    console.log('Error details:', err);
    
    // Check if this is the "Role mapping already exists" error
    if (err?.isExistingRoleMapping || (err?.detail && err.detail.includes('Role mapping already exists'))) {
      this.currentProcessingStage = 'Loading existing role mapping...';
      
      // Call the appropriate Get role mapping API based on ministry type
      const formData = this.roleMappingForm.value;
      const stateCenter = formData.ministry;
      const departmentId = formData.departments;
      
      if (this.selectedMinistryType === 'state' && departmentId) {
        // Call Get role mapping by state center and department
        this.sharedService.getRoleMappingByStateCenterAndDepartment(stateCenter, departmentId).subscribe({
          next: (res) => {
            console.log('Existing role mapping loaded:', res);
            this.loading = false;
            this.sharedService.cbpPlanFinalObj['role_mapping_generation'] = res;
            this.snackBar.open('Existing role mapping loaded successfully!', 'X', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
            this.alreadyAvailableRoleMapping.emit(this.roleMappingForm);
          },
          error: (error) => {
            console.error('Failed to load existing role mapping:', error);
            this.loading = false;
            this.snackBar.open('Failed to load existing role mapping. Please try again.', 'X', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        });
      } else {
        // Call Get role mapping by state center only
        this.sharedService.getRoleMappingByStateCenter(stateCenter).subscribe({
          next: (res) => {
            console.log('Existing role mapping loaded:', res);
            this.loading = false;
            this.sharedService.cbpPlanFinalObj['role_mapping_generation'] = res;
            this.snackBar.open('Existing role mapping loaded successfully!', 'X', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
            this.alreadyAvailableRoleMapping.emit(this.roleMappingForm);
          },
          error: (error) => {
            console.error('Failed to load existing role mapping:', error);
            this.loading = false;
            this.snackBar.open('Failed to load existing role mapping. Please try again.', 'X', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        });
      }
    } else {
      // Handle other streaming errors
      this.loading = false;
      const errorMessage = err?.detail || 'Stream failed. Please try again.';
      this.snackBar.open(errorMessage, 'X', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  }
  removeFile(index: number): void {
    if (!this.uploadedFile || this.uploadedFile.length === 0) return;
  
    // Remove one file at the given index
    this.uploadedFile.splice(index, 1);
  
    // Update form control value
    this.roleMappingForm.get('additional_document')?.setValue(this.uploadedFile);
    this.roleMappingForm.get('additional_document')?.updateValueAndValidity();
  
    // Clear errors if no files left
    if (this.uploadedFile.length === 0) {
      this.uploadError = '';
      const input = document.getElementById('uploadDoc') as HTMLInputElement;
      if (input) input.value = '';
    }
  }
  

  getUserProfileData() {
    this.sharedService.getUserProfile().subscribe((data)=>{
      console.log('data--', data)
      this.loginUserOrgIds = data?.organization_ids
      let filteredMinistryData =  []
      this.ministryFullData.map((item)=>{
        if(this.loginUserOrgIds.indexOf(item?.identifier) > -1) {
          filteredMinistryData.push(item)
        }
      })

      this.ministryData = filteredMinistryData
      this.originalMinistryData = filteredMinistryData
      this.filteredList = filteredMinistryData;
    })
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

  ngOnDestroy() {
    this.selectedMinistryId = ''
    this.roleMappingForm.reset()
  }

  onDepartmentChange() {
    const formData = this.roleMappingForm.value;
     
    this.sharedService.cbpPlanFinalObj['departments'] =  formData.departments ? formData.departments : ''


      const departmentName = this.departmentData.find(u => u.identifier=== formData.departments);
      this.sharedService.cbpPlanFinalObj['department_name'] =  departmentName?.orgName
      localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
  }



  
}



