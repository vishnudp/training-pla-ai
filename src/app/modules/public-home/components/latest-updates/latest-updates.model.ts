import { FOOTER_DETAILS, HEADER_DATA, NAV_FOOTER_DETAILS } from "src/app/modules/shared/constant/app.constant"

export const staticHiContent = {
  headerData: {
    welcome: {
      welcomeText: `कर्मयोगी भारत में आपका स्वागत है`,
      imageUrl: `./assets/img/flag.svg`,
    },
    karmayogiBtn: {
      text: `कर्मयोगी कॉर्नर`,
      link: `hindi`,
      display: false
    },
    donloadBtn: {
      text: `ऐप डाउनलोड करें`,
      link: `hindi`,
      display: false
    },
    btns: [
      {
        text: `English`,
        link: `/latest-updates`,
        type: `lowerCase`,
        language: `English`,
        params: 'hi'
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
          link: `/hindi`,
          fragment: 'home',
        },
        {
          text: `डैशबोर्ड`,
          link: `/hindi`,
          fragment: 'dashboardAnalytics',
        },
        {
          text: `होम`,
          link: `/hindi`,
          fragment: 'igotcourses',
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
  },
  navFooterDetails: {
    navLinks: [
      [
        {
          href: `dashboardAnalytics`,
          target: `_self`,
          name: `डैशबोर्ड`,
          router: '/hindi'
        },
        {
          href: `igotcourses`,
          target: `_self`,
          name: `कोर्स`,
          router: '/hindi'
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
  },

  footerDetails: {
    copyRights: 'कॉपीराइट © वेबसाइट कर्मयोगी भारत द्वारा प्रबंधित । सर्वाधिकार सुरक्षित '
  },

  latestUpdates: {
    title: "कर्मयोगी कॉर्नर"
  }
}
export const staticEnContent = {
  headerData: HEADER_DATA,
  navFooterDetails: NAV_FOOTER_DETAILS,
  footerDetails: FOOTER_DETAILS,
  latestUpdates: {
    title: "Karmayogi's Corner"
  }
}