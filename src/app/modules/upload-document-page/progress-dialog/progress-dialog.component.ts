import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-progress-dialog',
  template: `
    <div class="progress-container">
      <h3>Processing Summaries</h3>
      <p>{{ data.message }}</p>
      <p>Please wait , it will take few minutes to complete</p>
      <div class="progress-container">
        <!-- Circular Spinner -->
        <div class="spinner"></div>

        <!-- Linear Progress Bar -->
        <div class="linear-progress">
          <div class="bar"></div>
        </div>

       
      </div>
    </div>
  `,
  styles: [`
    .progress-container {
      padding: 20px;
      width: auto;
      text-align: center;
    }
    mat-progress-bar {
      margin-top: 20px;
    }
   

/* =========================
   Circular Spinner
========================= */
.spinner {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 6px solid #e8e6ff;
  border-top-color: #5b5bf0;
  border-right-color: #8b7cf7;
  animation: spin 1.2s linear infinite;
  margin: 0 auto 28px;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

/* =========================
   Linear Progress Bar
========================= */
.linear-progress {
  position: relative;
  width: 100%;
  height: 8px;
  background: #e8e6ff;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 24px;
}

.linear-progress .bar {
  position: absolute;
  height: 100%;
  width: 40%;
  background: linear-gradient(
    90deg,
    #b8b1ff,
    #5b5bf0,
    #b8b1ff
  );
  animation: indeterminate 1.6s infinite ease-in-out;
}

@keyframes indeterminate {
  0% {
    left: -40%;
  }
  100% {
    left: 100%;
  }
}

/* =========================
   Text
========================= */
.label strong {
  font-size: 18px;
  color: #2f2f44;
}

.label p {
  margin-top: 4px;
  font-size: 14px;
  color: #6b6b8a;
}

  `]
})
export class ProgressDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { progress: number; message: string }) {
    console.log('data--', data)
  }
}