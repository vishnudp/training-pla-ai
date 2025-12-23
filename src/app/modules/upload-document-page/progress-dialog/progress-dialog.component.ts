import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-progress-dialog',
  template: `
    <div class="progress-container">
      <h3>Processing File</h3>
      <p>{{ data.message }}</p>
      <mat-progress-bar mode="determinate" [value]="data.progress"></mat-progress-bar>
    </div>
  `,
  styles: [`
    .progress-container {
      padding: 20px;
      width: 300px;
      text-align: center;
    }
    mat-progress-bar {
      margin-top: 20px;
    }
  `]
})
export class ProgressDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { progress: number; message: string }) {}
}