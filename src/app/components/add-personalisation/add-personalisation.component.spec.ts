import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonalisationComponent } from './add-personalisation.component';

describe('AddPersonalisationComponent', () => {
  let component: AddPersonalisationComponent;
  let fixture: ComponentFixture<AddPersonalisationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPersonalisationComponent]
    });
    fixture = TestBed.createComponent(AddPersonalisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
