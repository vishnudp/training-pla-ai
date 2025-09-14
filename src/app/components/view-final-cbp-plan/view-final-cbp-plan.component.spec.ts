import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFinalCbpPlanComponent } from './view-final-cbp-plan.component';

describe('ViewFinalCbpPlanComponent', () => {
  let component: ViewFinalCbpPlanComponent;
  let fixture: ComponentFixture<ViewFinalCbpPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewFinalCbpPlanComponent]
    });
    fixture = TestBed.createComponent(ViewFinalCbpPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
