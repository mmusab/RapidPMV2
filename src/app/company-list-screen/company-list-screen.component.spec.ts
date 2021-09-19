import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyListScreenComponent } from './company-list-screen.component';

describe('CompanyListScreenComponent', () => {
  let component: CompanyListScreenComponent;
  let fixture: ComponentFixture<CompanyListScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyListScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyListScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
