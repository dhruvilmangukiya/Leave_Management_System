import { TestBed } from '@angular/core/testing';

import { StudentLeaveService } from './student-leave.service';

describe('StudentLeaveService', () => {
  let service: StudentLeaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentLeaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
