import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZorroBlancoExplicando3DComponent } from './zorro-blanco-explicando3-d.component';

describe('ZorroBlancoExplicando3DComponent', () => {
  let component: ZorroBlancoExplicando3DComponent;
  let fixture: ComponentFixture<ZorroBlancoExplicando3DComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZorroBlancoExplicando3DComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZorroBlancoExplicando3DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
