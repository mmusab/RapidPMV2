import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtefactTemplateSelectionComponent } from './artefact-template-selection.component';

describe('ArtefactTemplateSelectionComponent', () => {
  let component: ArtefactTemplateSelectionComponent;
  let fixture: ComponentFixture<ArtefactTemplateSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtefactTemplateSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtefactTemplateSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
