import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAdmin } from './menu-admin';

describe('MenuAdmin', () => {
  let component: MenuAdmin;
  let fixture: ComponentFixture<MenuAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
