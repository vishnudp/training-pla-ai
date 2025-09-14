import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestMoreCoursesComponent } from './suggest-more-courses.component';

describe('SuggestMoreCoursesComponent', () => {
  let component: SuggestMoreCoursesComponent;
  let fixture: ComponentFixture<SuggestMoreCoursesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuggestMoreCoursesComponent]
    });
    fixture = TestBed.createComponent(SuggestMoreCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
