import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentEntriesPage } from './recent-entries.page';

describe('RecentEntriesPage', () => {
  let component: RecentEntriesPage;
  let fixture: ComponentFixture<RecentEntriesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentEntriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
