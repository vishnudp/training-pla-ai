import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRoleMappingPopupComponent } from './delete-role-mapping-popup.component';

describe('DeleteRoleMappingPopupComponent', () => {
  let component: DeleteRoleMappingPopupComponent;
  let fixture: ComponentFixture<DeleteRoleMappingPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteRoleMappingPopupComponent]
    });
    fixture = TestBed.createComponent(DeleteRoleMappingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
