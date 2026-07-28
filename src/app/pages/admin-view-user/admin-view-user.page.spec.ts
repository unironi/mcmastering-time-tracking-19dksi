import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminViewUserPage } from './admin-view-user.page';

describe('AdminViewUserPage', () => {
  let component: AdminViewUserPage;
  let fixture: ComponentFixture<AdminViewUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
