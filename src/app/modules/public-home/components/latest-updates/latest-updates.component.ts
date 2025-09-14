import { Component, Input, OnInit } from '@angular/core';
import { staticHiContent, staticEnContent } from './latest-updates.model'
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { KARMAYOGI_CORNER } from 'src/app/modules/shared/constant/app.constant';

@Component({
  selector: 'app-latest-updates',
  templateUrl: './latest-updates.component.html',
  styleUrls: ['./latest-updates.component.scss']
})
export class LatestUpdatesComponent implements OnInit {
  @Input() data : any;
  karmayogiCorner:any = KARMAYOGI_CORNER
  staticContent: any
  configDetails: any
  latestUpdatesLinks: any
  constructor(private sharedSvc: SharedService) {
   
   }

  ngOnInit() {
    let language = localStorage.getItem('selectedAppLanguage')
    this.staticContent = language === 'English'? staticEnContent: staticHiContent
    this.getConfigDetails()
    window.scrollTo(0, 0);

    const isFirefox = /Firefox/.test(navigator.userAgent);
    if(isFirefox){
      document.getElementById('update-section').scrollTop = 0;
    }
    
  }
  changeLang(data: string) {
    this.staticContent = data === 'English'? staticEnContent: staticHiContent
  }

  getConfigDetails() {
    if (this.sharedSvc.configDetails) {
      this.configDetails = this.sharedSvc.configDetails;
      this.getUpdatedDetails()
    } else {
      this.sharedSvc.getConfigDetails().subscribe((response: any) => {
        if (response) {
          this.configDetails = response;
          this.getUpdatedDetails()
        }
      })
    }
  }
  getUpdatedDetails() {
    let language = localStorage.getItem('selectedAppLanguage')
    let updates= this.configDetails.updateData.filter(ele => {
      return ele[language.toLowerCase()]
    })
    this.latestUpdatesLinks  = updates[0][language.toLowerCase()]
   
  }
 
}
