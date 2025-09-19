import { Component, ChangeDetectorRef, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
// import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-view-final-cbp-plan',
  templateUrl: './view-final-cbp-plan.component.html',
  styleUrls: ['./view-final-cbp-plan.component.scss']
})
export class ViewFinalCbpPlanComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewFinalCbpPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public sharedService: SharedService
  ) {
    this.getMappingData()
  }
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  loading = false
  designationData:any = []
  totalCompetencieObj = {total:0, behavioral:0, functional:0, domain:0}
  // designationData = [
  //   {
  //     designation: "Secretary (WCD)",
  //     wing: "Ministry Leadership",
  //     updated: "10/09/2025",
  //     rolesResponsibilities: [
  //       "Provide overall supervision of ministry programmes and schemes",
  //       "Ensure effective coordination with State Governments for scheme implementation",
  //       "Strategic policy formulation and implementation oversight",
  //       "Inter-ministerial coordination and liaison",
  //       "Parliamentary affairs management",
  //       "Senior leadership governance and oversight",
  //       "National programme strategic direction",
  //       "Cabinet note writing and policy briefs"
  //     ],
  //     behavioralCompetencies: [
  //       "Strategic Leadership", "Executive Presence", "Influencing and Negotiation",
  //       "Relationship Management", "Verbal & Non-Verbal Fluency", "Planning & Prioritization",
  //       "Accountability", "Conflict Management"
  //     ],
  //     functionalCompetencies: [
  //       "Rules of business (AoB/ToB)", "Cabinet note writing", "Submission of briefs, supply of information",
  //       "Policy design/ amendment", "Policy implementation", "Policy monitoring & impact assessment",
  //       "Project Planning", "Project Evaluation & Monitoring", "Creation of M&E Framework",
  //       "Citizen Partnering & Collaboration", "Public Grievance Handling"
  //     ],
  //     domainCompetencies: [
  //       "Strategic Policy Formulation", "Inter-ministerial & State Government Coordination",
  //       "Senior Leadership Governance & Oversight", "Legislative & Parliamentary Affairs Management",
  //       "National Programme Strategic Direction"
  //     ],
  //     completionRate: { behavioral: 85, functional: 78, domain: 92 }
  //   }
  // ];
  
  // // Calculate the totals dynamically
  // private behavioralTotal = this.designationData.reduce((acc, item) => acc + item.behavioralCompetencies.length, 0);
  // private functionalTotal = this.designationData.reduce((acc, item) => acc + item.functionalCompetencies.length, 0);
  // private domainTotal = this.designationData.reduce((acc, item) => acc + item.domainCompetencies.length, 0);

  // // Calculate the averages dynamically
  // private behavioralAvg = Math.round(this.designationData.reduce((acc, item) => acc + item.completionRate.behavioral, 0) / this.designationData.length);
  // private functionalAvg = Math.round(this.designationData.reduce((acc, item) => acc + item.completionRate.functional, 0) / this.designationData.length);
  // private domainAvg = Math.round(this.designationData.reduce((acc, item) => acc + item.completionRate.domain, 0) / this.designationData.length);
  
  // overallKPIs = [
  //   {
  //     name: 'Behavioral Competencies',
  //     total: this.behavioralTotal,
  //     avgCompletion: this.behavioralAvg,
  //     color: '#3B82F6',
  //     bgColor: 'bg-blue-50',
  //   },
  //   {
  //     name: 'Functional Competencies',
  //     total: this.functionalTotal,
  //     avgCompletion: this.functionalAvg,
  //     color: '#10B981',
  //     bgColor: 'bg-green-50',
  //   },
  //   {
  //     name: 'Domain Competencies',
  //     total: this.domainTotal,
  //     avgCompletion: this.domainAvg,
  //     color: '#8B5CF6',
  //     bgColor: 'bg-purple-50',
  //   },
  //   {
  //     name: 'Total Competencies',
  //     total: this.behavioralTotal + this.functionalTotal + this.domainTotal,
  //     avgCompletion: Math.round((this.behavioralAvg + this.functionalAvg + this.domainAvg) / 3),
  //     color: '#4B5563',
  //     bgColor: 'bg-gray-200',
  //   }
  // ];

  closeDialog() {
    this.dialogRef.close()
  }

  cancelForm() {
    this.dialogRef.close()
  }

  saveRoleMapping() {

  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
    setTimeout(() => {
      this.scrollToTop();
    });
  }

  getMappingData() {
    console.log('haredService?.cbpPlanFinalObj', this.sharedService?.cbpPlanFinalObj)
    if(this.sharedService?.cbpPlanFinalObj.ministry.type === 'central') {
      let state_center_id = this.sharedService?.cbpPlanFinalObj.ministry.id
      this.sharedService.getRoleMappingByStateCenter(state_center_id).subscribe((res)=>{
       console.log('res', res)
       let behavioralCompetencies =[]
       let functionalCompetencies =[]
       let domainCompetencies =[]
       for(let i=0; i<res.length;i++) {
        behavioralCompetencies = []
        functionalCompetencies =[]
        domainCompetencies =[]
        let competenciesObj = {total:0, behavioral:0, functional:0, domain:0}
       res[i].competencies.forEach(c => {
        competenciesObj.total++;
        this.totalCompetencieObj.total++
         if (c.type.toLowerCase() === 'behavioral') { 
          
          behavioralCompetencies.push(`${c.theme} - ${c.sub_theme}`)
          competenciesObj.behavioral++;
          this.totalCompetencieObj.behavioral++
         }
         if (c.type.toLowerCase() === 'functional') {
          functionalCompetencies.push(`${c.theme} - ${c.sub_theme}`)
          competenciesObj.functional++;
          this.totalCompetencieObj.functional++
         }
         if (c.type.toLowerCase() === 'domain') { 
          domainCompetencies.push(`${c.theme} - ${c.sub_theme}`)
          competenciesObj.domain++;
          this.totalCompetencieObj.domain++

         }
       });
        let obj:any =  {
          designation: res[i].designation_name,
          wing: res[i].wing_division_section,
          updated: res[i].updated_at,
          rolesResponsibilities: res[i].role_responsibilities,
          activities:res[i].activities,
          competenciesObj: competenciesObj,
          behavioralCompetencies: behavioralCompetencies,
          functionalCompetencies: functionalCompetencies,
          domainCompetencies: domainCompetencies
          // behavioralCompetencies: [
          //   "Strategic Leadership", "Executive Presence", "Influencing and Negotiation",
          //   "Relationship Management", "Verbal & Non-Verbal Fluency", "Planning & Prioritization",
          //   "Accountability", "Conflict Management"
          // ],
          // functionalCompetencies: [
          //   "Rules of business (AoB/ToB)", "Cabinet note writing", "Submission of briefs, supply of information",
          //   "Policy design/ amendment", "Policy implementation", "Policy monitoring & impact assessment",
          //   "Project Planning", "Project Evaluation & Monitoring", "Creation of M&E Framework",
          //   "Citizen Partnering & Collaboration", "Public Grievance Handling"
          // ],
          // domainCompetencies: [
          //   "Strategic Policy Formulation", "Inter-ministerial & State Government Coordination",
          //   "Senior Leadership Governance & Oversight", "Legislative & Parliamentary Affairs Management",
          //   "National Programme Strategic Direction"
          // ],
          // completionRate: { behavioral: 85, functional: 78, domain: 92 }
        }
       
        
       this.designationData.push(obj)
       }
       console.log('this.designationData', this.designationData)
       console.log('this.totalCompetencieObj', this.totalCompetencieObj )
       this.cdr.detectChanges();
       setTimeout(() => {
        this.scrollToTop()
      }, 1000);
       })
    }
    if(this.sharedService?.cbpPlanFinalObj.ministry.type === 'state') {
      console.log('this.sharedService?.cbpPlanFinalObj',this.sharedService?.cbpPlanFinalObj)
      let state_center_id = this.sharedService?.cbpPlanFinalObj.ministry.id
      let department_id = this.sharedService?.cbpPlanFinalObj.departments
      this.sharedService.getRoleMappingByStateCenterAndDepartment(state_center_id, department_id).subscribe((res)=>{
        console.log('res', res)
        let behavioralCompetencies =[]
        let functionalCompetencies =[]
        let domainCompetencies =[]
        for(let i=0; i<res.length;i++) {
         behavioralCompetencies = []
         functionalCompetencies =[]
         domainCompetencies =[]
         let competenciesObj = {total:0, behavioral:0, functional:0, domain:0}
        res[i].competencies.forEach(c => {
         competenciesObj.total++;
         this.totalCompetencieObj.total++
          if (c.type.toLowerCase() === 'behavioral') { 
           
           behavioralCompetencies.push(`${c.theme} - ${c.sub_theme}`)
           competenciesObj.behavioral++;
           this.totalCompetencieObj.behavioral++
          }
          if (c.type.toLowerCase() === 'functional') {
           functionalCompetencies.push(`${c.theme} - ${c.sub_theme}`)
           competenciesObj.functional++;
           this.totalCompetencieObj.functional++
          }
          if (c.type.toLowerCase() === 'domain') { 
           domainCompetencies.push(`${c.theme} - ${c.sub_theme}`)
           competenciesObj.domain++;
           this.totalCompetencieObj.domain++
 
          }
        });
         let obj:any =  {
           designation: res[i].designation_name,
           wing: res[i].wing_division_section,
           updated: res[i].updated_at,
           rolesResponsibilities: res[i].role_responsibilities,
           activities:res[i].activities,
           competenciesObj: competenciesObj,
           behavioralCompetencies: behavioralCompetencies,
           functionalCompetencies: functionalCompetencies,
           domainCompetencies: domainCompetencies
           // behavioralCompetencies: [
           //   "Strategic Leadership", "Executive Presence", "Influencing and Negotiation",
           //   "Relationship Management", "Verbal & Non-Verbal Fluency", "Planning & Prioritization",
           //   "Accountability", "Conflict Management"
           // ],
           // functionalCompetencies: [
           //   "Rules of business (AoB/ToB)", "Cabinet note writing", "Submission of briefs, supply of information",
           //   "Policy design/ amendment", "Policy implementation", "Policy monitoring & impact assessment",
           //   "Project Planning", "Project Evaluation & Monitoring", "Creation of M&E Framework",
           //   "Citizen Partnering & Collaboration", "Public Grievance Handling"
           // ],
           // domainCompetencies: [
           //   "Strategic Policy Formulation", "Inter-ministerial & State Government Coordination",
           //   "Senior Leadership Governance & Oversight", "Legislative & Parliamentary Affairs Management",
           //   "National Programme Strategic Direction"
           // ],
           // completionRate: { behavioral: 85, functional: 78, domain: 92 }
         }
        
         
        this.designationData.push(obj)
        }
        this.cdr.detectChanges();
        setTimeout(() => {
         this.scrollToTop()
        }, 1000);
        console.log('this.designationData', this.designationData)
        console.log('this.totalCompetencieObj', this.totalCompetencieObj )
      
       })
    }

    
    
  }
  scrollToTop(): void {
    
    // if (this.pdfContent && this.pdfContent.nativeElement && this.pdfContent.nativeElement.scrollTop !== undefined) {
    //   this.pdfContent.nativeElement.scrollTop = 0;
    // } else {
    //   window.scrollTo({ top: 0, behavior: 'smooth' });
    // }
    // const dialogContainer = document.querySelector('mat-dialog-container');
    // if (dialogContainer) {
    //   dialogContainer.scrollTop = 0;
    // }
  }

  downloadPDF() {
    this.loading = true;
  //   const element = this.pdfContent.nativeElement;

  // // Wait for images to load
  // const images = element.querySelectorAll('img');
  // const promises = Array.from(images).map((img: HTMLImageElement) => {
  //   if (img.complete) return Promise.resolve();
  //   return new Promise(resolve => img.onload = resolve);
  // });

  // Promise.all(promises).then(() => {
  //   const options = {
  //     margin: 0.5,
  //     filename: 'Final CBP Plan.pdf',
  //     image: { type: 'jpeg', quality: 0.98 },
  //     html2canvas: {
  //       scale: 2,
  //       useCORS: true,
  //       scrollY: 0,
  //     },
  //     jsPDF: {
  //       unit: 'in',
  //       format: 'a4',
  //       orientation: 'portrait'
  //     },
  //     pagebreak: {
  //       mode: ['css', 'legacy', 'avoid-all']
  //     }
  //   };

  //   html2pdf().from(element).set(options).save();
  // });
  //const element = this.pdfContent.nativeElement;

  this.loading = true;
  const element = this.pdfContent.nativeElement;
  
  html2canvas(element, {
    scale: 1.5,
    useCORS: true,
    logging: true,
  }).then((canvas) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
  
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
  
    const pageHeightPx = Math.floor((pdfHeight * imgWidth) / pdfWidth); // page height in canvas pixels
    let position = 0;
  
    const totalPages = Math.ceil(imgHeight / pageHeightPx);
  
    for (let page = 0; page < totalPages; page++) {
      const canvasPage = document.createElement('canvas');
      canvasPage.width = imgWidth;
      canvasPage.height = pageHeightPx;
  
      const context = canvasPage.getContext('2d');
      if (context) {
        context.drawImage(
          canvas,
          0, page * pageHeightPx,
          imgWidth, pageHeightPx,
          0, 0,
          imgWidth, pageHeightPx
        );
      }
  
      const imgData = canvasPage.toDataURL('image/png');
      if (page > 0) pdf.addPage();
      pdf.addImage(
        imgData,
        'PNG',
        0,
        0,
        pdfWidth,
        pdfHeight
      );
    }
  
    pdf.save('Final CBP.pdf');
    this.loading = false;
  }).catch((error) => {
    console.error('PDF generation error:', error);
    this.loading = false;
  });
  

}
}
