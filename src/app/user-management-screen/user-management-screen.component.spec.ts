import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementScreenComponent } from './user-management-screen.component';

describe('UserManagementScreenComponent', () => {
  let component: UserManagementScreenComponent;
  let fixture: ComponentFixture<UserManagementScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserManagementScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
