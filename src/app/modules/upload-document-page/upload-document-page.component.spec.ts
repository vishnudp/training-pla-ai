import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentPageComponent } from './upload-document-page.component';

describe('UploadDocumentPageComponent', () => {
  let component: UploadDocumentPageComponent;
  let fixture: ComponentFixture<UploadDocumentPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadDocumentPageComponent]
    });
    fixture = TestBed.createComponent(UploadDocumentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
