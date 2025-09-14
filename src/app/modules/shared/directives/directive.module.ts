import { NgModule } from '@angular/core';
import {ClickOutsideDirective} from './clickoutside.directive'

@NgModule({
  imports:[
  ],
  declarations: [
    ClickOutsideDirective
  ],
  exports:[
    ClickOutsideDirective,
  ]
})
export class DirectiveModule { }
