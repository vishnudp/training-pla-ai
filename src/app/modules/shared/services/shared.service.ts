import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  DELETE_ROLE_MAPPING: 'cbp-tpc-ai/role-mapping/delete',
  GET_DEPARTMENT: 'cbp-tpc-ai/department/state-center',
  GET_ROLE_MAPPING_BY_STATE_CENTER: 'cbp-tpc-ai/role-mapping/state-center',
  GET_ROLE_MAPPING_BY_STATE_CENTER_DEPARTMENT: 'cbp-tpc-ai/role-mapping/state-center',
  UPDATE_ROLE_MAPPING:'cbp-tpc-ai/role-mapping',
  GET_RECOMMENDED_COURSE: 'cbp-tpc-ai',
  SAVE_COURSES: 'cbp-tpc-ai/cbp-plan/save',
  GET_COURSES:  'cbp-tpc-ai/cbp-plan',
  UPDATE_COURSES: 'cbp-tpc-ai/cbp-plan',
  IGOT_SUGGESTED_COURSE: 'api/content/v1/search',
  SAVE_COURSE_SUGGESTED_COURSE: 'cbp-tpc-ai/course/suggestions/save',
  SUGGESTED_COURSE_LIST: 'cbp-tpc-ai/course/suggestions',
  ADD_DESIGNATION:'cbp-tpc-ai/role-mapping/add-designation',
  LOGIN:'cbp-tpc-ai/auth/login',
  LOGOUT:'cbp-tpc-ai/auth/logout',
  DELETE_ROLE_MAPPING_BY_STATE_CENTER:'cbp-tpc-ai/role-mapping',
  ADD_USER_COURSES: 'cbp-tpc-ai/user-added-courses',
  GET_USER_COURSES:'cbp-tpc-ai/user-added-courses/role-mapping'
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
  headers:any
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
    const storageData:any = JSON.parse(localStorage.getItem('loginData'))
    console.log('storageData--', storageData)
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${storageData?.access_token}`
    });
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
        sortBy: { createdOn: "desc" }
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
    const storageData:any = JSON.parse(localStorage.getItem('loginData'))
    console.log('storageData--', storageData)
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${storageData?.access_token}`
    });
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_STATE_CENTER}`, {headers})
      .pipe(map((response: any) => {
        return response
      }))
  }

    generateRoleMapping(reqBody, file?: File) {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      
      // Add required fields
      if (reqBody.state_center_id) {
        formData.append('state_center_id', reqBody.state_center_id);
      }
      
      if (reqBody.department_id) {
        formData.append('department_id', reqBody.department_id);
      }
      
      // sector_name removed as it's not required
      
      if (reqBody.instruction) {
        formData.append('instruction', reqBody.instruction);
      }
      
      // Add file if provided
      if (file) {
        formData.append('additional_document', file);
      }
      
      // Follow the exact same pattern as other API methods
      // The only difference is we don't set Content-Type for multipart/form-data
      const headers = this.headers;
      
      console.log('generateRoleMapping FormData:', formData);
      console.log('generateRoleMapping reqBody:', reqBody);
      console.log('Using headers:', headers);
      
      return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.GET_ROLE_MAPPING}`, formData, { headers })
        .pipe(map((response: any) => {
          return response
        }))
    }


  getDepartmentList(ministryId) {
    const storageData:any = JSON.parse(localStorage.getItem('loginData'))
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${storageData?.access_token}`
    });
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_DEPARTMENT}/${ministryId}`, {headers})
    .pipe(map((response: any) => {
      return response
    }))
  }

  getRoleMappingByStateCenter(state_center_id) {
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_ROLE_MAPPING_BY_STATE_CENTER}/${state_center_id}`, {headers})
    .pipe(map((response: any) => {
      return response
    }))
  }

  getRoleMappingByStateCenterAndDepartment(state_center_id, department_id) {
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_ROLE_MAPPING_BY_STATE_CENTER}/${state_center_id}/department/${department_id}`, {headers})
    .pipe(map((response: any) => {
      return response
    }))
  }

  updateRoleMapping(role_mapping_id, reqBody) {
    const headers = this.headers
    return this.http.put<any>(`${this.baseUrl}${API_END_POINTS.UPDATE_ROLE_MAPPING}/${role_mapping_id}`, reqBody, {headers})
    .pipe(map((response: any) => {
      return response
    }))
  }

  deleteRoleMapping(role_mapping_id) {
    const headers = this.headers
    return this.http.delete<any>(`${this.baseUrl}${API_END_POINTS.UPDATE_ROLE_MAPPING}/${role_mapping_id}`, {headers})
    .pipe(map((response: any) => {
      return response
    }))
  }

  getRecommendedCourse(role_mapping_id) {
    const headers = this.headers
    let reqBody = {
      role_mapping_id : role_mapping_id
    }
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.GET_RECOMMENDED_COURSE}/course-recommendations/generate`, reqBody, {headers})
    .pipe(map((response: any) => {
      return response
    }))
  }

  deleteCourseRecommendations(roleMapId: string) {
    const headers = this.headers
    return this.http.delete<any>(`${this.baseUrl}${API_END_POINTS.GET_RECOMMENDED_COURSE}/course-recommendations/role-mapping/${roleMapId}`, {headers})
    .pipe(map((response: any) => {
      return response
    }))
  }

  saveCourse(reqBody){
    const headers = this.headers
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.SAVE_COURSES}`, reqBody, {headers})
      .pipe(map((response: any) => {
        return response
      }))
  }
  updateCourse(reqBody, cbp_plan_id){
    const headers = this.headers
    return this.http.put<any>(`${this.baseUrl}${API_END_POINTS.UPDATE_COURSES}/${cbp_plan_id}`, reqBody, {headers})
      .pipe(map((response: any) => {
        return response
      }))
  }

  getCourse(role_mapping_id) {
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_COURSES}?role_mapping_id=${role_mapping_id}`, {headers})
    .pipe(map((response: any) => {
      return response
    }))
  }

  getIGOTSuggestedCourses(reqBody) {
    // Use the reqBody parameter passed from the component
    // If no reqBody is provided, use default structure
    let req = reqBody || {
      "request": {
          "filters": {
              "primaryCategory": ["Course"],
              "status": ["Live"],
              "courseCategory":["Course"]
          },
          "fields":["posterImage","description","name"],
          "sort_by": {"createdOn": "desc"},
          "limit" : 12,
          "offset" : 0
      }
    };

    console.log('getIGOTSuggestedCourses final request:', JSON.stringify(req, null, 2));

    const headers = this.headers
    return this.http.post<any>(`https://portal.igotkarmayogi.gov.in/api/content/v1/search`, req, {headers})
      .pipe(map((response: any) => {
        return response
      }))
  }

  getSuggestedCourses(role_mapping_id) {
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.SUGGESTED_COURSE_LIST}/${role_mapping_id}`, {headers})
    .pipe(map((response: any) => {
      return response
    }))
  }

  saveSuggestedCourse(reqBody){
    const headers = this.headers
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.SAVE_COURSE_SUGGESTED_COURSE}`, reqBody, {headers})
      .pipe(map((response: any) => {
        return response
      }))
  }

  addDesignation(reqBody){
    const headers = this.headers
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.ADD_DESIGNATION}`, reqBody, {headers})
      .pipe(map((response: any) => {
        return response
      }))
  }

  performLogin(reqBody) {
    const body = new HttpParams()
    .set('username', reqBody.username)
    .set('password', reqBody.password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    });
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.LOGIN}`, body.toString(), { headers })
    .pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  logout() {
    const headers = this.headers
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.LOGOUT}`, '',{headers})
      .pipe(map((response: any) => {
        return response
      }))
  }

  setCBPPlanLocalStorage() {
    localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.cbpPlanFinalObj))
  }

  getCBPPlanLocalStorage() {
    let cbpPlanFinalObj = JSON.parse(localStorage.getItem('cbpPlanFinalObj'))
    return cbpPlanFinalObj
  }

  checkIfLogin() {
    let flag = false
    let loginData =  localStorage.getItem('loginData')
    if(loginData && JSON.parse(loginData)['access_token']) {
      flag = true
    } else {
      flag = false
    }
    return flag
  }

  deleteRoleMappingByStateAndDepartment(state_center_id, department_id) {
    const headers = this.headers
    return this.http.delete<any>(`${this.baseUrl}${API_END_POINTS.DELETE_ROLE_MAPPING_BY_STATE_CENTER}?state_center_id=${state_center_id}&department_id=${department_id}`, {headers})
    .pipe(map((response: any) => {
      return response
    }))
  }

  addUserCourse(reqBody){
    const headers = this.headers
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.ADD_USER_COURSES}`, reqBody, {headers})
      .pipe(map((response: any) => {
        return response
      }))
  }

  getUserCourse(role_mapping_id) {
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_USER_COURSES}/${role_mapping_id}`,  {headers})
      .pipe(map((response: any) => {
        return response
      }))
  }
}
