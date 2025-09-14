import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/modules/shared/services/shared.service';


@Component({
  selector: 'app-add-personalisation',
  templateUrl: './add-personalisation.component.html',
  styleUrls: ['./add-personalisation.component.scss']
})
export class AddPersonalisationComponent {

  constructor(public dialogRef: MatDialogRef<AddPersonalisationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private sharedService: SharedService, private dialog: MatDialog){

    }

  saveRoleMapping() {
    this.dialogRef.close()
  }

  closeDialog() {
    this.dialogRef.close()
  }

  cancelForm() {
    this.dialogRef.close()
  }
}
