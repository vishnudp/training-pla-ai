import { Component, ChangeDetectorRef, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
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
    public sharedService: SharedService,
    private snackBar: MatSnackBar
  ) {
    this.getMappingData()
  }
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  loading = false
  designationData: any = []
  totalCompetencieObj = { total: 0, behavioral: 0, functional: 0, domain: 0 }
  pdfTrigger = false
  jsonData = []
  @ViewChild('dialogContent') dialogContent!: ElementRef;
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
    console.log('this.data', this.data)
    this.jsonData = this.data
    this.cdr.detectChanges();

    setTimeout(() => {
      this.scrollToTop();
    });

    if (this.dialogContent) {
      setTimeout(() => {
        this.dialogContent.nativeElement.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 500)

    }
  }

  getMappingData() {

    console.log('haredService?.cbpPlanFinalObj', this.sharedService?.cbpPlanFinalObj)
    if (this.sharedService?.cbpPlanFinalObj.ministry.sbOrgType === 'ministry') {
      this.loading = true
      let state_center_id = this.sharedService?.cbpPlanFinalObj.ministry.identifier
      if(this.sharedService?.cbpPlanFinalObj.departments) {
        let department_id = this.sharedService?.cbpPlanFinalObj.departments
        this.sharedService.getRoleMappingByStateCenterAndDepartment(state_center_id, department_id).subscribe({
          next: (res) => {
            this.loading = false
            console.log('res', res)
            let behavioralCompetencies = []
            let functionalCompetencies = []
            let domainCompetencies = []
            for (let i = 0; i < res.length; i++) {
              behavioralCompetencies = []
              functionalCompetencies = []
              domainCompetencies = []
              let competenciesObj = { total: 0, behavioral: 0, functional: 0, domain: 0 }
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
              let obj: any = {
                designation: res[i].designation_name,
                wing: res[i].wing_division_section,
                updated: res[i].updated_at,
                rolesResponsibilities: res[i].role_responsibilities,
                activities: res[i].activities,
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
            console.log('this.totalCompetencieObj', this.totalCompetencieObj)
          },
          error: (error) => {
            this.loading = false
            this.snackBar.open(error?.error?.detail, 'X', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        });
      } else {
        this.sharedService.getRoleMappingByStateCenter(state_center_id).subscribe({
          next: (res) => {
            this.loading = false
            console.log('res', res)
            let behavioralCompetencies = []
            let functionalCompetencies = []
            let domainCompetencies = []
            for (let i = 0; i < res.length; i++) {
              behavioralCompetencies = []
              functionalCompetencies = []
              domainCompetencies = []
              let competenciesObj = { total: 0, behavioral: 0, functional: 0, domain: 0 }
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
              let obj: any = {
                designation: res[i].designation_name,
                wing: res[i].wing_division_section,
                updated: res[i].updated_at,
                rolesResponsibilities: res[i].role_responsibilities,
                activities: res[i].activities,
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
            console.log('this.totalCompetencieObj', this.totalCompetencieObj)
            this.cdr.detectChanges();
            setTimeout(() => {
              this.scrollToTop()
            }, 1000);
  
          },
  
          error: (error) => {
            this.loading = false
            this.snackBar.open(error?.error?.detail, 'X', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        });
      }
     

      
    }
    if (this.sharedService?.cbpPlanFinalObj.ministry.sbOrgType === 'state') {
      this.loading = true
      console.log('this.sharedService?.cbpPlanFinalObj', this.sharedService?.cbpPlanFinalObj)
      let state_center_id = this.sharedService?.cbpPlanFinalObj.ministry.identifier
      let department_id = this.sharedService?.cbpPlanFinalObj.departments
      // this.sharedService.getRoleMappingByStateCenterAndDepartment(state_center_id, department_id).subscribe((res)=>{
      //   console.log('res', res)
      //   let behavioralCompetencies =[]
      //   let functionalCompetencies =[]
      //   let domainCompetencies =[]
      //   for(let i=0; i<res.length;i++) {
      //    behavioralCompetencies = []
      //    functionalCompetencies =[]
      //    domainCompetencies =[]
      //    let competenciesObj = {total:0, behavioral:0, functional:0, domain:0}
      //   res[i].competencies.forEach(c => {
      //    competenciesObj.total++;
      //    this.totalCompetencieObj.total++
      //     if (c.type.toLowerCase() === 'behavioral') { 

      //      behavioralCompetencies.push(`${c.theme} - ${c.sub_theme}`)
      //      competenciesObj.behavioral++;
      //      this.totalCompetencieObj.behavioral++
      //     }
      //     if (c.type.toLowerCase() === 'functional') {
      //      functionalCompetencies.push(`${c.theme} - ${c.sub_theme}`)
      //      competenciesObj.functional++;
      //      this.totalCompetencieObj.functional++
      //     }
      //     if (c.type.toLowerCase() === 'domain') { 
      //      domainCompetencies.push(`${c.theme} - ${c.sub_theme}`)
      //      competenciesObj.domain++;
      //      this.totalCompetencieObj.domain++

      //     }
      //   });
      //    let obj:any =  {
      //      designation: res[i].designation_name,
      //      wing: res[i].wing_division_section,
      //      updated: res[i].updated_at,
      //      rolesResponsibilities: res[i].role_responsibilities,
      //      activities:res[i].activities,
      //      competenciesObj: competenciesObj,
      //      behavioralCompetencies: behavioralCompetencies,
      //      functionalCompetencies: functionalCompetencies,
      //      domainCompetencies: domainCompetencies
      //      // behavioralCompetencies: [
      //      //   "Strategic Leadership", "Executive Presence", "Influencing and Negotiation",
      //      //   "Relationship Management", "Verbal & Non-Verbal Fluency", "Planning & Prioritization",
      //      //   "Accountability", "Conflict Management"
      //      // ],
      //      // functionalCompetencies: [
      //      //   "Rules of business (AoB/ToB)", "Cabinet note writing", "Submission of briefs, supply of information",
      //      //   "Policy design/ amendment", "Policy implementation", "Policy monitoring & impact assessment",
      //      //   "Project Planning", "Project Evaluation & Monitoring", "Creation of M&E Framework",
      //      //   "Citizen Partnering & Collaboration", "Public Grievance Handling"
      //      // ],
      //      // domainCompetencies: [
      //      //   "Strategic Policy Formulation", "Inter-ministerial & State Government Coordination",
      //      //   "Senior Leadership Governance & Oversight", "Legislative & Parliamentary Affairs Management",
      //      //   "National Programme Strategic Direction"
      //      // ],
      //      // completionRate: { behavioral: 85, functional: 78, domain: 92 }
      //    }


      //   this.designationData.push(obj)
      //   }
      //   this.cdr.detectChanges();
      //   setTimeout(() => {
      //    this.scrollToTop()
      //   }, 1000);
      //   console.log('this.designationData', this.designationData)
      //   console.log('this.totalCompetencieObj', this.totalCompetencieObj )

      //  })
      this.sharedService.getRoleMappingByStateCenterAndDepartment(state_center_id, department_id).subscribe({
        next: (res) => {
          this.loading = false
          console.log('res', res)
          let behavioralCompetencies = []
          let functionalCompetencies = []
          let domainCompetencies = []
          for (let i = 0; i < res.length; i++) {
            behavioralCompetencies = []
            functionalCompetencies = []
            domainCompetencies = []
            let competenciesObj = { total: 0, behavioral: 0, functional: 0, domain: 0 }
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
            let obj: any = {
              designation: res[i].designation_name,
              wing: res[i].wing_division_section,
              updated: res[i].updated_at,
              rolesResponsibilities: res[i].role_responsibilities,
              activities: res[i].activities,
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
          console.log('this.totalCompetencieObj', this.totalCompetencieObj)
        },
        error: (error) => {
          this.loading = false
          this.snackBar.open(error?.error?.detail, 'X', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
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
    this.pdfTrigger = true
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
      scale: 1.25,
      useCORS: true,
      scrollY: 0,
      logging: true,
    }).then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Margins
      const marginLeft = 5;
      const marginTop = 15;
      const marginRight = 5;
      const marginBottom = 15;

      const usableWidth = pdfWidth - marginLeft - marginRight;
      const usableHeight = pdfHeight - marginTop - marginBottom;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const ratio = canvasWidth / usableWidth;
      const pageHeightPx = usableHeight * ratio;

      const totalPages = Math.ceil(canvasHeight / pageHeightPx);

      for (let page = 0; page < totalPages; page++) {
        const canvasPage = document.createElement('canvas');
        canvasPage.width = canvasWidth;
        canvasPage.height = Math.min(pageHeightPx, canvasHeight - page * pageHeightPx);

        const ctx = canvasPage.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvasPage.width, canvasPage.height);

          ctx.drawImage(
            canvas,
            0, page * pageHeightPx,
            canvasWidth, canvasPage.height,
            0, 0,
            canvasWidth, canvasPage.height
          );
        }

        const imgData = canvasPage.toDataURL('image/png',1);
        if (page > 0) pdf.addPage();
        const imgHeightMM = canvasPage.height / ratio;
        pdf.addImage(imgData, 'PNG', marginLeft, marginTop, usableWidth, imgHeightMM);
      }

      pdf.save('Final_CBP.pdf');
      this.loading = false;
    }).catch((error) => {
      console.error('PDF generation error:', error);
      this.loading = false;
    });







  }

  downloadPDFNew() {
    this.loading = true
    const element = this.pdfContent.nativeElement;

    const opt = {
      margin:       [10, 5, 5, 10], // top, left, bottom, right in mm
      filename:     'CBP_Plan.pdf',
      image:        { type: 'jpeg', quality: 0.85 },
      html2canvas:  { scale: 1.5, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' },
      pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] } // avoid cutting text
    };

    html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      // PDF download finished
      this.loading = false;
    })
    .catch(() => {
      // Handle errors and stop loading
      this.loading = false;
    });

    setTimeout(() => {
      this.loading = false;
    }, 2000);


  
  }

  
    
  generateExcel(jsonArray: any[], filename: string = "final.xlsx") {
    console.log('jsonArray', jsonArray)
    if (!jsonArray || jsonArray.length === 0) return;

    // -------- MAIN HEADER FROM FIRST OBJECT ---------
    const firstObj = jsonArray[0];
    let title = firstObj.state_center_name || "";
    if (firstObj.department_name) title += " / " + firstObj.department_name;

    // -------- COLUMN HEADERS ---------
    const headers = [
      "Designation",
      "Role & Responsibilities",
      "Activities",
      "Behavioral Competencies",
      "Functional Competencies",
      "Domain Competencies"
    ];

    // -------- DATA ROWS ---------
    const dataRows = jsonArray.map(json => ({
      "Designation": `${json.designation_name} : Wing/Division - ${json.wing_division_section}`,
      "Role & Responsibilities": (json.role_responsibilities || [])
        .map((v: string, i: number) => `${i + 1}. ${v}`).join("\n\n"),
      "Activities": (json.activities || [])
        .map((v: string, i: number) => `${i + 1}. ${v}`).join("\n\n"),
      "Behavioral Competencies": (json.competencies || [])
        .filter((c: any) => c.type === "Behavioral")
        .map((c: any, i: number) => `${i + 1}. ${c.theme} - ${c.sub_theme}`).join("\n\n"),
      "Functional Competencies": (json.competencies || [])
        .filter((c: any) => c.type === "Functional")
        .map((c: any, i: number) => `${i + 1}. ${c.theme} - ${c.sub_theme}`).join("\n\n"),
      "Domain Competencies": (json.competencies || [])
        .filter((c: any) => c.type === "Domain")
        .map((c: any, i: number) => `${i + 1}. ${c.theme} - ${c.sub_theme}`).join("\n\n"),
    }));

    // -------- CREATE WORKSHEET ---------
    const ws = XLSX.utils.aoa_to_sheet([]);

    // Main header (merged)
    XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: "A1" });
    ws['!merges'] = [{
      s: { r: 0, c: 0 },
      e: { r: 0, c: headers.length - 1 }
    }];

    // Column headers at row 2
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A2" });

    // Style column headers
    headers.forEach((header, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 1, c: index });
      if (ws[cellAddress]) {
        ws[cellAddress].s = {
          font: { bold: true },
          fill: { patternType: "solid", fgColor: { rgb: "FFFF00" } },
          alignment: { horizontal: "center", vertical: "center", wrapText: true }
        };
      }
    });

    // Insert data rows starting from row 3
    XLSX.utils.sheet_add_json(ws, dataRows, { origin: "A3", skipHeader: true });

    // Auto column widths based on longest line in each column
    const colWidths = headers.map((header, idx) => {
      const maxLen = Math.max(
        header.length,
        ...dataRows.map(row => (row[header] || "").split("\n").reduce((a, b) => Math.max(a, b.length), 0))
      );
      return { wch: Math.min(Math.max(maxLen + 5, 20), 80) }; // min 20, max 80
    });
    ws['!cols'] = colWidths;

    // Wrap text in data rows
    dataRows.forEach((row, rowIndex) => {
      headers.forEach((header, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 2, c: colIndex });
        if (ws[cellAddress]) {
          ws[cellAddress].s = { alignment: { wrapText: true, vertical: "top" } };
        }
      });
    });

    // Style main header
    if (ws["A1"]) {
      ws["A1"].s = {
        font: { bold: true, sz: 16 },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }

    // -------- CREATE WORKBOOK ---------
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Export Excel
    XLSX.writeFile(wb, filename);
  }

      
    

    downloadCSV() {
      let fileName = ''
      if(!this.sharedService?.cbpPlanFinalObj.departments) {
        fileName = `CBP_Report_${this.sharedService?.cbpPlanFinalObj.ministry.identifier}_${this.sharedService?.cbpPlanFinalObj.departments}.xlsx`
      } else {
        fileName = `CBP_Report_${this.sharedService?.cbpPlanFinalObj.ministry.identifier}.xlsx`
      }
      this.generateExcel(this.jsonData, fileName );
    }

    downloadPdfFromBE() {
      this.loading = true
    //  this.sharedService.downloadPdf(this.sharedService?.cbpPlanFinalObj.ministry.identifier)
      if(!this.sharedService?.cbpPlanFinalObj.departments) {
        this.sharedService.downloadPdf(this.sharedService?.cbpPlanFinalObj.ministry.identifier)  
      } else {
        this.sharedService.downloadPdfForDepartment(this.sharedService?.cbpPlanFinalObj.ministry.identifier, this.sharedService?.cbpPlanFinalObj.departments)  
      }
      
      setTimeout(()=>{
        this.loading = false
      },5000)
    }
  
  }

