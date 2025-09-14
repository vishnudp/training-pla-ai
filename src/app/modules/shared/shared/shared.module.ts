import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PipeDurationTransformModule } from '../components/pipes/pipe-duration-transform/pipe-duration-transform.module';
import { FormsModule } from '@angular/forms';
import { PipeFilterByProp } from '../pipes/filter-by-prop.pipe';
import { SkeletonLoaderModule } from '../components/skeleton-loader/skeleton-loader.module';
import { PopoverConfig, PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PipeFilterRoundInteger } from '../pipes/round-integer.pipe';
import { FileSaverModule } from 'ngx-filesaver';
import { PipePublicURLModule } from './../../../pipe-public-URL/pipe-public-URL.module';
import { CommoncomponentsModule } from './commoncomponents/commoncomponents.module';
import { MatCardModule } from '@angular/material/card';
export function getPopoverConfig(): PopoverConfig {
  return Object.assign(new PopoverConfig(), {
    placement: 'auto',
    // container: 'body',
    // triggers: 'focus'
  });
}



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    PipeFilterByProp,
    PipeFilterRoundInteger,
  ],
  imports: [
    CommonModule,
    CarouselModule,
    RouterModule,
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    PipeDurationTransformModule,
    FormsModule,
    SkeletonLoaderModule,
    FileSaverModule,
    PipePublicURLModule,
    CommoncomponentsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    PipeFilterByProp,
    PipeFilterRoundInteger,
    SkeletonLoaderModule,
    PipePublicURLModule,
    FileSaverModule,
  ],
  providers: [
    { provide: PopoverConfig, useFactory: getPopoverConfig }
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
