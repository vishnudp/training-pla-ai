import { APP_BASE_HREF } from '@angular/common'
// import { retry } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
/* tslint:disable */
import _ from 'lodash'
import { map } from 'rxjs/operators'
import { Observable, Subscription } from 'rxjs'


@Injectable({
  providedIn: 'root',
})
export class InitService {

  baseUrl: string
  configDetails: any

  constructor(
    private http: HttpClient,
  ) {

  }

  async init() {
    await this.setConfiDetails()
  }

  private async setConfiDetails(configDetails: any = null): Promise<any> {
    if (configDetails) {
      this.configDetails = configDetails
      this.baseUrl = configDetails.portalURL
    } else {
      try {

        if (this.configDetails) {
          return this.configDetails
        }
        const response = await this.http.get<any>('assets/jsonfiles/configurations.json').toPromise()
        if (response) {
          this.configDetails = response
          this.baseUrl = response.portalURL
        }
      } 
      catch(e) {
        throw new Error('could not fetch configurations')
      }
    }
  }
}
