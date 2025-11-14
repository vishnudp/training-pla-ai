import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SharedService } from './modules/shared/services/shared.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigResolver implements Resolve<any> {
  constructor(private sharedService: SharedService) {}

  resolve(): any {
    const config = {configDetails : this.sharedService.configDetails, baseUrl: this.sharedService.baseUrl};
    if (config) {
      return config; // returns the actual config object
    } else {
      // handle the case where config is not yet available
      // could return a default object, null, or throw an error
      return null;
    }
  }
}