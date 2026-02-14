import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkflow } from './edit-workflow';

describe('EditWorkflow', () => {
  let component: EditWorkflow;
  let fixture: ComponentFixture<EditWorkflow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWorkflow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWorkflow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
