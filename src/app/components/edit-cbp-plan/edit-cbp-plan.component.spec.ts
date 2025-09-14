import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCbpPlanComponent } from './edit-cbp-plan.component';

describe('EditCbpPlanComponent', () => {
  let component: EditCbpPlanComponent;
  let fixture: ComponentFixture<EditCbpPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCbpPlanComponent]
    });
    fixture = TestBed.createComponent(EditCbpPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
