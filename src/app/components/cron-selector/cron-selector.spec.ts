import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CronSelector } from './cron-selector';

describe('CronSelector', () => {
  let component: CronSelector;
  let fixture: ComponentFixture<CronSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CronSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(CronSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
