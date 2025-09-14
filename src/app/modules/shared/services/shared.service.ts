import { HttpClient } from '@angular/common/http';
//Injectable
import { HostListener, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { InitService } from './init.service';
// import configuration from '../../../../assets/jsonfiles/configurations.json'

const API_END_POINTS = {
  FETCH_COURSES: 'api/course/v2/explore',
  FETCH_POSTAL_COURSES: 'api/content/v1/search',
  FETCH_RAILWAY_COURSES: 'api/content/v1/search',
  FETCH_HALL_OF_FAME: 'api/halloffame/read',
  NLW_FORM_READ: 'apis/static/form/v1/read',
  FETCH_TENDERS: 'api/content/v1/search',
  GET_STATE_CENTER: 'cbp-tpc-ai/state-center/',
  GET_ROLE_MAPPING: 'cbp-tpc-ai/role-mapping/generate',
  GET_DEPARTMENT: 'cbp-tpc-ai/department/state-center',
  GET_ROLE_MAPPING_BY_STATE_CENTER: 'cbp-tpc-ai/role-mapping/state-center',
  GET_ROLE_MAPPING_BY_STATE_CENTER_DEPARTMENT: 'cbp-tpc-ai/role-mapping/state-center',
  UPDATE_ROLE_MAPPING:'cbp-tpc-ai/role-mapping',
  GET_RECOMMENDED_COURSE: 'cbp-tpc-ai',
  SAVE_COURSES: 'cbp-tpc-ai/cbp-plan/save',
  GET_COURSES:  'cbp-tpc-ai/cbp-plan',
  UPDATE_COURSES: 'cbp-tpc-ai/cbp-plan',
  IGOT_SUGGESTED_COURSE: 'cbp-tpc-ai/course/suggestions',
  SAVE_COURSE_SUGGESTED_COURSE: 'cbp-tpc-ai/course/suggestions/save',
  SUGGESTED_COURSE_LIST: 'cbp-tpc-ai/course/suggestions',
  ADD_DESIGNATION:'cbp-tpc-ai/role-mapping/add-designation'
}

// @Directive()
@Injectable({
  providedIn: 'root'
})

export class SharedService {
  cbpPlanFinalObj:any = {}
  baseUrl: string
  configDetails: any
  screenWidth: number;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = event.target.innerWidth;
  }

  constructor(
    private http: HttpClient,
    private initSvc: InitService,
  ) {
    if (initSvc && this.initSvc.baseUrl && this.initSvc.configDetails) {
      this.baseUrl = this.initSvc.baseUrl
      this.configDetails = this.initSvc.configDetails
    } else {
      this.setConfiDetails()
    }
    this.screenWidth = window.innerWidth;

  }

  setConfiDetails(configDetails: any = null) {
    if (configDetails) {
      this.configDetails = configDetails
      this.baseUrl = configDetails.portalURL
    } else {
      this.getConfigDetails().subscribe((response: any) => {
        this.configDetails = response
        this.baseUrl = response.portalURL
      })
    }
  }
  getConfig() {
    if (this.configDetails) {
      return this.configDetails;
    }
    return null;
  }
  getConfigDetails(): Observable<any> {

    return this.http.get<any>('assets/jsonfiles/configurations.json');
  }



  getcourses() {
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.FETCH_COURSES}`)
      .pipe(map((response: any) => {
        return this.formateFeatureCourses(response.result.content)
      }))
  }

  getPostalcourses() {
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.FETCH_POSTAL_COURSES}`)
      .pipe(map((response: any) => {
        return this.formateFeatureCourses(response.result.content)
      }))
  }

  getRailwaycourses() {
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.FETCH_RAILWAY_COURSES}`)
      .pipe(map((response: any) => {
        return this.formateFeatureCourses(response.result.content)
      }))
  }

  getHallOfFame() {
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.FETCH_HALL_OF_FAME}`, null)
      .pipe(map((response: any) => {
        return response
      }))
  }

  formateFeatureCourses(featureCourses: any) {
    const formatedFeatureCourses = [];
    const formatedNewsroom = [];
    const formatedPhotogallary = [];
    const formatedTestimonial = [];
    if (featureCourses) {
      featureCourses.forEach(course => {
        if (course.primaryCategory === 'Course') {
          const formatedCourse = {
            posterImage: course.posterImage,
            organisation: course.organisation[0] ? course.organisation[0] : 'Karmayogi Bharat',
            name: course.name,
            description: course.description,
            identifier: course.identifier,
            alt: course.name,
            creatorLogo: course.creatorLogo || '',
            duration: this.timeConvert(course.duration),
          }
          formatedFeatureCourses.push(formatedCourse)
        }
        else if (course.resourceCategory === 'Newsroom') {
          const formatedCourse = {
            posterImage: course.posterImage,
            name: course.name,
            description: course.description,
            identifier: course.identifier,
            alt: course.name,
            cloudStorageKey: `${this.baseUrl}assets/public/${course.cloudStorageKey}`
          }
          formatedNewsroom.push(formatedCourse)
        }
        else if (course.resourceCategory === 'Photo Gallery') {
          const formatedCourse = {
            name: course.name,
            description: course.description,
            identifier: course.identifier,
            alt: course.name,
            cloudStorageKey: `${this.baseUrl}assets/public/${course.cloudStorageKey}`
          }
          formatedPhotogallary.push(formatedCourse)
        }
        else if (course.resourceCategory === 'Testimonials') {
          const formatedCourse = {
            name: course.name,
            description: course.description,
            identifier: course.identifier,
            alt: course.name,
            cloudStorageKey: `${this.baseUrl}assets/public/${course.cloudStorageKey}`,
            mimeType: course.mimeType,
            posterImage: course.posterImage,
            artifactUrl: course.artifactUrl,
          }
          formatedTestimonial.push(formatedCourse)
        }
      });
    }
    return { course: formatedFeatureCourses, newsroom: formatedNewsroom, gallary: formatedPhotogallary, testimonils: formatedTestimonial }
  }

  timeConvert(duration: number) {
    if (duration) {
      var num = duration;
      var hours = (num / 3600);
      var rhours = Math.floor(hours);
      var minutes = (hours - rhours) * 60;
      var rminutes = Math.round(minutes);
      if (rminutes === 0) {
        return rhours + "h";
      } else if (rhours === 0) {
        return rminutes + "m"
      }
      return rhours + "h " + rminutes + "m";
    } else {
      return 0;
    }
  }

  getClientList() {
    return this.http.get('./assets/jsonfiles/client-list.json');
  }

  getTenders() {
    const body = {
      request: {
        filters: {
          primaryCategory: ["tender"],
          status: { "!=": "Retired" }
        },
        facets: ["mimeType"],
        sortBy: { createdOn: "Desc" }
      }
    }
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.FETCH_TENDERS}`, body)
      .pipe(map((response: any) => {
        return response
      }))
  }

  getNotifications() {
    const body = {
      request: {
        filters: {
          primaryCategory: ["notification"],
          status: { "!=": "Retired" }
        },
        facets: ["mimeType"],
        sortBy: { createdOn: "Desc" }
      }
    }
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.FETCH_TENDERS}`, body)
      .pipe(map((response: any) => {
        return response
      }))
  }
  getFormReadData(req: any) {
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.NLW_FORM_READ}`, req)
      .pipe(map((response: any) => {
        return response
      }))
  }

  getMinistryData() {
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_STATE_CENTER}`)
      .pipe(map((response: any) => {
        return response
      }))
  }

  generateRoleMapping(reqBody) {
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.GET_ROLE_MAPPING}`, reqBody)
      .pipe(map((response: any) => {
        return response
      }))
  }

  getDepartmentList(ministryId) {
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_DEPARTMENT}/${ministryId}`)
    .pipe(map((response: any) => {
      return response
    }))
  }

  getRoleMappingByStateCenter(state_center_id) {
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_ROLE_MAPPING_BY_STATE_CENTER}/${state_center_id}`)
    .pipe(map((response: any) => {
      return response
    }))
  }

  getRoleMappingByStateCenterAndDepartment(state_center_id, department_id) {
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_ROLE_MAPPING_BY_STATE_CENTER}/${state_center_id}/department/${department_id}`)
    .pipe(map((response: any) => {
      return response
    }))
  }

  updateRoleMapping(role_mapping_id, reqBody) {
    return this.http.put<any>(`${this.baseUrl}${API_END_POINTS.UPDATE_ROLE_MAPPING}/${role_mapping_id}`, reqBody)
    .pipe(map((response: any) => {
      return response
    }))
  }

  deleteRoleMapping(role_mapping_id) {
    return this.http.delete<any>(`${this.baseUrl}${API_END_POINTS.UPDATE_ROLE_MAPPING}/${role_mapping_id}`)
    .pipe(map((response: any) => {
      return response
    }))
  }

  getRecommendedCourse(role_mapping_id) {
    let reqBody = {
      role_mapping_id : role_mapping_id
    }
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.GET_RECOMMENDED_COURSE}/course-recommendations/generate`, reqBody)
    .pipe(map((response: any) => {
      return response
    }))
  }

  saveCourse(reqBody){
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.SAVE_COURSES}`, reqBody)
      .pipe(map((response: any) => {
        return response
      }))
  }
  updateCourse(reqBody, cbp_plan_id){
    return this.http.put<any>(`${this.baseUrl}${API_END_POINTS.UPDATE_COURSES}/${cbp_plan_id}`, reqBody)
      .pipe(map((response: any) => {
        return response
      }))
  }

  getCourse(role_mapping_id) {
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_COURSES}?role_mapping_id=${role_mapping_id}`)
    .pipe(map((response: any) => {
      return response
    }))
  }

  getIGOTSuggestedCourses(reqBody) {
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.IGOT_SUGGESTED_COURSE}`, reqBody)
      .pipe(map((response: any) => {
        return response
      }))
  }

  getSuggestedCourses(role_mapping_id) {
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.SUGGESTED_COURSE_LIST}/${role_mapping_id}`, )
    .pipe(map((response: any) => {
      return response
    }))
  }

  saveSuggestedCourse(reqBody){
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.SAVE_COURSE_SUGGESTED_COURSE}`, reqBody)
      .pipe(map((response: any) => {
        return response
      }))
  }

  addDesignation(reqBody){
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.ADD_DESIGNATION}`, reqBody)
      .pipe(map((response: any) => {
        return response
      }))
  }

  
}
