import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { EditCbpPlanComponent } from '../edit-cbp-plan/edit-cbp-plan.component';
import { GenerateCourseRecommendationComponent } from '../generate-course-recommendation/generate-course-recommendation.component';
import html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-view-cbp-plan',
  templateUrl: './view-cbp-plan.component.html',
  styleUrls: ['./view-cbp-plan.component.scss']
})
export class ViewCbpPlanComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  selectedValue = ''
  searchText = ''
  planData:any
  competenciesCount = {total:0, behavioral:0, functional:0, domain:0}
  constructor(
    public dialogRef: MatDialogRef<ViewCbpPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {
    this.planData = data
    console.log('Received data:', data);
    this.planData.competencies.map((competencies:any)=>{
      this.competenciesCount['total'] = this.competenciesCount['total'] + 1 
      if(competencies.type === 'Behavioral') {
        this.competenciesCount['behavioral'] = this.competenciesCount['behavioral'] +1
      }
      if(competencies.type === 'Functional') {
        this.competenciesCount['functional'] = this.competenciesCount['functional'] +1
      }
      if(competencies.type === 'Domain') {
        this.competenciesCount['domain'] = this.competenciesCount['domain'] +1
      }
    })
  }

  searchData() {

  }

  applyFilter() {
   
  }

  getCompetenciesByType(competencies: any[], type: string): any[] {
    return competencies?.filter(c => c.type === type) || [];
  }

  closeDialog() {
    this.dialogRef.close(); 
  }

  editCBPPlan() {
    this.dialogRef.close();
    const dialogRefNew = this.dialog.open(EditCbpPlanComponent, {
      width: '1000px',
      data: this.planData,
       panelClass: 'view-cbp-plan-popup',
      minHeight: '300px',          // Set minimum height
      maxHeight: '80vh',           // Prevent it from going beyond viewport
      disableClose: true // Optional: prevent closing with outside click
    });
  
    dialogRefNew.afterClosed().subscribe(result => {
      if (result === 'saved') {
        console.log('Changes saved!');
        // Refresh data or show a toast here
      }
    });
  }

  generateCourseRecommendation() {
    this.dialogRef.close();
    console.log('Generate Course Recommendation clicked', this.planData);
    
    console.log('Edit Role Mapping clicked', this.planData);
    // Navigate or open modal
    console.log('View CBP Plan clicked', this.planData);
    const dialogRef = this.dialog.open(GenerateCourseRecommendationComponent, {
      width: '1000px',
      data: this.planData,
       panelClass: 'view-cbp-plan-popup',
      minHeight: '400px',          // Set minimum height
      maxHeight: '90vh',           // Prevent it from going beyond viewport
      disableClose: true // Optional: prevent closing with outside click
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        console.log('Changes saved!');
        // Refresh data or show a toast here
       
        
      }
    });
  }

  downloadPDF() {
    const element = this.pdfContent.nativeElement;

  // Wait for images to load
  const images = element.querySelectorAll('img');
  const promises = Array.from(images).map((img: HTMLImageElement) => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => img.onload = resolve);
  });

  Promise.all(promises).then(() => {
    const options = {
      margin: 0.5,
      filename: 'Role Mapping.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0,
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: {
        mode: ['css', 'legacy', 'avoid-all']
      }
    };

    html2pdf().from(element).set(options).save();
  });
}
}
