import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtefactDetailsComponent } from './artefact-details.component';

describe('ArtefactDetailsComponent', () => {
  let component: ArtefactDetailsComponent;
  let fixture: ComponentFixture<ArtefactDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtefactDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtefactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
