import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GapAnalysisRecommendedCourseComponent } from './gap-analysis-recommended-course.component';

describe('GapAnalysisRecommendedCourseComponent', () => {
  let component: GapAnalysisRecommendedCourseComponent;
  let fixture: ComponentFixture<GapAnalysisRecommendedCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GapAnalysisRecommendedCourseComponent]
    });
    fixture = TestBed.createComponent(GapAnalysisRecommendedCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
