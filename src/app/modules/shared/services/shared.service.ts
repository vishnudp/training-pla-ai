import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
//Injectable
import { HostListener, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { InitService } from './init.service';
// import configuration from '../../../../assets/jsonfiles/configurations.json'

const API_END_POINTS = {
  FETCH_COURSES: 'api/v1/course/v2/explore',
  FETCH_POSTAL_COURSES: 'api/v1/content/v1/search',
  FETCH_RAILWAY_COURSES: 'api/v1/content/v1/search',
  FETCH_HALL_OF_FAME: 'api/v1/halloffame/read',
  NLW_FORM_READ: 'apis/v1/static/form/v1/read',
  FETCH_TENDERS: 'api/v1/content/v1/search',
  GET_STATE_CENTER: 'cbp-tpc-ai/api/v1/state-center',
  GET_ROLE_MAPPING: 'cbp-tpc-ai/api/v1/role-mapping/generate',
  DELETE_ROLE_MAPPING: 'cbp-tpc-ai/api/v1/role-mapping/delete',
  GET_DEPARTMENT: 'cbp-tpc-ai/api/v1/department/state-center',
  GET_ROLE_MAPPING_BY_STATE_CENTER: 'cbp-tpc-ai/api/v1/role-mapping/state-center',
  GET_ROLE_MAPPING_BY_STATE_CENTER_DEPARTMENT: 'cbp-tpc-ai/api/v1/role-mapping/state-center',
  UPDATE_ROLE_MAPPING: 'cbp-tpc-ai/api/v1/role-mapping',
  GET_RECOMMENDED_COURSE: 'cbp-tpc-ai/api/v1/',
  SAVE_COURSES: 'cbp-tpc-ai/api/v1/cbp-plan/save',
  GET_COURSES: 'cbp-tpc-ai/api/v1/cbp-plan',
  UPDATE_COURSES: 'cbp-tpc-ai/api/v1/cbp-plan',
  IGOT_SUGGESTED_COURSE: 'api/v1/content/v1/search',
  SAVE_COURSE_SUGGESTED_COURSE: 'cbp-tpc-ai/api/v1/course/suggestions/save',
  SUGGESTED_COURSE_LIST: 'cbp-tpc-ai/api/v1/course/suggestions',
  ADD_DESIGNATION: 'cbp-tpc-ai/api/v1/role-mapping/add-designation',
  LOGIN: 'cbp-tpc-ai/api/v1/auth/login',
  LOGOUT: 'cbp-tpc-ai/api/v1/auth/logout',
  DELETE_ROLE_MAPPING_BY_STATE_CENTER: 'cbp-tpc-ai/api/v1/role-mapping',
  ADD_USER_COURSES: 'cbp-tpc-ai/api/v1/user-added-courses',
  GET_USER_COURSES: 'cbp-tpc-ai/api/v1/user-added-courses/role-mapping',
  GET_USER_SELECTED_COURSES: 'cbp-tpc-ai/api/v1/cbp-plan',
  UPLOAD_DOCUMENT: 'cbp-tpc-ai/api/v1/files',
  GET_DOCUMENTS: 'cbp-tpc-ai/api/v1/files',
  DELETE_FILE: 'cbp-tpc-ai/api/v1/files',
  TRIGGER_FILE_SUMMARY: 'cbp-tpc-ai/api/v1/files',
  DOWNLOAD_FILE: 'cbp-tpc-ai/api/v1/files',
  DELETE_SUMMARY: 'cbp-tpc-ai/api/v1/files',
  GET_USER_PROFILE: 'cbp-tpc-ai/api/v1/users/me',
  GET_USER_RECOMMENED_COURSES: 'cbp-tpc-ai/api/v1/course-recommendations',
  DOWNLOAD_PDF: 'cbp-tpc-ai/api/v1/cbp-plan/download',
  CENTER_BASED_MINISTRY: 'cbp-tpc-ai/api/v1/department/state-center',
  DOWNLOAD_COURSE_RECOMMENDATION: 'cbp-tpc-ai/api/v1/course-recommendations/report/download'
}



// @Directive()
@Injectable({
  providedIn: 'root'
})

export class SharedService {
  cbpPlanFinalObj: any = {}
  baseUrl: string
  configDetails: any
  screenWidth: number;
  headers: any
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
    const storageData: any = JSON.parse(localStorage.getItem('loginData'))
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


  getMinistryData(ministryType) {
    let sub_org_type = ''
    if (ministryType == 'ministry') {
      sub_org_type = 'ministry'
    } else {
      sub_org_type = 'state'
    }
    const storageData: any = JSON.parse(localStorage.getItem('loginData'))
    console.log('storageData--', storageData)
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${storageData?.access_token}`
    });
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_STATE_CENTER}/?sub_org_type=${sub_org_type}`, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  generateRoleMapping(reqBody, files?: File | File[]) {
    console.log('reqBody--', reqBody);
    console.log('files---', files)
    const formData = new FormData();

    // Add required fields
    if (reqBody.state_center_id) {
      formData.append('state_center_id', reqBody.state_center_id);
    }

    if (reqBody.state_center_name) {
      formData.append('state_center_name', reqBody.state_center_name);
    }

    if (reqBody.department_id) {
      formData.append('department_id', reqBody.department_id);
    }

    if (reqBody.department_name) {
      formData.append('department_name', reqBody.department_name);
    }

    if (reqBody.instruction) {
      formData.append('instruction', reqBody.instruction);
    }

    // Handle multiple or single file
    if (files) {
      if (Array.isArray(files)) {
        files.forEach((file: File) => {
          formData.append('additional_document', file, file.name);
        });
      } else {
        // Single file
        formData.append('additional_document', files, files.name);
      }
    }

    // Debug FormData content
    console.log("FormData contents:");
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key}: FILE -> ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });

    const headers = this.headers;

    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.GET_ROLE_MAPPING}`, formData, { headers })
      .pipe(map((response: any) => {
        return response;
      }));
  }



  getDepartmentList(ministryId) {
    const storageData: any = JSON.parse(localStorage.getItem('loginData'))
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${storageData?.access_token}`
    });
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_DEPARTMENT}/${ministryId}`, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  getRoleMappingByStateCenter(state_center_id) {
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_ROLE_MAPPING_BY_STATE_CENTER}/${state_center_id}`, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  getRoleMappingByStateCenterAndDepartment(state_center_id, department_id) {
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_ROLE_MAPPING_BY_STATE_CENTER}/${state_center_id}/department/${department_id}`, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  updateRoleMapping(role_mapping_id, reqBody) {
    const headers = this.headers
    return this.http.put<any>(`${this.baseUrl}${API_END_POINTS.UPDATE_ROLE_MAPPING}/${role_mapping_id}`, reqBody, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  deleteRoleMapping(role_mapping_id) {
    const headers = this.headers
    return this.http.delete<any>(`${this.baseUrl}${API_END_POINTS.UPDATE_ROLE_MAPPING}/${role_mapping_id}`, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  getRecommendedCourse(role_mapping_id) {
    const headers = this.headers
    let reqBody = {
      role_mapping_id: role_mapping_id
    }
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.GET_RECOMMENDED_COURSE}/course-recommendations/generate`, reqBody, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  deleteCourseRecommendations(roleMapId: string) {
    const headers = this.headers
    return this.http.delete<any>(`${this.baseUrl}${API_END_POINTS.GET_RECOMMENDED_COURSE}/course-recommendations/role-mapping/${roleMapId}`, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  saveCourse(reqBody) {
    const headers = this.headers
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.SAVE_COURSES}`, reqBody, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }
  updateCourse(reqBody, cbp_plan_id) {
    const headers = this.headers
    return this.http.put<any>(`${this.baseUrl}${API_END_POINTS.UPDATE_COURSES}/${cbp_plan_id}`, reqBody, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  getCourse(role_mapping_id) {
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_COURSES}?role_mapping_id=${role_mapping_id}`, { headers })
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
          "courseCategory": ["Course"]
        },
        "fields": ["posterImage", "description", "name"],
        "sort_by": { "createdOn": "desc" },
        "limit": 12,
        "offset": 0
      }
    };

    console.log('getIGOTSuggestedCourses final request:', JSON.stringify(req, null, 2));

    const headers = this.headers
    return this.http.post<any>(`https://portal.igotkarmayogi.gov.in/api/content/v1/search`, req, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  getSuggestedCourses(role_mapping_id) {
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.SUGGESTED_COURSE_LIST}/${role_mapping_id}`, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  saveSuggestedCourse(reqBody) {
    const headers = this.headers
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.SAVE_COURSE_SUGGESTED_COURSE}`, reqBody, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  addDesignation(reqBody) {
    const headers = this.headers
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.ADD_DESIGNATION}`, reqBody, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  performLogin(reqBody) {
    const body = new HttpParams()
      .set('username', reqBody.username)
      .set('password', reqBody.password);
    console.log('in login uat')
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
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.LOGOUT}`, '', { headers })
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
    let loginData = localStorage.getItem('loginData')
    if (loginData && JSON.parse(loginData)['access_token']) {
      flag = true
    } else {
      flag = false
    }
    return flag
  }

  deleteRoleMappingByStateAndDepartment(state_center_id, department_id) {
    const headers = this.headers
    return this.http.delete<any>(`${this.baseUrl}${API_END_POINTS.DELETE_ROLE_MAPPING_BY_STATE_CENTER}?state_center_id=${state_center_id}&department_id=${department_id}`, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  addUserCourse(reqBody) {
    const headers = this.headers
    return this.http.post<any>(`${this.baseUrl}${API_END_POINTS.ADD_USER_COURSES}`, reqBody, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  getUserCourse(role_mapping_id) {
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_USER_COURSES}/${role_mapping_id}`, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  getCompetencyJson() {
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}/training-pla-ai/assets/jsonfiles/competencies.json`, { headers })
      .pipe(map((response: any) => {
        return response
      }))
    // this.http.get<any[]>('/assets/jsonfiles/competencies.json')
  }

  convert(seconds: number): string {
    if (!seconds || seconds <= 0) {
      return 'N/A';
    }

    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    if (hours > 0) {
      // For durations with hours, show hours and minutes (e.g., "3h 10m")
      if (minutes > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${hours}h`;
      }
    } else if (minutes > 0) {
      // For durations under an hour, show minutes and seconds (e.g., "58m 3s")
      if (remainingSeconds > 0) {
        return `${minutes}m ${remainingSeconds}s`;
      } else {
        return `${minutes}m`;
      }
    } else {
      // For durations under a minute, show seconds only
      return `${remainingSeconds}s`;
    }
  }

  getUserProfile() {
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_USER_PROFILE}`, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  getUserRecommendationCourse(role_mapping_id) {
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.GET_USER_SELECTED_COURSES}?role_mapping_id=${role_mapping_id}`, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }

  downloadPdf(state_center_id: string) {
    const url = `${this.baseUrl}${API_END_POINTS.DOWNLOAD_PDF}?state_center_id=${state_center_id}`;
    const headers = this.headers

    return this.http.get(url, {
      headers,
      observe: 'response',
      responseType: 'blob'
    }).subscribe((res: any) => {

      const contentDisposition = res.headers.get('content-disposition');
      console.log('contentDisposition', res.headers)
      let filename = `CBP_Report_${state_center_id}.pdf`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      // Create a blob URL and download
      const blob = new Blob([res.body], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(downloadUrl);
    });
  }

  downloadPdfForDepartment(state_center_id, department_id: string) {
    const url = `${this.baseUrl}${API_END_POINTS.DOWNLOAD_PDF}?state_center_id=${state_center_id}&department_id=${department_id}`;
    const headers = this.headers

    return this.http.get(url, {
      headers,
      observe: 'response',
      responseType: 'blob'
    }).subscribe((res: any) => {

      const contentDisposition = res.headers.get('content-disposition');
      console.log('contentDisposition', res.headers)
      let filename = `CBP_Report_${state_center_id}_${department_id}.pdf`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      // Create a blob URL and download
      const blob = new Blob([res.body], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(downloadUrl);
    });
  }

  getCenterBasedDepartment(state_center_id) {
   // let reqBody = { "request": { "filters": { "status": 1, "ministryOrStateType": "ministry", "ministryOrStateId": state_center_id}, "sort_by": { "createdDate": "desc" }, "limit": 9999, "offset": 0, "fields": ["identifier", "orgName", "description", "parentOrgName", "ministryOrStateId", "ministryOrStateType", "ministryOrStateName", "sbOrgSubType"] } }
    const headers = this.headers
    return this.http.get<any>(`${this.baseUrl}${API_END_POINTS.CENTER_BASED_MINISTRY}/${state_center_id}?limit=9999&offset=0&sub_org_type=ministry`, { headers })
      .pipe(map((response: any) => {
        return response
      }))
  }


  downloadPdfForCourseRecommendation(state_center_id) {
    
    const url = `${this.baseUrl}${API_END_POINTS.DOWNLOAD_COURSE_RECOMMENDATION}?role_mapping_id=${state_center_id}`;
    const headers = this.headers

    return this.http.get(url, {
      headers,
      observe: 'response',
      responseType: 'blob'
    }).subscribe((res: any) => {

      const contentDisposition = res.headers.get('content-disposition');
      let filename = `COURSE_RECOMMENDATION_Report_${state_center_id}.pdf`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      // Create a blob URL and download
      const blob = new Blob([res.body], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(downloadUrl);
    });
  }


}

