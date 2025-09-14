import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCbpPlanComponent } from './view-cbp-plan.component';

describe('ViewCbpPlanComponent', () => {
  let component: ViewCbpPlanComponent;
  let fixture: ComponentFixture<ViewCbpPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCbpPlanComponent]
    });
    fixture = TestBed.createComponent(ViewCbpPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
