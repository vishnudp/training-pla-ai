// role-mapping.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InitService } from './init.service';
import { Observable } from 'rxjs';

const API_END_POINTS = {
  GET_ROLE_MAPPING: 'cbp-tpc-ai/api/v1/role-mapping/generate_stream',
}

@Injectable({
  providedIn: 'root'
})
export class RoleMappingService {
  baseUrl: string
  configDetails: any
  screenWidth: number;
  headers:any
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
    // const storageData:any = JSON.parse(localStorage.getItem('loginData'))
    // console.log('storageData--', storageData)
    // this.headers = new HttpHeaders({
    //   'Authorization': `Bearer ${storageData?.access_token}`
    // });
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

  // async generateRoleMapping(
  //   reqBody: any,
  //   file: File[] | null,
  //   onChunk: (chunk: string) => void,
  //   onStart?: () => void,
  //   onEnd?: () => void,
  //   onError?: (error: any) => void
  // ): Promise<void> {
  //   const storageData:any = JSON.parse(localStorage.getItem('loginData'))
  //   console.log('storageData--', storageData)
  //   this.headers = new HttpHeaders({
  //     'Authorization': `Bearer ${storageData?.access_token}`
  //   });

  //   const headersObj: Record<string, string> = {};

  //   this.headers.keys().forEach(key => {
  //     const value = this.headers.get(key);
  //     if (value !== null) {
  //       headersObj[key] = value;
  //     }
  //   });
  //   const formData = new FormData();

  //   if (reqBody.state_center_id) {
  //     formData.append('state_center_id', reqBody.state_center_id);
  //   }

  //   if (reqBody.department_id) {
  //     formData.append('department_id', reqBody.department_id);
  //   }

  //   if (reqBody.instruction) {
  //     formData.append('instruction', reqBody.instruction);
  //   }

  //   // Add sector_name parameter as required by the API
  //   formData.append('sector_name', 'Government');

  //   if (file) {
  //     formData.append('additional_document', file);
  //   }

  //   try {
  //     const response = await fetch(`${this.baseUrl}${API_END_POINTS.GET_ROLE_MAPPING}`, {
  //       method: 'POST',
  //       body: formData,
  //       headers: headersObj
  //     });

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       let errorDetail = '';
        
  //       try {
  //         const errorJson = JSON.parse(errorText);
  //         errorDetail = errorJson.detail || `HTTP error! status: ${response.status}`;
  //       } catch {
  //         errorDetail = errorText || `HTTP error! status: ${response.status}`;
  //       }
        
  //       // Pass specific error details to onError callback
  //       if (onError) onError({ 
  //         status: response.status, 
  //         detail: errorDetail,
  //         isExistingRoleMapping: errorDetail.includes('Role mapping already exists')
  //       });
  //       return;
  //     }

  //     if (!response.body) {
  //       throw new Error(`Server responded with ${response.status}`);
  //     }

  //     const reader = response.body.getReader();
  //     const decoder = new TextDecoder('utf-8');
  //     let buffer = '';

  //     while (true) {
  //       const { value, done } = await reader.read();
  //       if (done) break;

  //       buffer += decoder.decode(value, { stream: true });

  //       const events = buffer.split('\n\n');
  //       buffer = events.pop() || ''; // Save incomplete event

  //       for (const rawEvent of events) {
  //         const lines = rawEvent.split('\n');
  //         let eventType = 'message';
  //         let data = '';

  //         for (const line of lines) {
  //           if (line.startsWith('event:')) {
  //             eventType = line.slice(6).trim();
  //           } else if (line.startsWith('data:')) {
  //             data += line.slice(5).trim();
  //           }
  //         }

  //         if (eventType === 'start' && onStart) onStart();
  //         else if (eventType === 'chunk') onChunk(JSON.parse(data).chunk);
  //         else if (eventType === 'end' && onEnd) onEnd();
  //       }
  //     }

  //     if (onEnd) onEnd();
  //   } catch (err) {
  //     console.error('Streaming error:', err);
  //     if (onError) onError(err);
  //   }
  // }

  async generateRoleMapping(
    reqBody: any,
    files: File | File[] | null,
    onChunk: (chunk: string) => void,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: any) => void
  ): Promise<void> {
    const storageData: any = JSON.parse(localStorage.getItem('loginData'));
    console.log('storageData--', storageData);
  
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${storageData?.access_token}`
    });
  
    const headersObj: Record<string, string> = {};
    this.headers.keys().forEach(key => {
      const value = this.headers.get(key);
      if (value !== null) {
        headersObj[key] = value;
      }
    });
  
    const formData = new FormData();
  
    if (reqBody.state_center_id) formData.append('state_center_id', reqBody.state_center_id);
    if (reqBody.department_id) formData.append('department_id', reqBody.department_id);
    if (reqBody.instruction) formData.append('instruction', reqBody.instruction);
  
    // Add sector_name parameter as required by the API
    formData.append('sector_name', 'Government');
    console.log('files------------', files)
    // Handle single or multiple files
    if (files) {
      if (Array.isArray(files)) {
        files.forEach((file, index) => {
          formData.append('additional_document', file, file.name);
        });
      } else {
        formData.append('additional_document', files, files.name);
      }
    }
  
    try {
      // After appending files and other fields
      console.log('FormData contents:');
      formData.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`${key}: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }); 

      const response = await fetch(`${this.baseUrl}${API_END_POINTS.GET_ROLE_MAPPING}`, {
        method: 'POST',
        body: formData,
        headers: headersObj
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        let errorDetail = '';
  
        try {
          const errorJson = JSON.parse(errorText);
          errorDetail = errorJson.detail || `HTTP error! status: ${response.status}`;
        } catch {
          errorDetail = errorText || `HTTP error! status: ${response.status}`;
        }
  
        if (onError) onError({ 
          status: response.status, 
          detail: errorDetail,
          isExistingRoleMapping: errorDetail.includes('Role mapping already exists')
        });
        return;
      }
  
      if (!response.body) {
        throw new Error(`Server responded with ${response.status}`);
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
  
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
  
        buffer += decoder.decode(value, { stream: true });
  
        const events = buffer.split('\n\n');
        buffer = events.pop() || ''; // Save incomplete event
  
        for (const rawEvent of events) {
          const lines = rawEvent.split('\n');
          let eventType = 'message';
          let data = '';
  
          for (const line of lines) {
            if (line.startsWith('event:')) eventType = line.slice(6).trim();
            else if (line.startsWith('data:')) data += line.slice(5).trim();
          }
  
          if (eventType === 'start' && onStart) onStart();
          else if (eventType === 'chunk') onChunk(JSON.parse(data).chunk);
          else if (eventType === 'end' && onEnd) onEnd();
        }
      }
  
      if (onEnd) onEnd();
    } catch (err) {
      console.error('Streaming error:', err);
      if (onError) onError(err);
    }
  }
  
}
