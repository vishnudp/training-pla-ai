import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ABOUT_US, CONFERENCE_DATA, DASHBOARD_ANALYTICS_LIST, FEATURES_COURSES, FOOTER_DETAILS, FOOTER_PROVIDER, HEADER_DATA, HOW_TO_CARD_LIST, IGON_VISION_DETAILS, INFOCUS_CARD, MOBILE_APP_DOWNLOADS_DETAILS, MOBILE_VIEW_APP_DOWNLOADS_DETAILS, NAV_FOOTER_DETAILS, NEWSROOM_COURSES, ORGANISATION_PARTNERS, PHOTO_GALLARY, QUICK_WALKTHROUGH_DETAILS, REGISTER_DETAILS, SOLUTIONS_SPACE, STAT_ARR, TESTIMONIALS, TOP_PROVIDERS, VIDEO_CONF, WHAT_IS_CARD } from 'src/app/modules/shared/constant/app.constant';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-public-home',
  templateUrl: './public-home.component.html',
  styleUrls: ['./public-home.component.scss']
})
export class PublicHomeComponent implements OnInit {

  configDetails: any;
  headerData = HEADER_DATA;
  slidesList = [];
  dashboardAnalyticsList = DASHBOARD_ANALYTICS_LIST;
  featuredCourses = FEATURES_COURSES;
  testimonials = TESTIMONIALS;
  newsroomCourses = NEWSROOM_COURSES;
  topProviders: any = TOP_PROVIDERS;
  aboutUs: any = ABOUT_US;
  videoConf: any = VIDEO_CONF;
  photosGallery: any = PHOTO_GALLARY;
  igonVisionDetails = IGON_VISION_DETAILS;
  conferanceData = CONFERENCE_DATA;
  registerDetails = REGISTER_DETAILS;
  solutionSpace = SOLUTIONS_SPACE;
  quickWalkThroughDetails = QUICK_WALKTHROUGH_DETAILS;
  mobileAppDownloadDetails = MOBILE_APP_DOWNLOADS_DETAILS;
  mobileviewAppDownloadDetails = MOBILE_VIEW_APP_DOWNLOADS_DETAILS;
  navFooterDetails = NAV_FOOTER_DETAILS;
  footerDetails = FOOTER_DETAILS;
  howtoCardList: any = HOW_TO_CARD_LIST;
  infocusCard: any = [];
  whatisCard: any = WHAT_IS_CARD;
  footerProvider: any[] = FOOTER_PROVIDER;
  statArr: any[] = STAT_ARR;
  organizationPartners = ORGANISATION_PARTNERS;
  displaySurvey: boolean= false
  title = 'multilanguageapp';

  isFeaturedCoursesLoaded: boolean = false;
  isvideoGallaryLoaded: boolean = false;
  courseListLoaded:boolean = false

  sectionList: any;
  // lookerProDesktopUrl: any
  // lookerProMobileUrl: any
  isMobile = false

  constructor(
    private sharedSvc: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    public httpClient: HttpClient,
    public domSanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.initialization();
    localStorage.setItem('selectedAppLanguage', 'English')
    setTimeout(() => {
      this.route.fragment.subscribe((fragment: string) => {
        if (fragment) {
          this.scrollToId(fragment);
        }
      })
    }, 700)
    if(window.innerWidth < 1024) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }

  }

  initialization() {
    this.assignSectionClasses();
    this.getConfigDetails();
    this.videoPlaylist();
    this.getClientList();
  }

  getConfigDetails() {
    if (this.sharedSvc.configDetails) {
      this.configDetails = this.sharedSvc.configDetails;
      this.displaySurvey = this.configDetails && this.configDetails.surveyPopUp && this.configDetails.surveyPopUp.active || false
      this.getCourses()
      this.fromateDashboardAnalyticsList()
      this.conferanceData['meetLink'] = this.configDetails.meetLink
      // if(this.configDetails && this.configDetails.lookerProDesktopUrl) {
      //   this.lookerProDesktopUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.configDetails.lookerProDesktopUrl)
      // }
      // if(this.configDetails && this.configDetails.lookerProMobileUrl) {
      //   this.lookerProMobileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.configDetails.lookerProMobileUrl)
      // }
      

    } else {
      this.sharedSvc.getConfigDetails().subscribe((response: any) => {
        if (response) {
          this.configDetails = response;
          this.displaySurvey = this.configDetails && this.configDetails.surveyPopup && this.configDetails.surveyPopup.active || false
          this.getCourses()
          this.fromateDashboardAnalyticsList()
          this.conferanceData['meetLink'] = this.configDetails.meetLink
        }
      })
    }
    if (this.statArr.length) {
      this.statArr[0].count = this.configDetails.karmayogiOnboarded;
      this.statArr[1].count = this.configDetails.courses;
      this.statArr[2].count = this.configDetails.courseProgramCompletionCount;
      this.statArr[3].count = this.configDetails.monthyActiveUsers;
      this.statArr[4].count = this.configDetails.courseProgramCompletionYesterdayCount;
    }

  }

  getCourses() {
    this.sharedSvc.getcourses()
      .subscribe((response: any) => {
        const findingString = 'do_11401380287347916812_1710669334743_14.jpg'
        response.gallary = response.gallary.filter(item => !item.cloudStorageKey.includes(findingString))
        this.featuredCourses.dataList = response.course;
        this.photosGallery.galleryList = response.gallary;
        this.newsroomCourses.dataList = response.newsroom.length ? response.newsroom : NEWSROOM_COURSES.localDataList;
        this.testimonials.dataList = response.testimonils;
        this.isFeaturedCoursesLoaded = false;
        this.courseListLoaded = true;

      })
  }

  fromateDashboardAnalyticsList() {
    if (this.configDetails) {
      this.dashboardAnalyticsList.forEach(dashboardAnlytics => {
        dashboardAnlytics.analyticsList.forEach(analytics => {
          analytics.count = this.configDetails[analytics.id]
        })
      })

      this.dashboardAnalyticsList[0].analyticsList[0].count = this.configDetails.karmayogiOnboarded
    }
  }

  getLinks(url: string) {
    return this.sharedSvc.baseUrl + url
  }

  videoPlaylist() {
    this.infocusCard[0] = {
      videoCategory: 'course_intro',
      header: {
        headerText: `Video Gallery`,
        type: `video-gallery`
      },
      dataList: []
    }
    this.infocusCard[1] = {
      videoCategory: 'karmayogi_talks',
      header: {
        headerText: `Video Gallery`,
        type: `video-gallery`
      },
      dataList: []
    }
    this.infocusCard[2] = {
      videoCategory: 'pm_talks',
      header: {
        headerText: `Video Gallery`,
        type: `video-gallery`
      },
      dataList: []
    }
  }

  getClientList() {
    this.sharedSvc.getClientList().subscribe((list: { clientList: string }) => {
      this.topProviders['topProvidersList'] = list.clientList;
    })
  }

  assignSectionClasses() {
    this.sectionList = {
      headerSection : {
        visible: true
      },
      featuredCoursesSection : {
        visible: true
      },
      infocusCardSection : {
        visible: true
      },
      KarmayogiHubSection: {
        visible: true
      },
      whatisCardSection : {
        visible: true
      },
      socialHubSection : {
        visible: false
      },
      newsroomCoursesSection : {
        visible: false
      },
      photosGallerySection : {
        visible: false
      },
      testimonialsSection: {
        visible: false
      },
      topProvidersSection : {
        visible: false
      },
      wallOfFameSection: {
        visible: false
      },
      organisationsPartnersSection : {
        visible: false
      },
      aboutUsSection : {
        visible: false
      },
      videoConfSection : {
        visible: false
      },
      mobileAppDownloadDetailsSection : {
        visible: false
      },
      mobileviewAppDownloadDetailsSection : {
        visible: false
      },
      footerProviderSection : {
        visible: false
      },
      navFooterDetailsSection : {
        visible: false
      }
    }
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler() {
    const sectionsList = Object.keys(this.sectionList)
    if (sectionsList.length > 0) {
      this.checkSectionVisibility(sectionsList)
    } 

  }

  checkSectionVisibility(classNames: string[]) {
    let isVisible = false
    for (const section of classNames) {
      if(!this.sectionList[section].visible) {
        const tect = document.getElementsByClassName(section)[0].getBoundingClientRect()
        const eleTop = tect.top
        const eleBottom = tect.bottom
        isVisible = (eleTop >= 0) && (eleBottom <= window.innerHeight + 10)
        this.sectionList[section]['visible'] = isVisible
        break;
      }
    }
  }

  scrollToId(id: string) {
    let selectedSection = ''
    switch (id) {
      case 'newsroom':
        selectedSection = 'newsroomCoursesSection';
        break;
      case 'about_us':
        selectedSection = 'aboutUsSection';
        break;
      case 'contact_us':
        selectedSection = 'videoConfSection';
        break;
    }

    const sectionsList = Object.keys(this.sectionList)
    if (selectedSection && sectionsList) {
      for (const section of sectionsList) {
        this.sectionList[section]['visible'] = true
        if (selectedSection === section) {
          setTimeout(() => {
            this.router.navigate([''], { fragment: id })
          }, 500)
          break;
        }
      }
    }
  }

  // imageloaded(icon) {
  //   icon['imageLoaded'] = true
  // }

}
