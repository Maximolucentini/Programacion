import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelRol } from './panel-rol';

describe('PanelRol', () => {
  let component: PanelRol;
  let fixture: ComponentFixture<PanelRol>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelRol]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelRol);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
