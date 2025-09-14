import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCourseRecommendationComponent } from './view-course-recommendation.component';

describe('ViewCourseRecommendationComponent', () => {
  let component: ViewCourseRecommendationComponent;
  let fixture: ComponentFixture<ViewCourseRecommendationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCourseRecommendationComponent]
    });
    fixture = TestBed.createComponent(ViewCourseRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
