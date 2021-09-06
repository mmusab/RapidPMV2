import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetScreenComponent } from './password-reset-screen.component';

describe('PasswordResetScreenComponent', () => {
  let component: PasswordResetScreenComponent;
  let fixture: ComponentFixture<PasswordResetScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordResetScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
