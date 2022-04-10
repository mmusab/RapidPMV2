import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtefactTypeDefaultComponent } from './artefact-type-default.component';

describe('ArtefactTypeDefaultComponent', () => {
  let component: ArtefactTypeDefaultComponent;
  let fixture: ComponentFixture<ArtefactTypeDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtefactTypeDefaultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtefactTypeDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
