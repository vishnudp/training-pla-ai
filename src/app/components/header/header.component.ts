import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/modules/shared/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  selectedValue: string = 'English';
  @Input() headerData: any;
  contentData: any;

  constructor(
    private sharedSvc: SharedService
  ) { }

  bannerInner = {
    header: {
      headerText: `banner-inner`,
      type: `banner-inner`
    },
    dataList: [
      {
        hindiBanner: [
          {
            posterImage: `./assets/img/feb-webinars.svg`,
          },
          {
            posterImage: `./assets/img/banner-e-5.jpeg`,
          },
          {
            posterImage: `./assets/img/banner-h-2.webp`,
          },
          {
            posterImage: `./assets/img/banner-h-1.webp`,
          },
          {
            posterImage: `./assets/img/banner-h-3.webp`,
          },
          {
            posterImage: `./assets/img/Banner3.jpeg`,
          }
        ]
      },
      {
        englishBanner: [
          {
            posterImage: `./assets/img/feb-webinars.svg`,
          },
          {
            posterImage: `./assets/img/banner-e-5.jpeg`,
          },
          {
            posterImage: `./assets/img/banner-e-2.webp`,
          },
          {
            posterImage: `./assets/img/banner-e-1.webp`,
          },
          {
            posterImage: `./assets/img/banner-e-3.webp`,
          },
          {
            posterImage: `./assets/img/Banner3.jpeg`,
          }
        ]
      }
    ]
  }

  ngOnInit() {
  }

  getLinks(url: string) {
    return this.sharedSvc.baseUrl + url
  }

  chnglang(lang) {
    localStorage.setItem("selectedAppLanguage", lang);
  }

}
