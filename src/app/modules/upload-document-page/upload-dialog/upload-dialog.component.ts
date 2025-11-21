import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgressDialogComponent } from '../progress-dialog/progress-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent {
  documentName = '';
  selectedFile: File | null = null;
  cbpFinalObj:any= {}
  loading = false
  uploadedFileData:any = {}
  constructor(public dialogRef: MatDialogRef<UploadDialogComponent>, public sharedService: SharedService,
    public snackBar: MatSnackBar, 
    public dialog: MatDialog
  ) {
    this.cbpFinalObj = this.sharedService.getCBPPlanLocalStorage()
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        this.selectedFile = file;
      } else {
        this.selectedFile = null; // clear selection
        this.snackBar.open('Only PDF, DOC, and DOCX files are allowed.', 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    }
  }

  upload(): void {
    if (this.selectedFile && this.documentName) {
      const newDoc = {
        name: this.documentName,
        size: +(this.selectedFile.size / 1024).toFixed(1),
        date: new Date().toLocaleDateString()
      };
      if(this.cbpFinalObj && this.cbpFinalObj?.ministryType && (this.cbpFinalObj?.ministryType === 'center' || this.cbpFinalObj?.ministryType === 'state')) { 
        console.log(this.cbpFinalObj)

        let reqBody = {
          state_center_id: this.cbpFinalObj?.ministry?.identifier,
          department_id:'' ,//this.cbpFinalObj?.departments
          documentName: this.documentName
        }
        if(this.cbpFinalObj && this.cbpFinalObj?.ministryType && (this.cbpFinalObj?.ministryType === 'state')) {
          reqBody['department_id'] = this.cbpFinalObj?.departments
         reqBody['state_center_id'] = this.cbpFinalObj?.ministry?.identifier
        }
        this.loading = true;
        this.sharedService.uploadDocument(reqBody, this.selectedFile).subscribe({
          next: (res) => {
            this.uploadedFileData = res
            this.loading = false;
            //console.log('Center role mapping data refreshed:', res);
            this.snackBar.open('Document Uploaded Successfully', 'X', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });

            this.triggerFileSummary()
            this.dialogRef.close('close');
          },
          error: (error) => {
            console.log('error', error)
            let errorText = error?.error?.detail
            console.log('errorText', errorText)
            this.uploadedFileData = {}
            this.loading = false;
            this.snackBar.open(errorText, 'X', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        });
        
      }
     

      //this.dialogRef.close(newDoc);
    }
  }

  triggerFileSummary() {
    if (this.uploadedFileData && this.uploadedFileData.file_id) {
      let fileId = this.uploadedFileData.file_id;
      
      // Open progress dialog
      const dialogRefForProgress = this.dialog.open(ProgressDialogComponent, {
        disableClose: true,
        data: {
          progress: 0,
          message: 'Starting...'
        }
      });
  
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        dialogRefForProgress.componentInstance.data.progress = progress;
        dialogRefForProgress.componentInstance.data.message = `${progress}% done`;
  
        if (progress >= 100) {
          this.sharedService.summaryTriggerExecuted.next(this.uploadedFileData)
          clearInterval(interval);
        }
      }, 300); // adjust time per update if needed
  
      this.loading = true;
      this.sharedService.triggerFileSummary(fileId).subscribe({
        next: (res) => {
          this.loading = false;
          // Wait until 100% and then close dialog
          const waitToClose = setInterval(() => {
            if (progress >= 100) {
              dialogRefForProgress.close();
              
              clearInterval(waitToClose);
            }
          }, 100);
        },
        error: () => {
          this.loading = false;
          dialogRefForProgress.close();
          this.snackBar.open('Error while generating summary', 'X', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    }
  }
  
}
