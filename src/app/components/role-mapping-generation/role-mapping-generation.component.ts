import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
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
  ministrySearchText: string = '';
  filteredMinistryData:any = []
  @Output() successRoleMapping = new EventEmitter<any>()
  @Output() alreadyAvailableRoleMapping = new EventEmitter<any>()
  @Output() loginSuccess = new EventEmitter<any>()
  searchControl: FormControl = new FormControl('');
  constructor(
    private eventSvc: EventService,
    public sharedService: SharedService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public roleMappingService: RoleMappingService
  ) {
    this.dataSource = new MatTableDataSource<any>([])
    this.isMaintenancePage = window.location.href.includes('/maintenance')
  }

  ngOnInit() {
    this.sharedService.loginSuccess.subscribe((data)=>{
   
      if(!data) {
        this.login = false
      }
     })
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
        additionalDetails: [''],
        additional_document: [],
        
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

      this.searchControl.valueChanges.subscribe(searchText => {
        if(searchText) {
          this.filterMinistryData(searchText);
        } else {
          this.filteredMinistryData = this.ministryData
        }
        
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
        additionalDetails: [this.cbpFinalObj?.additionalDetails]
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
      // console.log('this.ministryData', this.ministryData)
      if(this.ministryData && this.ministryData.length) {
        this.selectedMinistryId = this.cbpFinalObj?.ministry?.id
      }
    }
    this.originalFormValues = this.roleMappingForm.getRawValue();
  }

  ngOnChanges() {
    this.login = this.loginStatusFlag
    if(!this.ministryData.length && this.loginStatusFlag) [
      this.getMinistryData()
    ]

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
    // console.log('file', file)
    if (file) {
      formData.append('additional_document', file);
    }
    // console.log('this.roleMappingForm', this.roleMappingForm)
    // console.log('formData--', formData)
    for (const pair of formData.entries()) {
     // console.log(`${pair[0]}:`, pair[1]);
    }


    const changedFields = this.getChangedFields(this.originalFormValues, currentFormValues);

      if (changedFields.length > 0 || (file && file.size > 0)) {
        // console.log('changedFields', changedFields)
        // console.log('Changed fields:', changedFields);
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
            //  console.log('Changes saved!');
              this.loading = true
              this.sharedService.deleteRoleMappingByStateAndDepartment(this.roleMappingForm.value.ministry, this.roleMappingForm.value.departments).subscribe({
                next: (res) => {
                  // Success handling
                 // console.log('Success:', res);
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
       // console.log('No changes detected.');
      }

  }


  getMinistryData() {
    this.sharedService.getMinistryData().subscribe((data:any)=>{
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

  onMinistryTypeChange(event) {
   // console.log('event', event)
    this.sharedService.cbpPlanFinalObj['ministryType'] =  event.value
    localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
    this.ministryData = []
    if(event?.value === 'state') {
      this.roleMappingForm.get('sectors')?.setValue([]);
      this.ministryFullData.forEach((item)=>{
        if(item?.type === 'state') {
          this.ministryData.push(item)
          this.filteredMinistryData = [...this.ministryData];
        }
      })
    } else if(event?.value === 'center') {
      this.roleMappingForm.get('sectors')?.setValue([]);
      this.ministryFullData.forEach((item)=>{
        if(item?.type === 'central') {
          this.ministryData.push(item)
          this.filteredMinistryData = [...this.ministryData];
        }
      })
    }
  }

  onMinistryChange(event: any) {
    const selectedMinistryId = event.value;
   // console.log('Selected Ministry ID:', selectedMinistryId);

    // You can access the selected object if needed
    const selectedMinistry = this.ministryData.find(item => item.id === selectedMinistryId);
  //  console.log('Selected Ministry:', selectedMinistry);``
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
     this.roleMappingForm.get('additional_document')?.setErrors({ maxSize: true });
      return;
    }

    // Validate file type
    if (!this.allowedTypes.includes(file.type)) {
      this.uploadError = `Invalid file type. Allowed: PDF, Word, Excel, TXT`;
      this.roleMappingForm.get('additional_document')?.setErrors({ fileType: true });
      return;
    }

    this.uploadedFile = file;
    this.uploadError = null;
    this.roleMappingForm.patchValue({ additional_document: file });
    this.roleMappingForm.get('additional_document')?.updateValueAndValidity();
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

  generateFinalRoleMapping() {
    this.loading = true;
    if (this.roleMappingForm.valid) {
      const formData = this.roleMappingForm.value;
      const currentFormValues = this.roleMappingForm.getRawValue();
        let formUploadData :any= new FormData();

        // formUploadData.append('ministryType', currentFormValues.ministryType);
        // formUploadData.append('ministry', currentFormValues.ministry);
        // formUploadData.append('sectors', JSON.stringify(currentFormValues.sectors));
        // formUploadData.append('departments', JSON.stringify(currentFormValues.departments));
        formUploadData.append('state_center_id', currentFormValues.ministry || '');
        if(currentFormValues.departments) {
          formUploadData.append('department_id', currentFormValues.departments || '');
        }
        if(currentFormValues.additionalDetails) {
          formUploadData.append('instruction', currentFormValues.additionalDetails || '');
        }
        const file: File = this.uploadedFile || this.roleMappingForm.get('additional_document')?.value;
      //  console.log('file', file)
        if (file) {
          formUploadData.append('additional_document', file);
        }
        // console.log('this.roleMappingForm', this.roleMappingForm)
        // console.log('formUploadData--', formUploadData)
        for (const pair of formUploadData.entries()) {
         // console.log(`${pair[0]}:`, pair[1]);
        }
     // console.log('Form submitted:', formData);
      let sectors = Array.isArray(formData.sectors) ? formData.sectors.join(', ') : ''
      this.sharedService.cbpPlanFinalObj['sectors'] = formData.sectors
      // Submit logic here
      let req = {
        "state_center_id":formData.ministry,
        "instruction": formData.additionalDetails
      }
      if(this.selectedMinistryType === 'state') {
        req['department_id'] = formData.departments ? formData.departments : ''
        this.sharedService.cbpPlanFinalObj['departments'] =  formData.departments ? formData.departments : ''


        const departmentName = this.departmentData.find(u => u.id=== formData.departments);
        this.sharedService.cbpPlanFinalObj['department_name'] =  departmentName
        this.sharedService.cbpPlanFinalObj['additionalDetails'] =  formData.additionalDetails
        //console.log(departmentName);

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
          //  console.log('Received chunk:', chunk, 'Total chunks:', this.chunks.length)

            // Update processing stage based on chunk count
            this.updateProcessingStage();

            // Trigger change detection to update the UI
            setTimeout(() => {}, 0);
          },
          () => {
          //  console.log('Stream started')
            this.currentProcessingStage = this.processingStages[0];
          },
          () => this.onStreamEnd(),
          (err) => {
           // console.error('Stream failed:', err)
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
       // console.log('Parsed data:', this.parsedData);

        // Handle successful completion
        this.loading = false;
        this.sharedService.cbpPlanFinalObj['role_mapping_generation'] = this.parsedData;
        this.successRoleMapping.emit(this.roleMappingForm);

        this.snackBar.open('CBP Plan generated successfully!', 'X', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      } catch (e) {
       // console.error('JSON parse error:', e);
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
    //console.log('Error details:', err);
    
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
            //console.log('Existing role mapping loaded:', res);
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
            //console.log('Existing role mapping loaded:', res);
            this.loading = false;
            this.sharedService.cbpPlanFinalObj['role_mapping_generation'] = res;
            this.snackBar.open('Existing role mapping loaded successfully!', 'X', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
            this.alreadyAvailableRoleMapping.emit(this.roleMappingForm);
          },
          error: (error) => {
           // console.error('Failed to load existing role mapping:', error);
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

  removeFile(): void {
    this.uploadedFile = null;
    this.uploadError = '';

    // Also reset the input element if needed
    const input = document.getElementById('uploadDoc') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
    this.roleMappingForm.get('additional_document').setValue([])
    this.roleMappingForm.get('additional_document')?.updateValueAndValidity();
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

  
}

