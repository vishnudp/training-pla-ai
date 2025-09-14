import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SkeletonLoaderComponent } from './skeleton-loader.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
    declarations: [SkeletonLoaderComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        SkeletonLoaderComponent,
    ]
})
export class SkeletonLoaderModule { }
