import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add toast via show()', () => {
    service.show('Test message');
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].message).toBe('Test message');
    expect(service.toasts()[0].type).toBe('info');
  });

  it('should add success toast via success()', () => {
    service.success('Saved');
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].type).toBe('success');
  });

  it('should dismiss toast by id', () => {
    const id = service.show('Test');
    service.dismiss(id);
    expect(service.toasts().length).toBe(0);
  });

  it('should accept custom duration and dismissible', () => {
    service.show('Custom', { duration: 3000, dismissible: false });
    const toast = service.toasts()[0];
    expect(toast.duration).toBe(3000);
    expect(toast.dismissible).toBe(false);
  });
});
