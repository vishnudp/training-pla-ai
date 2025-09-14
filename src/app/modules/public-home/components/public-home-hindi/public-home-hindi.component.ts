import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/modules/shared/services/shared.service';

@Component({
  selector: 'app-public-home-hindi',
  templateUrl: './public-home-hindi.component.html',
  styleUrls: ['./public-home-hindi.component.scss']
})
export class PublicHomeHindiComponent implements OnInit {

  configDetails: any

  headerData = {
    welcome: {
      welcomeText: `कर्मयोगी भारत में आपका स्वागत है`,
      imageUrl: `./assets/img/flag.svg`,
    },
    karmayogiBtn: {
      text: `कर्मयोगी कॉर्नर`,
      link: `/latest-updates-hi`,
      display: true
    },
    donloadBtn: {
      text: `ऐप डाउनलोड करें`,
      link: `#igotMobileapp`,
      display: true
    },
    btns: [
      {
        text: `English`,
        link: ``,
        type: `lowerCase`,
        language: `English`
      }
    ],
    navHeader: {
      karmayogiBharath: {
        imgSrc: `/assets/img/karmayogiLogo.svg`,
        link: `/hindi`
      },
      navButtons: [
        {
          text: `होम`,
          link: `.`,
          fragment: 'home',
        },
        {
          text: `डैशबोर्ड`,
          link: `.`,
          fragment: 'dashboardAnalytics',
        },
        {
          text: `कॉर्स`,
          link: `.`,
          fragment: 'igotcourses',
        },
        {
          text: `नोडल`,
          link: `/mdoList`,
          fragment: 'mdoUserList',
        },
      ],
      loginBtn: {
        text: `लॉगइन करें`,
        link: `protected/v8/resource`
      },
      registerBtn: {
        text: `रजिस्टर करें`,
        link: `public/signup`,
      }
    },
  }

  slidesList = [
    {
      imgSrc: `./assets/img/sliderImg1-hindi.jpg`
    },{
      imgSrc: `./assets/img/img2-hindi.jpg`
    },{
      imgSrc: `./assets/img/Hindi.png`
    }
  ]

  dashboardAnalyticsList = [
    {
      dashboaredHeader: `उपयोगकर्ताओं की संख्या`,
      analyticsList: [
        {
          imgSrc: `./assets/img/learnsGraph.svg`,
          count: `0`,
          description: `पंजीकृत कर्मयोगी`,
          alt: `learns record`,
          id: `karmayogiOnboarded`
        },{
          imgSrc: `./assets/img/learnsGraph.svg`,
          count: `0`,
          description: `पंजीकृत एमडीओ`,
          alt: `learns record`,
          id: `registeredMdo`
        },
      ]
    },
    {
      dashboaredHeader: `उपलब्ध विषय-सामग्री`,
      analyticsList: [
        {
          imgSrc: `./assets/img/coursesGraph.svg`,
          count: `0`,
          description: `कोर्स`,
          alt: `Courses record`,
          id: `courses`
        },{
          imgSrc: `./assets/img/contentGraph.svg`,
          count: `0`,
          description: `उपलब्ध सामग्री (घंटे)`,
          alt: `Content record`,
          id: `availableContent`
        },
      ]
    }
  ]

  featuredCourses = {
    header: {
      headerText: `विशेष प्रदर्शित कोर्स`,
      type: ``
    },
    dataList: [
      // {
      //   posterImage: `./assets/img/officeprocedure.jpeg`,
      //   name: `Office Procedure`,
      //   description: `Office Procedure`,
      //   identifier: `do_1135948534007070721153`,
      //   alt: `Office Procedure`,
      //   duration: `2h 17m`,
      // }, {
      //   posterImage: `./assets/img/officeprocedure.jpeg`,
      //   name: `Office Procedure`,
      //   description: `Office Procedure`,
      //   identifier: `do_1135948534007070721153`,
      //   alt: `Office Procedure`,
      //   duration: `2h 17m`,
      // }, {
      //   posterImage: `./assets/img/officeprocedure.jpeg`,
      //   name: `Office Procedure`,
      //   description: `Office Procedure`,
      //   identifier: `do_1135948534007070721153`,
      //   alt: `Office Procedure`,
      //   duration: `2h 17m`,
      // }, {
      //   posterImage: `./assets/img/officeprocedure.jpeg`,
      //   name: `Office Procedure`,
      //   description: `Office Procedure`,
      //   identifier: `do_1135948534007070721153`,
      //   alt: `Office Procedure`,
      //   duration: `2h 17m`,
      // }, {
      //   posterImage: `./assets/img/officeprocedure.jpeg`,
      //   name: `Office Procedure`,
      //   description: `Office Procedure`,
      //   identifier: `do_1135948534007070721153`,
      //   alt: `Office Procedure`,
      //   duration: `2h 17m`,
      // },
    ]
  }

  conferanceData = {
    title: 'अब हम वीडियो कॉन्फ्रेंस पर भी उपलब्ध हैं',
    description: 'किसी भी आवश्यक सहायता के लिए',
    workdays: 'सोमवार से शुक्रवार',
    timings: 'सुबह 9:00 बजे से शाम 5:00 बजे तक',
    joinNow:'शामिल हों'
  }

  igonVisionDetails = {
    vision: {
      imgUrl: `./assets/img/visionImg-hindi.svg`,
      alt: `How does the platform enable you to become the best version of yourself?`,
    },
    videos: [
      {
        poster: `./assets/img/video1.png`,
        videoLink: `./assets/img/Sanjeev-final.mp4`,
        line1: `एक `,
        line2: `अनुभवी`,
        line3: ` सिविल सेवक`,
      },
      {
        poster: `./assets/img/video2.png`,
        videoLink: `./assets/img/Shilpa-final.mp4`,
        line1: `एक `,
        line2: `नव`,
        line3: ` नियुक्त सिविल सेवक`,
      },
    ],

  }

  registerDetails = {
    lineOne: `सीखने की`,
    lineTwo: `दिशा में`,
    lineThree: ` पहला कदम बढ़ाएँ`,
    registerBtn: {
      text: `अभी रजिस्टर करें`,
      link: `public/signup`
    }
  }

  solutionSpace = {
    solutionSpaceHeader: {
      lineOne: `सभी सरकारी महकमों के लिए`,
      lineTwo: `समाधान स्थान`,
    },
    solutionSpacesList: [
      {
        name: `सीखने का केंद्र`,
        description: `प्रभावशाली और आकर्षक शिक्षण सामग्री का उपयोग करके कहीं भी, कभी भी सीखें और अपनी दक्षता में अंतराल को भरें`,
        imgSrc: `./assets/img/school.svg`,
      }, {
        name: `चर्चा केंद्र`,
        description: `देश भर के साथियों, सहकर्मियों,सिविल सेवकों और विशेषज्ञों के साथ चर्चा करें और सीखें.`,
        imgSrc: `./assets/img/forum.svg`,
      }, {
        name: `नेटवर्क केंद्र`,
        description: `देश भर के सिविल सेवकों से जुड़ें । सरकारी महकमों में अपना नेटवर्क बढ़ाएँ.`,
        imgSrc: `./assets/img/group.svg`,
      }, {
        name: `दक्षता केंद्र`,
        description: `अपनी दक्षता आवश्यकताओं और दक्षता में अंतराल को पहचानें, ताकि आप सही दिशा में तेजी से बढ़ सकें.`,
        imgSrc: `./assets/img/extension.svg`,
      }, {
        name: `करियर केंद्र`,
        description: `देश भर में करियर के अवसर खोजें और अपनी विशेषज्ञता को साझा करें.`,
        imgSrc: `./assets/img/work.svg`,
      }, {
        name: `आयोजन केंद्र`,
        description: `एक साथ इंटरैक्टिव अनुभवात्मक और साथ साथ सीखने की प्रक्रिया को सक्षम करें।`,
        imgSrc: `./assets/img/event.svg`,
      },
    ]
  }

  quickWalkThroughDetails = {
    videoLink: `./assets/img/KarmayogiBharatWalkthroughNew.mp4`,
    lineOne: `कर्मयोगी`,
    lineTwo: ` भारत`,
    lineThree: ` पोर्टल का `,
    lineFour: ` त्वरित`,
    lineFive: `पूर्वाभ्यास`,
  }

  mobileAppDownloadDetails = {
    lineOne: `डाउनलोड करें`,
    lineTwo: ` आईगोट कर्मयोगी`,
    lineThree: ` मोबाइल एप`,
    description: `आजीवन सीखने के अनुभव को सक्षम करना जारी रखें`,
    scanners: [
      {
        link: `https://play.google.com/store/apps/details?id=com.igot.karmayogibharat&pli=1`,
        imgSrc: `./assets/img/Google_Play-Badge-Logo.wine.png`,
        scannerSrc: `./assets/img/scan/qrcode.svg`,
        text: `ऐप डाउनलोड करने के लिए स्कैन करें`,
      },
      {
        link: `https://apps.apple.com/in/app/igot-karmayogi/id6443949491`,
        imgSrc: `./assets/img/download-appstore.png`,
        scannerSrc: `./assets/img/scan/iOS_qrcode.svg`,
        text: `ऐप डाउनलोड करने के लिए स्कैन करें`,
      },
    ],
    mockupImgSrc: `./assets/img/mobile-latest.png`
  }

  mobileviewAppDownloadDetails = {
    googleStore: {
      imgSrc: `./assets/img/Google_Play-Badge-Logo.wine.png`,
      link: `https://play.google.com/store/apps/details?id=com.igot.karmayogibharat&pli=1`,
    },
    appleStore: {
      imgSrc: `./assets/img/download-appstore.png`,
      link: `https://apps.apple.com/in/app/igot-karmayogi/id6443949491`,
    },
    lineOne: `डाउनलोड करें आईगोट कर्मयोगी  `,
    lineTwo: `मोबाइल एप`
  }

  navFooterDetails = {
    navLinks: [
      [
        {
          href: `dashboardAnalytics`,
          target: `_self`,
          name: `डैशबोर्ड`,
          router:'/hindi'
        },
        {
          href: `igotcourses`,
          target: `_self`,
          name: `कोर्स`,
          router:'/hindi'
        },
        {
          href: `public/faq`,
          target: `_self`,
          application: 'diff',
          name: `अधिकतर पूछे जाने वाले प्रश्न`
        }
      ],
      [
        {
          href: `https://karmayogibharat.gov.in/`,
          target: `_blank`,
          name: `मीडिया`
        },
        {
          href: `https://frac-dictionary.igotkarmayogi.gov.in/`,
          target: `_self`,
          application: 'diff',
          name: `भूमिका, गतिविधि और दक्षता (FRAC) शब्दकोष`
        },
        {
          href: `public/contact`,
          target: `_self`,
          application: 'diff',
          name: `संपर्क करें`
        },
      ],
      [
        {
          href: `https://karmayogibharat.gov.in/programme.php`,
          target: `_blank`,
          name: `मिशन कर्मयोगी`
        },
        {
          href: `https://cbc.gov.in/`,
          target: `_blank`,
          name: `क्षमता निर्माण आयोग`
        },
        {
          href: `https://dopt.gov.in/`,
          target: `_blank`,
          name: `कार्मिक और प्रशिक्षण विभाग`
        },
      ]
    ],
    followUs: 'हमें फॉलो करें'
  }

  footerDetails = {
    copyRights: 'कॉपीराइट © वेबसाइट कर्मयोगी भारत द्वारा प्रबंधित । सर्वाधिकार सुरक्षित '
  }

  constructor(
    private sharedSvc: SharedService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.initialization();
    setTimeout(()=>{
      this.route.fragment.subscribe((fragment: string) => {
        if (fragment) {
          this.router.navigate([], { fragment: fragment });
          let el = document.getElementById(fragment);
          el.scrollTop = el.scrollHeight;
        }
      })
    },700)
  }

  initialization() {
    this.getConfigDetails()
  }

  getConfigDetails() {
    if (this.sharedSvc.configDetails) {
      this.configDetails = this.sharedSvc.configDetails;
      this.getCourses()
      this.fromateDashboardAnalyticsList()
      this.formateNavLinks()
      this.conferanceData['meetLink'] = this.configDetails.meetLink
    } else {
      this.sharedSvc.getConfigDetails().subscribe((response: any) => {
        if (response) {
          this.configDetails = response;
          this.getCourses()
          this.fromateDashboardAnalyticsList()
          this.formateNavLinks()
          this.conferanceData['meetLink'] = this.configDetails.meetLink
        }
      })
    }
   
  }

  getCourses() {
    this.sharedSvc.getcourses()
    .subscribe((response: any) => {
      this.featuredCourses.dataList = response;
      if(this.featuredCourses && this.featuredCourses.dataList && this.featuredCourses.dataList.length) {
        this.featuredCourses.dataList.forEach(element => {
          if(element.posterImage.includes('https://static.karmayogiprod.nic.in/igotprod')) {
            if(this.configDetails) {
            let arr = element.posterImage.split('igotprod')
             element.posterImage =  this.configDetails.portalURL + 'content-store' + arr[1]
        }
          }
      })
     }
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

  formateNavLinks() {
    this.navFooterDetails.navLinks[0][2].href = this.configDetails.portalURL + this.navFooterDetails.navLinks[0][2].href;
    this.navFooterDetails.navLinks[1][2].href = this.configDetails.portalURL + this.navFooterDetails.navLinks[1][2].href;
  }

}
