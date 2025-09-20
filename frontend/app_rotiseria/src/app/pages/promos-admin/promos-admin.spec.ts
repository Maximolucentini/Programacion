import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromosAdmin } from './promos-admin';

describe('PromosAdmin', () => {
  let component: PromosAdmin;
  let fixture: ComponentFixture<PromosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromosAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromosAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
