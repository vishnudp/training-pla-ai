import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCourseRecommendationComponent } from './generate-course-recommendation.component';

describe('GenerateCourseRecommendationComponent', () => {
  let component: GenerateCourseRecommendationComponent;
  let fixture: ComponentFixture<GenerateCourseRecommendationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateCourseRecommendationComponent]
    });
    fixture = TestBed.createComponent(GenerateCourseRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
