import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProgressDialogComponent } from '../progress-dialog/progress-dialog.component';
import { interval, forkJoin } from 'rxjs';
import { map, startWith, switchMap, takeWhile, tap } from 'rxjs/operators';
@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent {

  readonly MAX_FILES = 10;

  documentName = '';
  selectedFiles: File[] = [];
  cbpFinalObj: any = {};
  loading = false;
  uploadedFileData: any = {};

  constructor(
    public dialogRef: MatDialogRef<UploadDialogComponent>,
    public sharedService: SharedService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.cbpFinalObj = this.sharedService.getCBPPlanLocalStorage();
  }

  /** Already uploaded files count */
  get uploadedCount(): number {
    return this.cbpFinalObj?.documents?.length || 0;
  }

  /** Uploaded + newly selected */
  get totalFileCount(): number {
    return this.uploadedCount + this.selectedFiles.length;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    const allowedExtensions = ['pdf', 'doc', 'docx'];

    for (const file of files) {
      if (this.totalFileCount >= this.MAX_FILES) {
        this.snackBar.open('You can upload a maximum of 10 documents.', 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        break;
      }

      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !allowedExtensions.includes(ext)) {
        this.snackBar.open(
          `Invalid file type: ${file.name}`,
          'X',
          { duration: 3000, panelClass: ['snackbar-error'] }
        );
        continue;
      }

      // Prevent duplicate selection
      if (this.selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
        continue;
      }

      this.selectedFiles.push(file);
    }

    // Reset input so same file can be re-selected
    input.value = '';
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  // upload(): void {
  //   if (!this.documentName || this.selectedFiles.length === 0) {
  //     return;
  //   }

  //   if (this.totalFileCount > this.MAX_FILES) {
  //     this.snackBar.open('Maximum 10 documents allowed.', 'X', {
  //       duration: 3000,
  //       panelClass: ['snackbar-error']
  //     });
  //     return;
  //   }

  //   this.loading = true;

  //   const uploadNext = (index: number) => {
  //     if (index >= this.selectedFiles.length) {
  //       this.loading = false;
  //       this.dialogRef.close('close');
  //       return;
  //     }

  //     const file = this.selectedFiles[index];

  //     const reqBody = {
  //       state_center_id: this.cbpFinalObj?.ministry?.identifier,
  //       department_id: this.cbpFinalObj?.departments,
  //       documentName: this.documentName
  //     };

  //     this.sharedService.uploadDocument(reqBody, file).subscribe({
  //       next: (res) => {
  //         this.uploadedFileData = res;
  //         this.triggerFileSummary();
  //         uploadNext(index + 1);
  //       },
  //       error: (err) => {
  //         this.loading = false;
  //         this.snackBar.open(
  //           err?.error?.detail || 'Upload failed',
  //           'X',
  //           { duration: 3000, panelClass: ['snackbar-error'] }
  //         );
  //       }
  //     });
  //   };

  //   uploadNext(0);
  // }

  upload(): void {
    if (this.selectedFiles.length === 0) {
      return;
    }
  
    if (this.totalFileCount > this.MAX_FILES) {
      this.snackBar.open('Maximum 10 documents allowed.', 'X', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }
  
    const formData = new FormData();
  
    // Required fields
    formData.append(
      'state_center_id',
      this.cbpFinalObj?.ministry?.identifier || ''
    );
  
    formData.append(
      'department_id',
      this.cbpFinalObj?.departments || ''
    );
  
    // Append multiple files with SAME key "files"
    this.selectedFiles.forEach((file: File) => {
      formData.append('files', file, file.name);
    });
  
    this.loading = true;
  
    this.sharedService.uploadDocument(formData).subscribe({
      next: (res) => {
        this.loading = false;
        this.uploadedFileData = res;
        this.triggerFileSummary();
        this.snackBar.open(res?.message, 'X', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
  
        
      },
      error: (error) => {
        this.loading = false;
  
        this.snackBar.open(
          error?.error?.detail || 'Upload failed',
          'X',
          { duration: 3000, panelClass: ['snackbar-error'] }
        );
      }
    });
  }
  


  triggerFileSummary() {
    if (!this.uploadedFileData?.successful_uploads?.length) return;
  
    const files = this.uploadedFileData.successful_uploads;
    const totalFiles = files.length;
  
    const dialogRefForProgress = this.dialog.open(ProgressDialogComponent, {
      disableClose: true,
      data: { progress: 0, message: `Processing 0 of ${totalFiles} summaries...` }
    });
  
    let completedFiles = 0;
  
    const pollingRequests = files.map(file =>
      interval(5000).pipe(
        startWith(0), // trigger immediately
        switchMap(() => this.sharedService.triggerFileSummary(file.file_id)), // must return { summary_status }
        tap((res: any) => {
          if (res.summary_status === 'COMPLETED') {
            completedFiles++;
            dialogRefForProgress.componentInstance.data.progress = Math.floor((completedFiles / totalFiles) * 100);
            dialogRefForProgress.componentInstance.data.message = `Processing ${completedFiles} of ${totalFiles} summaries...`;
          }
        }),
        takeWhile((res: any) => res.summary_status !== 'COMPLETED', true)
      )
    );
  
    forkJoin(pollingRequests).subscribe({
      complete: () => {
        dialogRefForProgress.componentInstance.data.progress = 100;
        dialogRefForProgress.componentInstance.data.message = `All ${totalFiles} summaries completed!`;
        setTimeout(() => {
          dialogRefForProgress.close();
          this.dialogRef.close('close');
        }, 500);
      },
      error: () => {
        dialogRefForProgress.close();
        this.dialogRef.close('close');
      }
    });
  }
  


}
