import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-role-mapping',
  templateUrl: './delete-role-mapping.component.html',
  styleUrls: ['./delete-role-mapping.component.scss']
})
export class DeleteRoleMappingComponent {

  loading = false
  planData:any
  constructor( public dialogRef: MatDialogRef<DeleteRoleMappingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private sharedService: SharedService,
    private snackBar:MatSnackBar) {
      this.planData = data
    }

  deleteRoleMapping() {
    // this.sharedService.deleteRoleMapping(this.planData.id).subscribe(()=>{
    //   this.dialogRef.close('saved')
    // })
    this.sharedService.deleteRoleMapping(this.planData.id).subscribe({
      next: () => {
        this.dialogRef.close('saved')
        this.snackBar.open('Role Mapping Deleted successfully', 'X', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      },
      error: (error) => {
        this.dialogRef.close()
        this.snackBar.open(error?.error?.detail, 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
    
  }

  cancel() {
    this.dialogRef.close()
  }
}
