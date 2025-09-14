import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMappingGenerationComponent } from './role-mapping-generation.component';

describe('RoleMappingGenerationComponent', () => {
  let component: RoleMappingGenerationComponent;
  let fixture: ComponentFixture<RoleMappingGenerationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleMappingGenerationComponent]
    });
    fixture = TestBed.createComponent(RoleMappingGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
