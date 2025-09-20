import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialAdmin } from './historial-admin';

describe('HistorialAdmin', () => {
  let component: HistorialAdmin;
  let fixture: ComponentFixture<HistorialAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
