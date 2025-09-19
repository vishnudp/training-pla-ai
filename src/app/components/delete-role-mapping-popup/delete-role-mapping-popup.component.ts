import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/modules/shared/services/shared.service';

@Component({
  selector: 'app-delete-role-mapping-popup',
  templateUrl: './delete-role-mapping-popup.component.html',
  styleUrls: ['./delete-role-mapping-popup.component.scss']
})
export class DeleteRoleMappingPopupComponent {
  planData:any
  constructor( public dialogRef: MatDialogRef<DeleteRoleMappingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public sharedService: SharedService) {
      this.planData = data
    }

  regenerateRoleMapping() {
      this.dialogRef.close('saved')
  }

  cancel() {
    this.dialogRef.close()
  }
}
