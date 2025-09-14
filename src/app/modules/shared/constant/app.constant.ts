export const HEADER_DATA = {
    welcome: {
        welcomeText: `WELCOME TO KARMAYOGI BHARAT`,
        imageUrl: `./assets/img/flag.svg`,
    },
    karmayogiBtn: {
        text: `Karmayogi's Corner`,
        link: `/latest-updates`,
        display: true
    },
    donloadBtn: {
        text: `Download app`,
        link: `#igotMobileapp`,
        display: true
    },
    btns: [
        {
            text: `हिंदी`,
            link: `hindi`,
            type: `upperCase`,
            language: `Hindi`
        }
    ],
    navHeader: {
        karmayogiBharath: {
            imgSrc: `/assets/img/karmayogiLogo.svg`,
            link: ``
        },
        navButtons: [
            {
                text: ``,
                link: ``,
                fragment: '',
            },
            {
                text: `topNavBar.aboutUs`,
                link: `aboutUs`,
                fragment: 'about_us',
            },
            {
                text: `topNavBar.newsroom`,
                link: `.`,
                fragment: 'newsroom',
            },
            {
                text: `topNavBar.career`,
                link: `career`,
                fragment: 'career',
            },
            {
                text: `topNavBar.tenders`,
                link: `tenders`,
                fragment: 'tenders',
            },
            {
                text: `topNavBar.notifications`,
                link: `notifications`,
                fragment: 'notifications',
            },
            {
                text: `topNavBar.contactUs`,
                link: `contactus`,
                fragment: 'contactus',
            }

        ],
        loginBtn: {
            text: `topNavBar.login`,
            link: `protected/v8/resource`
        },
        registerBtn: {
            text: `topNavBar.register`,
            link: `public/signup`,
        },
        contactLink : {
            text: `topNavBar.contactUs`,
            link: `contactus`,
            fragment: 'contactus',
        }
    },
}

export const DASHBOARD_ANALYTICS_LIST = [
    {
        dashboaredHeader: `Number of users/MDO's`,
        analyticsList: [
            {
                imgSrc: `./assets/img/learnsGraph.svg`,
                count: `0`,
                description: `Karmayogis onboarded`,
                alt: `learns record`,
                id: `karmayogiOnboarded`
            }, {
                imgSrc: `./assets/img/learnsGraph.svg`,
                count: `0`,
                description: `Registered MDO's`,
                alt: `learns record`,
                id: `registeredMdo`
            },
        ]
    },
    {
        dashboaredHeader: `Available content`,
        analyticsList: [
            {
                imgSrc: `./assets/img/coursesGraph.svg`,
                count: `0`,
                description: `Courses`,
                alt: `Courses record`,
                id: `courses`
            }, {
                imgSrc: `./assets/img/contentGraph.svg`,
                count: `0`,
                description: `Available content (hours)`,
                alt: `Content record`,
                id: `availableContent`
            },
        ]
    }
]

export const FEATURES_COURSES = {
    header: {
        headerText: `courses.showcasedCourses`,
        type: `featured-courses`,
        showAll: `courses.showAll`
    },
    dataList: [],

}

export const TESTIMONIALS = {
    header: {
        headerText: `testimonial`,
        type: `testimonials`
    },
    dataList: [
        {
            posterImage: `assets/testimonials/testimonial-1.webp`,
            name: `Preet Bharat`,
            description: `iGOT is just like a seed that has been planted with the potential to grow into a mighty tree for progress and development of nation. With the support and motivation from MDOs, this initiative has the potential to bear the tastiest fruits for the betterment of society. MDOs can nurture the potential within individuals and empower them to contribute positively to society."`,
            desig: `CRPF`,
        },
        {
            posterImage: `assets/testimonials/testimonial-2.webp`,
            name: `Preet Bharat`,
            description: `iGOT is just like a seed that has been planted with the potential to grow into a mighty tree for progress and development of nation. With the support and motivation from MDOs, this initiative has the potential to bear the tastiest fruits for the betterment of society. MDOs can nurture the potential within individuals and empower them to contribute positively to society."`,
            desig: `CRPF`,
        },
        {
            posterImage: `assets/testimonials/testimonial-3.webp`,
            name: `Preet Bharat`,
            description: `iGOT is just like a seed that has been planted with the potential to grow into a mighty tree for progress and development of nation. With the support and motivation from MDOs, this initiative has the potential to bear the tastiest fruits for the betterment of society. MDOs can nurture the potential within individuals and empower them to contribute positively to society."`,
            desig: `CRPF`,
        },
        {
            posterImage: `assets/testimonials/testimonial-4.webp`,
            name: `Preet Bharat`,
            description: `iGOT is just like a seed that has been planted with the potential to grow into a mighty tree for progress and development of nation. With the support and motivation from MDOs, this initiative has the potential to bear the tastiest fruits for the betterment of society. MDOs can nurture the potential within individuals and empower them to contribute positively to society."`,
            desig: `CRPF`,
        },
        {
            posterImage: `assets/testimonials/testimonial-5.webp`,
            name: `Preet Bharat`,
            description: `iGOT is just like a seed that has been planted with the potential to grow into a mighty tree for progress and development of nation. With the support and motivation from MDOs, this initiative has the potential to bear the tastiest fruits for the betterment of society. MDOs can nurture the potential within individuals and empower them to contribute positively to society."`,
            desig: `CRPF`,
        },
    ],
}

export const NEWSROOM_COURSES = {
    header: {
        headerText: `newsRoom`,
        type: `news-room`
    },
    dataList: [],
    localDataList: [
        {
            posterImage: `./assets/newsroom/newsletter-1.jpg`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/January Newsletter_Final 2.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-2.jpg`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/Newsletter Year Edition.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-3.png`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/Newsletter December.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-4.png`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/nov.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-5.jpeg`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/October_Newsletter.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-6.png`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/sep.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-7.jpg`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/Newsletter August.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-8.jpg`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/Newsletter June-July.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/Newsletter May.pdf',
            button: `Download PDF`,
        },
        // {
        //     posterImage: `./assets/newsroom/newsletter-10.jpg`,
        //     name: `Volume 1 Issue 9( October - November 2023)`,
        //     downloadLink: './assets/newsroom/news-letter-pdf/Newsletter_April_6.pdf',
        //     button: `Download PDF`,
        // },
        // {
        //     posterImage: `./assets/newsroom/newsletter-11.jpg`,
        //     name: `Volume 1 Issue 9( October - November 2023)`,
        //     downloadLink: './assets/newsroom/news-letter-pdf/March l Vol1 I Issue 2.pdf',
        //     button: `Download PDF`,
        // },
        // {
        //     posterImage: `./assets/newsroom/newsletter-12.jpg`,
        //     name: `Volume 1 Issue 9( October - November 2023)`,
        //     downloadLink: './assets/newsroom/news-letter-pdf/final newsletter.pdf',
        //     button: `Download PDF`,
        // },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `Aspirational Blocks Programme Module Now Live On iGOT Karmayogi Platform`,
            downloadLink: './assets/newsroom/news-letter-pdf/PIB1956555 (2).pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `Workshop on Art of Leadership Communication organized by Karmayogi Bharat`,
            downloadLink: './assets/newsroom/news-letter-pdf/PIB1965959 (1).pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `Courses launched by Sashastra Seema Bal now Live on iGOT Karmayogi platform`,
            downloadLink: './assets/newsroom/news-letter-pdf/PIB1966086.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `Celebrating 1st Year Anniversary of Karmayogi Prarambh`,
            downloadLink: './assets/newsroom/news-letter-pdf/Celebrating 1st Year Anniversary of Karmayogi Prarambh.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `Accessibility Widget launched on the iGOT Karmayogi Platform on International Day of Persons with Disabilities`,
            downloadLink: './assets/newsroom/news-letter-pdf/Press Information Bureau.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `SAMARTH Curated Programs launched by Karmayogi Bharat and NITI Aayog`,
            downloadLink: './assets/newsroom/news-letter-pdf/PIB1990840.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `Dr. Jitendra Singh, Minister of State for Personnel, Public Grievances and Pensions  to inaugurate Good Governance Day on 25th December, 2023`,
            downloadLink: './assets/newsroom/news-letter-pdf/Press Information Bureau1.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `Union Minister Dr Jitendra Singh says, "Mission Karmayogi", launched by Prime Minister Shri Narendra Modi, had institutionalised the process of capacity building, particularly for the benefit of civil servants`,
            downloadLink: './assets/newsroom/news-letter-pdf/PIB1921429 (1).pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `PM distributes about 71,000 appointment letters to newly inducted recruits under Rozgar Mela`,
            downloadLink: './assets/newsroom/news-letter-pdf/Press Information Bureau2.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `PM distributes more than 1 lakh appointment letters to newly inducted recruits in Government departments and organisations under Rozgar Mela`,
            downloadLink: './assets/newsroom/news-letter-pdf/Press Information Bureau3.pdf',
            button: `Download PDF`,
        },
    ]
}

export const TOP_PROVIDERS = {
    header: {
        headerText: `partners`,
        type: `content-providers`
    },
    topProvidersList: [
        {
            posterImage: `assets/top_providers/Apolitical.png`,
            name: `Apolitical`,
            clientUrl: `https://apolitical.co/home/`
        },
        {
            posterImage: `assets/top_providers/LBSNAA.png`,
            name: `LBSNAA`,
            clientUrl: `https://portal.igotkarmayogi.gov.in/app/learn/browse-by/provider/LBSNAA/all-CBP`
        },
        {
            posterImage: `assets/top_providers/ISTM.png`,
            name: `ISTM`,
            clientUrl: `https://portal.igotkarmayogi.gov.in/app/learn/browse-by/provider/Institute of Secretariat Training and Management/all-CBP`
        },
        {
            posterImage: `assets/top_providers/Udemy.png`,
            name: `Udemy`,
            clientUrl: `https://www.udemy.com/`
        },
        {
            posterImage: `assets/top_providers/ISRO.png`,
            name: `ISRO`,
            clientUrl: `https://www.isro.gov.in/`
        },
        {
            posterImage: `assets/top_providers/Microsoft.png`,
            name: `Microsoft`,
            clientUrl: `https://portal.igotkarmayogi.gov.in/app/learn/browse-by/provider/Microsoft/all-CBP`
        },
        {
            posterImage: `assets/top_providers/Karmayogi Bharat.png`,
            name: `Karmayogi Bharat`,
            clientUrl: `https://karmayogibharat.gov.in/`
        },
        {
            posterImage: `assets/top_providers/SVPNPA.png`,
            name: `SVPNPA`,
            clientUrl: `https://portal.igotkarmayogi.gov.in/app/learn/browse-by/provider/SVPNPA/all-CBP`
        },
    ]
}

export const ABOUT_US = {
    header: {
        headerText: `topNavBar.aboutUs`,
        p1: `Karmayogi Bharat, a Special Purpose Vehicle (SPV), is a crucial part of this framework. It was incorporated on 31.01.2022 under Section 8 of the Companies Act, 2013 as a 100% Government owned not-for-profit Co`,
        p2: `Its responsibility is to operate and manage the iGOT Karmayogi platform, ensurintimewhere-dqevice learning for civil service officials to enhance their competency. The SPV will own, manage, maintain, and improve the digital assets, including the IPR of all software, content, process etc. on behalf of the Government with an annual subscription-based revenue model.`,
        p3: `Its responsibility is to operate and manage the iGOT Karmayogi platform, ensurintimewhere-dqevice learning for civil service officials to enhance their competency. The SPV will own, manage, maintain, and improve the digital assets, including the IPR of all software, content, process etc. on behalf of the Government with an annual subscription-based revenue model.`,
        type: "about-us"
    },
    dataList: [{
        image: `assets/aboutus/about-new.JPG`,
    }
    ]
}

export const VIDEO_CONF = {
    title: `conference.title`,
    thumbnail: `assets/videoconference/thumbnail.png`,
    text: `conference.support`,
    date: `conference.duration`,
    time: `conference.slot`,
    button: `conference.action`,
    joinLink: "https://teams.microsoft.com/l/meetup-join/19%3ameeting_M2Y3ZDE2ZDMtMWQwYS00OWQzLWE3NDctNDRkNTdjOGI4Yzll%40thread.v2/0?context=%7b%22Tid%22%3a%2240cfb65c-9b71-435f-8bc2-bc2c69df1aca%22%2c%22Oid%22%3a%22cbd37bc9-5c33-401f-b590-9decb3c370f8%22%7d",
    technicalSupport: `conference.technicalSupport`,
    plsContact: `conference.plsContact`
}

export const PHOTO_GALLARY = {
    header: {
        headerText: `gallery.photoGallery`,
        type: `photo-gallary`
    },
    galleryList: [
        { name: "Rectangle1", src: "assets/photos_gallery/Rectangle1.png" },
        { name: "Rectangle2", src: "assets/photos_gallery/Rectangle2.png" },
        { name: "Rectangle3", src: "assets/photos_gallery/Rectangle3.png" },
        { name: "Rectangle4", src: "assets/photos_gallery/Rectangle4.png" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/9059c922-40a5-4a51-91ae-af9abecbcb7b.jpeg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/332470235_470417818506417_6989887497328782909_n.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/332489727_742771693929365_7451095071369935484_n (1).jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/344061562_1463582880844463_2813493197040593989_n.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/353772828_197260853276676_2428144849076294106_n.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/387826043_271464862522941_8285872309702331271_n.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/400624395_290754297260664_7366696641428760011_n.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/df1ffe85-76ee-4fb3-831b-3e6c2f62785d.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/IMG_2303.JPG" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-41.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-44.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-45_1.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-45.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-46.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-47_1.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-47.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-48.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-49.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-50.jpg" },
    ]
}

export const IGON_VISION_DETAILS = {
    vision: {
        imgUrl: `./assets/img/visionImg.svg`,
        alt: `How does the platform enable you to become the best version of yourself?`,
    },
    videos: [
        {
            poster: `./assets/img/video1.png`,
            videoLink: `./assets/img/Sanjeev-final.mp4`,
            line1: `An `,
            line2: `experienced`,
            line3: ` civil servant`,
        },
        {
            poster: `./assets/img/video2.png`,
            videoLink: `./assets/img/Shilpa-final.mp4`,
            line1: `A `,
            line2: `newly`,
            line3: ` recruited civil servant`,
        },
    ],

}
export const CONFERENCE_DATA = {
    title: 'conference.title',
    description: 'conference.support',
    workdays: 'conference.duration',
    timings: 'conference.slot',
    joinNow: 'conference.action'
}

export const REGISTER_DETAILS = {
    lineOne: `Take the`,
    lineTwo: `first step`,
    lineThree: ` towards learning`,
    registerBtn: {
        text: `Register Now`,
        link: `public/signup`
    }
}

export const SOLUTIONS_SPACE = {
    solutionSpaceHeader: {
        lineOne: `Solutioning space`,
        lineTwo: `for all of Government`,
    },
    solutionSpacesList: [
        {
            name: `Learning hub`,
            description: `Learwheretime and bridge your competency gaps using impactful and engaging learning content.`,
            imgSrc: `./assets/img/school.svg`,
        }, {
            name: `Discussion hub`,
            description: `Discuss and learn with peers, colleagues, civil servants and experts across the country.`,
            imgSrc: `./assets/img/forum.svg`,
        }, {
            name: `Network hub`,
            description: `Connect with civil servants across the country. Grow your network within government circles.`,
            imgSrc: `./assets/img/group.svg`,
        }, {
            name: `Competency hub`,
            description: `Identify your competency requirements, competency gaps, so you can grow faster in the right direction.`,
            imgSrc: `./assets/img/extension.svg`,
        }, {
            name: `Career hub`,
            description: `Explore career opportunities across the country and signal your expertise.`,
            imgSrc: `./assets/img/work.svg`,
        }, {
            name: `Event hub`,
            description: `Enable simultaneous interactive experiential and peer learning.`,
            imgSrc: `./assets/img/event.svg`,
        },
    ]
}

export const QUICK_WALKTHROUGH_DETAILS = {
    videoLink: `./assets/img/KarmayogiBharatWalkthroughNew.mp4`,
    lineOne: `A quick`,
    lineTwo: ` walkthrough of`,
    lineThree: ` the `,
    lineFour: ` Karmayogi Bharat`,
    lineFive: `Portal`,
}

export const MOBILE_APP_DOWNLOADS_DETAILS = {
    download: `downloadSection.download`,
    iGOT: `downloadSection.iGot`,
    karmayogi: `downloadSection.karmayogi`,
    mobile: "downloadSection.mobile",
    app: "downloadSection.app",
    description: `downloadSection.description`,
    scanners: [
        {
            link: `https://play.google.com/store/apps/details?id=com.igot.karmayogibharat&pli=1`,
            imgSrc: `./assets/img/Google_Play-Badge-Logo.wine.png`,
            scannerSrc: `./assets/img/scan/qrcode.svg`,
            text: `downloadSection.scanToDownload`,
        },
        {
            link: `https://apps.apple.com/in/app/igot-karmayogi/id6443949491`,
            imgSrc: `./assets/img/download-appstore.png`,
            scannerSrc: `./assets/img/scan/iOS_qrcode.svg`,
            text: `downloadSection.scanToDownload`,
        },
    ],
    mockupImgSrc: `./assets/img/mobile-latest.png`
}

export const MOBILE_VIEW_APP_DOWNLOADS_DETAILS = {
    googleStore: {
        imgSrc: `./assets/img/Google_Play-Badge-Logo.wine.png`,
        link: `https://play.google.com/store/apps/details?id=com.igot.karmayogibharat&pli=1`,
    },
    appleStore: {
        imgSrc: `./assets/img/download-appstore.png`,
        link: `https://apps.apple.com/in/app/igot-karmayogi/id6443949491`,
    },
    lineOne: `Download iGOT Karmayogi `,
    lineTwo: `mobile app`
}

export const NAV_FOOTER_DETAILS = {
    navLinks: [
        [
            {
                href: `newsroom`,
                target: `_self`,
                router: '/',
                name: `footerLinks.newsroom`,
            },
            {
                href: `https://portal.igotkarmayogi.gov.in/public/faq`,
                target: `_self`,
                name: `footerLinks.faq`,
                application: 'diff',

            },
            {
                href: `contact_us`,
                target: `_self`,
                router: '/',
                name: `footerLinks.contactUs`
            }
        ],
        [
            {
                href: `mdoUserList`,
                target: `_self`,
                router: `mdoList`,
                name: `footerLinks.nodalOffice`
            },
            {
                href: `latest-updates`,
                target: `_self`,
                router: 'latest-updates',
                name: `footerLinks.karmayogiCorner`
            },
            {
                href: `https://portal.igotkarmayogi.gov.in/public/signup`,
                target: `_self`,
                name: `topNavBar.register`,
                application: 'diff',
            },
        ],
        [
            {
                href: `https://karmayogibharat.gov.in/`,
                target: `_blank`,
                name: `footerLinks.missionKarmayogi`
            },
            {
                href: `https://dopt.gov.in/`,
                target: `_blank`,
                name: `footerLinks.dopt`
            },
            {
                href: `https://cbc.gov.in/`,
                target: `_blank`,
                name: `footerLinks.cpc`
            },
            {
                href: `https://portal.igotkarmayogi.gov.in/public/privacy-policy/`,
                target: `_blank`,
                name: `footerLinks.privacyPolicy`
            },
        ]
    ],
    followUs: 'socailHub.followUs',
    // copyRights: 'Copyright © Website managed by Karmayogi Bharat.',
    // copyRightMobile: 'Copyright © Website managed by Karmayogi Bharat.'
    copyRights: 'Copyright',
    copyRightMobile: 'CopyrightMobile'
}
export const NAV_FOOTER_DETAILS_MOBILE = {
    support: [
        {
            href: `https://portal.igotkarmayogi.gov.in/public/faq`,
            target: `_self`,
            name: `footerLinks.faq`,
            application: 'diff',

        },
        {
            href: `contact_us`,
            target: `_self`,
            router: '/',
            name: `footerLinks.contactUs`
        },
        {
            href: `mdoUserList`,
            target: `_self`,
            router: `mdoList`,
            name: `footerLinks.nodalOffice`
        },
    ],
    releated: [
        {
            href: `newsroom`,
            target: `_self`,
            router: '/',
            name: `footerLinks.newsroom`,
        },
        {
            href: `latest-updates`,
            target: `_self`,
            router: 'latest-updates',
            name: `footerLinks.karmayogiCorner`
        },
        {
            href: `https://portal.igotkarmayogi.gov.in/public/signup`,
            target: `_self`,
            name: `topNavBar.register`,
            application: 'diff',
        },
        {
            href: `https://karmayogibharat.gov.in/`,
            target: `_blank`,
            name: `footerLinks.missionKarmayogi`
        },
        {
            href: `https://dopt.gov.in/`,
            target: `_blank`,
            name: `footerLinks.dopt`
        },
        {
            href: `https://cbc.gov.in/`,
            target: `_blank`,
            name: `footerLinks.cpc`
        },
        {
            href: `https://portal.igotkarmayogi.gov.in/public/privacy-policy/`,
            target: `_blank`,
            name: `footerLinks.privacyPolicy`
        },
    ],
    followUs: 'socailHub.followUs',
    copyRights: 'Copyright © Website managed by Karmayogi Bharat.',
    copyRightMobile: 'Copyright © Website managed by Karmayogi Bharat.'
}

export const FOOTER_DETAILS = {
    copyRights: 'Copyright © Website managed by Karmayogi Bharat.'
}

export const HOW_TO_CARD_LIST = {
    header: {
        headerText: `How to`,
        type: `howto`
    },
    dataList: [
        {
            title: 'How to Register?', link: '', icon: "assets/img/howto/Rectangle3.png"
        },
        {
            title: 'How to Login?', link: '', icon: "assets/img/howto/Rectangle1.png"
        },
        {
            title: 'Platform Walkthrough', link: '', icon: "assets/img/howto/Rectangle2.png"
        }
    ],
}

export const INFOCUS_CARD = [{
    videoCategory: 'course_intro',
    header: {
        headerText: `Video Gallery`,
        type: `video-gallery`
    },
    dataList: [
        {

        }
    ]
}]

export const WHAT_IS_CARD = {
    header: {
        headerText: `what-is`,
        type: `what-is`
    },
    dataList: [
        // {
        //     id: 'whatIsIGot',
        //     imgSrc: `assets/whatis/igot1stvideo.jpg`,
        //     name: 'walkThrough.whatIsIGot',
        //     link: 'https://www.youtube.com/watch?v=CgSHMbEhf6E'
        // },
        {
            id: 'howToLoginAndRegister',
            imgSrc: `assets/whatis/howtoregister.jpg`,
            name: 'walkThrough.howToLoginAndRegister',
            link: 'https://www.youtube.com/watch?v=MH12AkVBs3k'
        }, {
            id: 'igotWalkthrough',
            imgSrc: `assets/whatis/Rectangle3.png`,
            name: 'walkThrough.igotWalkthrough',
            link: 'https://www.youtube.com/watch?v=mak7BPe_0jY'
        }
    ],
}

export const FOOTER_PROVIDER = [
    { href: 'https://cbc.gov.in/', src: "assets/footer-provider/new/capacity-building.svg" },
    { href: 'https://www.digitalindia.gov.in/', src: "assets/footer-provider/new/digital-india.svg" },
    { href: 'https://dopt.gov.in/', src: "assets/footer-provider/new/dopt.svg" },
    { href: 'https://data.gov.in/', src: "assets/footer-provider/new/data-gov.svg" },
    { href: 'https://www.meity.gov.in/', src: "assets/footer-provider/new/MEIT.svg" },
    { href: 'https://www.mygov.in/', src: "assets/footer-provider/new/my-gov.svg" },
    { href: 'https://www.pmindia.gov.in/en/', src: "assets/footer-provider/new/pm-india.svg" },
    { href: 'https://www.india.gov.in/', src: "assets/footer-provider/new/india-gov.svg" },

];

export const STAT_ARR = [
    { icon: "assets/stat_icon/Network 2.svg", count: "30+ Lakhs", name: "stats.karmayogisOnboarded" },
    { icon: "assets/stat_icon/Program.svg", count: "868", name: "stats.totalCourses" },
    { icon: "assets/stat_icon/Network 4.svg", count: "3,846", name: "stats.totalCompletitions" },
    { icon: "assets/stat_icon/people.svg", count: "1,595", name: "stats.monthlyActiveUsers" },
    { icon: "assets/stat_icon/Network 5.svg", count: "1,595", name: "stats.certificatesIssued" },
]

export const SOCIAL_LINKS = [
    { active: true, href_url: "https://twitter.com/iGOTKarmayogi", name: "twitter", src: "assets/social_icons/x.svg" },
    { active: true, href_url: "https://www.linkedin.com/company/karmayogi-bharat/", name: "linkedin", src: "assets/social_icons/in.svg" },
    { active: true, href_url: "https://www.youtube.com/channel/UCPO2faT8YEi6Q_2IY5kf2Dg", name: "youtube", src: "assets/social_icons/yt.svg" },
    { active: true, href_url: "https://www.instagram.com/karmayogibharat/", name: "instagram", src: "assets/social_icons/inst.svg" },
    { active: true, href_url: "https://www.facebook.com/profile.php?id=100089782863897", name: "facebook", src: "assets/social_icons/fb.svg" },
];

export const LANGUAGES = [
    {
        "value": "বাংলা",
        "key": "be"
    },
    {
        "value": "English",
        "key": "en"
    },
    {
        "value": "हिंदी",
        "key": "hi"
    },
    {
        "value": "ಕನ್ನಡ",
        "key": "ka"
    },
    // {
    //     "value": "മലയാളം",
    //     "key": "ml"
    // },
    {
        "value": "मराठी",
        "key": "mr"
    },
    {
        "value": "தமிழ்",
        "key": "ta"
    },
    // {
    //     "value": "తెలుగు",
    //     "key": "te"
    // },
    // {
    //     "value": "অসমীয়া",
    //     "key": "as"
    // },
    
    // {
    //     "value": "ગુજરાતી",
    //     "key": "gu"
    // },
    
    // {
    //     "value": "ଓଡିଆ",
    //     "key": "od"
    // },
    // {
    //     "value": "ਪੰਜਾਬੀ",
    //     "key": "pu"
    // }
]

export const ORGANISATION_PARTNERS = {
    header: {
        headerText: `organisationPartners.title`,
        type: `organisationsPartners`
    },
    dataList: [
        {
            id: '1',
            text: 'organisationPartners.slideText_1'
        },
        {
            id: '2',
            text: 'organisationPartners.slideText_2'
        },
        {
            id: '3',
            text: 'organisationPartners.slideText_3'
        },
        {
            id: '4',
            text: 'organisationPartners.slideText_4'
        },
        {
            id: '5',
            text: 'organisationPartners.slideText_5'
        },
    ],
}

export const FAQ_CHATBOT = {
    FaqTitle: `FaqTitle`
}
export const KARMAYOGI_CORNER = {
    title: `karmayogiCorner`
}

export const ABOUT_KARMAYOGI = {
    header: {
        headerText: 'aboutUsPage.title'
    },
    about: {
        image: {
            imageLink: 'assets/aboutus/about-us-banner.png',
            imageHeader: 'aboutUsPage.teamKarmayogiBharat'
        },
        aboutUs: [
            'aboutUsPage.contest1',

            `aboutUsPage.contest2`
        ],
        karmayogiVisions: [
            {
                iconLink: 'assets/aboutus/vision_icon.svg',
                iconClass: 'vision-icon',
                header: 'aboutUsPage.vision',
                description: 'aboutUsPage.visionDescription'
            },
            {
                iconLink: 'assets/aboutus/mission_icon.svg',
                iconClass: 'mission-icon',
                header: 'aboutUsPage.mission',
                description: 'aboutUsPage.missionDescription'
            }
        ],

    },
}

export const KARMAYOGI_FUNCTIONS = {
    header: 'karmayogiFunctions.title',
    functions: [
        {
            iconLink: 'assets/aboutus/functions_icons/design_function.svg',
            description: 'karmayogiFunctions.designFunction'
        },
        {
            iconLink: 'assets/aboutus/functions_icons/govassests.svg',
            description: 'karmayogiFunctions.governmentAssests'
        },
        {
            iconLink: 'assets/aboutus/functions_icons/file.svg',
            description: 'karmayogiFunctions.create'
        },
        {
            iconLink: 'assets/aboutus/functions_icons/manage_assessment.svg',
            description: 'karmayogiFunctions.manageAssessment'
        },
        {
            iconLink: 'assets/aboutus/functions_icons/telemetry_data.svg',
            description: 'karmayogiFunctions.telemetryData'
        },
        {
            iconLink: 'assets/aboutus/functions_icons/hq.svg',
            description: 'karmayogiFunctions.guidelines'
        },
        {
            iconLink: 'assets/aboutus/functions_icons/mechanism.svg',
            description: 'karmayogiFunctions.mechanism'
        },
        {
            iconLink: 'assets/aboutus/functions_icons/procurement.svg',
            description: 'karmayogiFunctions.procurement'
        },
        {
            iconLink: 'assets/aboutus/functions_icons/information.svg',
            description: 'karmayogiFunctions.information'
        },
    ]
}

export const KARMAYOGI_TEAM = {
    header: 'karmayogiTeam.title',
    categories: [
        {
            tabName: 'karmayogiTeam.boardOfDirectorTab',
            tabId: 'director',
            teamMembers: [
                {
                    memberName: 'karmayogiTeam.teamMembers.subramanianRamadorai',
                    imageLink: 'assets/aboutus/directorList/subhramanian.png',
                    roles: 'karmayogiTeam.teamMemberRoles.subramanianRamadoraiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://x.com/s_ramadorai?s=21'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/subramanian-ramadorai-8847a5265?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.rachnaShah',
                    imageLink: 'assets/aboutus/directorList/rachnaShah.png',
                    roles: 'karmayogiTeam.teamMemberRoles.rachnaShahRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.skrishnan',
                    imageLink: 'assets/aboutus/directorList/s krishnan.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.skrishnanRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://x.com/abhish18?s=21'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/abhisheksinghias?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.govindIyer',
                    imageLink: 'assets/aboutus/directorList/govind.png',
                    roles: 'karmayogiTeam.teamMemberRoles.govindIyerRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/govindiyer?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.nirmaljeetSinghKalsi',
                    imageLink: 'assets/aboutus/directorList/nirmaljeet.png',
                    roles: 'karmayogiTeam.teamMemberRoles.nirmaljeetSinghKalsiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://x.com/nskalsi?s=21'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/dr-nirmaljeet-singh-kalsi-ias-retd-0b84561?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.pankajBansal',
                    imageLink: 'assets/aboutus/directorList/pankaj.png',
                    roles: 'karmayogiTeam.teamMemberRoles.pankajBansalRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://x.com/pankajbansalpb?s=21'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/pbpankajbansal?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.debjaniGhosh',
                    imageLink: 'assets/aboutus/directorList/debjani.png',
                    roles: 'karmayogiTeam.teamMemberRoles.debjaniGhoshRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://x.com/debjani_ghosh_?s=21'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/debjani-ghosh-48298b1?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.lalithaLakshmi',
                    imageLink: 'assets/aboutus/directorList/CEO-Mam.png',
                    roles: 'karmayogiTeam.teamMemberRoles.lalithaLakshmiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ashishPai',
                    imageLink: 'assets/aboutus/directorList/ashish.png',
                    roles: 'karmayogiTeam.teamMemberRoles.ashishPaiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/ashish-pai-10499a12/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                // {
                //     memberName: 'karmayogiTeam.teamMembers.hemangJani',
                //     imageLink: 'assets/aboutus/jani.svg',
                //     roles: 'karmayogiTeam.teamMemberRoles.hemangJaniRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: ''
                //         }
                //     ]
                // },

                // {
                //     memberName: 'karmayogiTeam.teamMembers.alkeshKumarSharma',
                //     imageLink: 'assets/aboutus/alkesh.svg',
                //     roles: 'karmayogiTeam.teamMemberRoles.alkeshKumarSharmaRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: ''
                //         }
                //     ]
                // },
                // {
                //     memberName: 'karmayogiTeam.teamMembers.santruptMisra',
                //     imageLink: 'assets/aboutus/santrupt.svg',
                //     roles: 'karmayogiTeam.teamMemberRoles.santruptMisraRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: ''
                //         }
                //     ]
                // },
            ]
        },
        {
            tabName: 'karmayogiTeam.karmayogiTeamTab',
            tabId: 'Karmayogi',
            teamMembers: [
                {
                    memberName: 'karmayogiTeam.teamMembers.lalithaLakshmi',
                    imageLink: 'assets/aboutus/directorList/CEO-Mam.png',
                    roles: 'karmayogiTeam.teamMemberRoles.lalithaLakshmiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://x.com/abhish18?s=21'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/abhisheksinghias?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },

                {
                    memberName: 'karmayogiTeam.teamMembers.rakeshVerma',
                    imageLink: 'assets/aboutus/karmayogiTeam/rakesh.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.rakeshVermaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ashishPaiWithoutSri',
                    imageLink: 'assets/aboutus/directorList/ashish.png',
                    roles: 'karmayogiTeam.teamMemberRoles.ashishPaiRolesWithoutKarmayogi',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/ashish-pai-10499a12/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ranaPratapSingh',
                    imageLink: 'assets/aboutus/karmayogiTeam/ranaPratapSingh.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.ranaPratapSinghRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://twitter.com/ranaprsingh'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/ranapratapsingh1/'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.monojeetChakravorty',
                    imageLink: 'assets/aboutus/karmayogiTeam/monojeet.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.monojeetChakravortyRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },

                // {
                //     memberName: 'karmayogiTeam.teamMembers.harleenSachdeva',
                //     imageLink: 'assets/aboutus/karmayogiTeam/harleenSachdeva.jpg',
                //     roles: 'karmayogiTeam.teamMemberRoles.harleenSachdevaRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: 'https://www.linkedin.com/in/ashish-pai-10499a12/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                //         }
                //     ]
                // },

                {
                    memberName: 'karmayogiTeam.teamMembers.samtaKumariSimmy',
                    imageLink: 'assets/aboutus/karmayogiTeam/samtaKumari.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.samtaKumariSimmyRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/cssamtaksimmy?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
                        }
                    ]
                },
                // {
                //     memberName: 'karmayogiTeam.teamMembers.hemantSharma',
                //     imageLink: 'assets/aboutus/karmayogiTeam/hemant.jpg',
                //     roles: 'karmayogiTeam.teamMemberRoles.hemantSharmaRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: ''
                //         }
                //     ]
                // },               
                {
                    memberName: 'karmayogiTeam.teamMembers.shobhanaRana',
                    imageLink: 'assets/aboutus/karmayogiTeam/shobhana.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.shobhanaRanaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/shobhana-rana-59a48092?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },

                {
                    memberName: 'karmayogiTeam.teamMembers.riteshKumar',
                    imageLink: 'assets/aboutus/karmayogiTeam/ritesh.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.riteshKumarRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                // {
                //     memberName: 'karmayogiTeam.teamMembers.rahulRanjan',
                //     imageLink: 'assets/aboutus/karmayogiTeam/rahulRanjan.jpg',
                //     roles: 'karmayogiTeam.teamMemberRoles.rahulRanjanRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: ''
                //         }
                //     ]
                // },
                // {
                //     memberName: 'karmayogiTeam.teamMembers.rajatPratapSingh',
                //     imageLink: 'assets/aboutus/karmayogiTeam/rajatPratapSingh.jpg',
                //     roles: 'karmayogiTeam.teamMemberRoles.rajatPratapSinghRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: ''
                //         }
                //     ]
                // },
                {
                    memberName: 'karmayogiTeam.teamMembers.kailashChandra',
                    imageLink: 'assets/aboutus/karmayogiTeam/kailashChandra.png',
                    roles: 'karmayogiTeam.teamMemberRoles.kailashChandraRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.soumiBanerjee',
                    imageLink: 'assets/aboutus/karmayogiTeam/soumiBanerjee.png',
                    roles: 'karmayogiTeam.teamMemberRoles.soumiBanerjeeRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.eshaKatiyar',
                    imageLink: 'assets/aboutus/karmayogiTeam/esha.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.eshaKatiyarRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/esha-katiyar-137a3571/'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ankitaSondhi',
                    imageLink: 'assets/aboutus/karmayogiTeam/ankita.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.ankitaSondhiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/ankita-sondhi/'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.akankshaSrivastava',
                    imageLink: 'assets/aboutus/karmayogiTeam/akankshaSrivastava.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.akankshaSrivastavaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.dineshUpase',
                    imageLink: 'assets/aboutus/karmayogiTeam/image.png', // image missing check with dheeraj
                    roles: 'karmayogiTeam.teamMemberRoles.dineshUpaseRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.syedMohdUzair',
                    imageLink: 'assets/aboutus/karmayogiTeam/syedMohdUzair.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.syedMohdUzairRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/syed-mohd-uzair-a82b98147/?originalSubdomain=in'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.siddhiMehndiratta',
                    imageLink: 'assets/aboutus/karmayogiTeam/siddhi.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.siddhiMehndirattaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://x.com/shemusings?s=21'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/siddhi-mehndiratta-575409210?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                /* Pawan Kumar Pathak left the team */

                {
                    memberName: 'karmayogiTeam.teamMembers.vaibhavAgarwal',
                    imageLink: 'assets/aboutus/karmayogiTeam/vaibhav.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.vaibhavAgarwalRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/ashish-pai-10499a12/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                // {
                //     memberName: 'karmayogiTeam.teamMembers.rajeshKumar',
                //     imageLink: 'assets/aboutus/karmayogiTeam/rajesh.jpg',
                //     roles: 'karmayogiTeam.teamMemberRoles.rajeshKumarRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: 'https://www.linkedin.com/in/ashish-pai-10499a12/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                //         }
                //     ]
                // },

                {
                    memberName: 'karmayogiTeam.teamMembers.sahilJain',
                    imageLink: 'assets/aboutus/karmayogiTeam/sahilJain.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.sahilJainRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/ashish-pai-10499a12/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.shubhamGupta',
                    imageLink: 'assets/aboutus/karmayogiTeam/shubham.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.shubhamGuptaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://x.com/gupta_shubham04/'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/shubhamgupta04/'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.pawanKumarPathak',
                    imageLink: 'assets/aboutus/karmayogiTeam/Pawan.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.pawanKumarPathakRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.abhimanyuSharma',
                    imageLink: 'assets/aboutus/karmayogiTeam/abhimanyuSharma.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.abhimanyuSharmaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.vinayakSen',
                    imageLink: 'assets/aboutus/karmayogiTeam/vinayakSen.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.vinayakSenRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://twitter.com/ivankaynes'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/vinayak-sen?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.nidhi',
                    imageLink: 'assets/aboutus/karmayogiTeam/nidhi.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.nidhiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'www.linkedin.com/in/nidhi-vaish-01362a167'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.muddukrishna',
                    imageLink: 'assets/aboutus/karmayogiTeam/muddukrishna.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.muddukrishnaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://twitter.com/muddukrishna_?t=QJNuSUXQD7yN97UpQJCbKw&s=09'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/muddu-krishna-267a3898?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.henryArokiaRaj',
                    imageLink: 'assets/aboutus/karmayogiTeam/henryArokia.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.henryArokiaRajRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/henry-arokia-raj-0b8021249/'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.priyamvadaPallaviMishra',
                    imageLink: 'assets/aboutus/karmayogiTeam/priyamvadaPallaviMishra.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.priyamvadaPallaviMishraRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/dr-priyamvada-mishra-6181961bb?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                // {
                //     memberName: 'karmayogiTeam.teamMembers.amitSinghal',
                //     imageLink: 'assets/aboutus/karmayogiTeam/amitSinghal.jpg',
                //     roles: 'karmayogiTeam.teamMemberRoles.amitSinghalRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: 'https://www.linkedin.com/in/amit-singhal-15004b114'
                //         }
                //     ]
                // },
                {
                    memberName: 'karmayogiTeam.teamMembers.akshaySharma',
                    imageLink: 'assets/aboutus/karmayogiTeam/akshaySharma.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.akshaySharmaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'http://www.linkedin.com/in/akshaysharma12' // NOSONAR
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.rakshandaSinghThakur',
                    imageLink: 'assets/aboutus/karmayogiTeam/rakshandaSingh.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.rakshandaSinghThakurRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ' https://twitter.com/RakshandaSing20'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/rakshanda-singh-thakur-007a451a4?trk=contact-info'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.sheetal',
                    imageLink: 'assets/aboutus/karmayogiTeam/sheetal.png',
                    roles: 'karmayogiTeam.teamMemberRoles.sheetalRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.taranpalSingh',
                    imageLink: 'assets/aboutus/karmayogiTeam/taranpalSingh.png',
                    roles: 'karmayogiTeam.teamMemberRoles.taranpalSinghRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.nitikaDogra',
                    imageLink: 'assets/aboutus/karmayogiTeam/nitikaDogra.png',
                    roles: 'karmayogiTeam.teamMemberRoles.nitikaDograRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.suman',
                    imageLink: 'assets/aboutus/karmayogiTeam/suman.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.sumanRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                }, 
                {
                    memberName: 'karmayogiTeam.teamMembers.vishalTomer',
                    imageLink: 'assets/aboutus/karmayogiTeam/vishalTomer.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.vishalTomerRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },               
                {
                    memberName: 'karmayogiTeam.teamMembers.vivekRanjanPandey',
                    imageLink: 'assets/aboutus/karmayogiTeam/image.png',
                    roles: 'karmayogiTeam.teamMemberRoles.vivekRanjanPandeyRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ajaySingh',
                    imageLink: 'assets/aboutus/karmayogiTeam/image.png',
                    roles: 'karmayogiTeam.teamMemberRoles.ajaySinghRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.priyankaKumari',
                    imageLink: 'assets/aboutus/karmayogiTeam/image.png',
                    roles: 'karmayogiTeam.teamMemberRoles.priyankaKumariRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ladNimeshkumarBalavantbhai',
                    imageLink: 'assets/aboutus/karmayogiTeam/image.png',
                    roles: 'karmayogiTeam.teamMemberRoles.ladNimeshkumarBalavantbhaiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ashishKumar',
                    imageLink: 'assets/aboutus/karmayogiTeam/ashishKumar.png',
                    roles: 'karmayogiTeam.teamMemberRoles.ashishKumarRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.shaniKumar',
                    imageLink: 'assets/aboutus/karmayogiTeam/shaniKumar.png',
                    roles: 'karmayogiTeam.teamMemberRoles.shaniKumarRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.kamleshKumarYadav',
                    imageLink: 'assets/aboutus/karmayogiTeam/kamleshKumarYadav.png',
                    roles: 'karmayogiTeam.teamMemberRoles.kamleshKumarYadavRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.anbalaganArunRaja',
                    imageLink: 'assets/aboutus/karmayogiTeam/anbalaganArunRaja.png',
                    roles: 'karmayogiTeam.teamMemberRoles.anbalaganArunRajaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.anjaliKumarBharadwaj',
                    imageLink: 'assets/aboutus/karmayogiTeam/anjaliKumarBharadwaj.png',
                    roles: 'karmayogiTeam.teamMemberRoles.anjaliKumarBharadwajRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ashishThakran',
                    imageLink: 'assets/aboutus/karmayogiTeam/ashishThakran.png',
                    roles: 'karmayogiTeam.teamMemberRoles.ashishThakranRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ranjanaTripathi',
                    imageLink: 'assets/aboutus/karmayogiTeam/ranjanaTripathi.png',
                    roles: 'karmayogiTeam.teamMemberRoles.ranjanaTripathiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.reenaBhasin',
                    imageLink: 'assets/aboutus/karmayogiTeam/reenaBhasin.png',
                    roles: 'karmayogiTeam.teamMemberRoles.reenaBhasinRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.meenuPathak',
                    imageLink: 'assets/aboutus/karmayogiTeam/meenuPathak.png',
                    roles: 'karmayogiTeam.teamMemberRoles.meenuPathakRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.himanshu',
                    imageLink: 'assets/aboutus/karmayogiTeam/image.png',
                    roles: 'karmayogiTeam.teamMemberRoles.himanshuRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.rishabhJain',
                    imageLink: 'assets/aboutus/karmayogiTeam/image.png',
                    roles: 'karmayogiTeam.teamMemberRoles.rishabhJainRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.sunilKumar',
                    imageLink: 'assets/aboutus/karmayogiTeam/sunilKumar.png',
                    roles: 'karmayogiTeam.teamMemberRoles.sunilKumarRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.randhirKumarSingh',
                    imageLink: 'assets/aboutus/karmayogiTeam/randhirKumarSingh.png',
                    roles: 'karmayogiTeam.teamMemberRoles.randhirKumarSinghRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.anjaliSikarwar',
                    imageLink: 'assets/aboutus/karmayogiTeam/anjaliSikarwar.png',
                    roles: 'karmayogiTeam.teamMemberRoles.anjaliSikarwarRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },   
                // {
                //     memberName: 'karmayogiTeam.teamMembers.sampadaSingh',
                //     imageLink: 'assets/aboutus/karmayogiTeam/sampada.jpg',
                //     roles: 'karmayogiTeam.teamMemberRoles.sampadaSinghRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: ''
                //         }
                //     ]
                // },


            ]
        }
    ]
}

export const TENDERS = {
    header: {
        headerText: `tender.title`,
        downloadPdf: `tender.downloadPdf`
    }
}

export const NOTIFICATIONS = {
    header: {
        headerText: `notifications.title`,
        downloadPdf: `notifications.downloadPdf`
    }
}


export const CAREER = {
    header: {
        headerText: `career.title`,
        p1: `career.paraText1`,
        p2: `career.paraText2`,
        headerPosition: `career.positionsText`
    },
    fieldText: {
        f1: `career.jobTitletext`,
        f2: `career.departmentText`,
        f3: `career.positionText`,
        btn1: `career.resetText`,
        btn2: `career.searchText`,
        downloadPdf: `career.downloadPdf`
    },
    placeholderText: {
        p1: `career.selectJobTitle`,
        p2: `career.selectDepartment`,
        p3: `career.selectPosition`
    },

    dataList: [
        {
            image: `assets/aboutus/about-new.JPG`,
        }
    ]
}


export const CONTACTUS = {
    header: {
        headertext1: `contact.titleText1`,
        headerText2: `contact.titletext2`
    },
    fieldText: {
        f1: `contact.fieldtext1`,
        f2: `contact.fieldtext2`,
        f3: `contact.fieldtext3`,
        f4: `contact.fieldtext4`,
        f5: `contact.fieldtext5`,
        f6: `contact.fieldtext6`,
        btn: `contact.fieldtext7`
    },
    contact: {
        h1: `contact.headtext`,
        address: `contact.addressText`,
        mail: `contact.mail`,
        number: `contact.numtext`,
        mailtext: `contact.mailtext`,
        numbertext: `contact.numbertext`,
        duration: `contact.duration`,
        slot: `contact.slot`,
        action: `contact.action`
    },
    placeholder: {
        placeholderText1: `contact.placeholderText1`,
        placeholderText2: `contact.placeholderText2`,
        placeholderText3: `contact.placeholderText3`,
        placeholderText4: `contact.placeholderText4`,
        placeholderText5: `contact.placeholderText5`
    }
}
export const TENDERS_KARMAYOGI = {
    header: {
        headerText: 'tenders.title'
    },
}