import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRoleMappingComponent } from './delete-role-mapping.component';

describe('DeleteRoleMappingComponent', () => {
  let component: DeleteRoleMappingComponent;
  let fixture: ComponentFixture<DeleteRoleMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteRoleMappingComponent]
    });
    fixture = TestBed.createComponent(DeleteRoleMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
