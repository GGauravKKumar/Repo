import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBatches } from './admin-batches';

describe('AdminBatches', () => {
  let component: AdminBatches;
  let fixture: ComponentFixture<AdminBatches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBatches],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBatches);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
