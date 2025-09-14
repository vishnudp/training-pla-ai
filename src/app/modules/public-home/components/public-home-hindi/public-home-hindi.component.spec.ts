import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PublicHomeHindiComponent } from './public-home-hindi.component';

describe('PublicHomeHindiComponent', () => {
  let component: PublicHomeHindiComponent;
  let fixture: ComponentFixture<PublicHomeHindiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicHomeHindiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicHomeHindiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
